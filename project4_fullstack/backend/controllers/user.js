const {User, validate} = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/confirmation"); //util functions from the util library
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//the following two methods are kind of a boilerplate, but it's good to know them well before making them boilerplate.
const createTransporter = async () => {
    const oauth2client = new OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground",
    );

    oauth2client.setCredentials({
        refresh_token : process.env.OAUTH_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
        //ensure that the refreshToken is created at the playground with Use your own OAuth credentials on the settings panel
        oauth2client.getAccessToken((err, token)=>{
            if(err) {
                console.log(err);
                reject();
            } 
            resolve(token);
        });
    });

    const Transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type:"OAuth2",
            user: process.env.GMAIL_EMAIL,
            accessToken,
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
    });

    return Transport;
}


const sendEmail = async ({email, username, res}) => {
    const confirmToken = encrypt(username); //create an unique confirmation token
    // const apiUrl = process.env.API_URL || "http://localhost:4000/api"; 
    // 4000 is verify backend, 3000 is verify frontend
    
    //initialize the nodemailer using the developer's gmail credentials
    const Transport = await createTransporter();

    //automate an email to your inbox
    const mailOptions = {
        from:"Educative Fullstack Course App",
        to: email,
        subject: "email confirmation",
        html: `Press the following link to verify your email: <a href=http://localhost:3000/verify/${confirmToken}>Verification Link</a>`,
    };

    //send the email to the registered user's inbox
    Transport.sendMail(mailOptions, (error, response)=>{
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).json({
                message: "Account created successfully, please verify your email.",
            });
        }
    });

};

exports.verifyEmail = async (req, res) => {
    try {
        const { confirmToken } = req.params; //the token created from encrypting the username
        const username = decrypt(confirmToken); //decrypt the username
        
        const user = await User.findOne({username: username}); //retrieve the newly created username from the db

        if(user) {
            user.isConfirmed = true;
            await user.save(); //save the current state (confirmed = true) to the database to verify the email

            //return the created user data that's being confirmed by the server
            return res.status(201).json({
                message: "User verified successfully", 
                data: user 
            });
        } else {
            return res.status(409).send("User not found");
        }
    } catch (error) {
        console.error(err);
        return res.status(400).send(err); //400 means bad request, the request is not in the format we want
    }
}

// process the user information submitted by the client in this controller file
exports.signup = async (req, res) => {
    try { 
        const {error} = validate(req.body); //user object is wrapped in req.body and validate() returns an obj wrapping up the error
        if(error) return res.status(400).send(error.details[0].message);

        const {firstName, lastName, username, email, password} = req.body; //unpack after validating it
        
        const emailExists = await User.findOne({ email, username });
        const usernameExists = await User.findOne({ username });
        if (emailExists) { //conflict with the current state of the target resource, means something we want to post exist already in this logic
          return res.status(409).send("Email Already Exist. Please Login");
        }
        if (usernameExists) {
          return res.status(409).send("Username Already Exist. Please Login");
        }
        
        //hash the password by bcrypt
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPwd = await bcrypt.hash(password, salt);

        // create the actual user object given that the user associated with the email is empty
        // new User() is not async, so we do not use it here?
        let user = await User.create({
            firstName, 
            lastName, 
            username, 
            email:email.toLowerCase(), 
            password:hashedPwd});
        
        //create the token associated with the usr
        const token = jwt.sign(
            {userId: user._id, email},
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn: "2h", //set up the session length for user login
            }
        );
        user.token = token; //maintain a new field for tracking in the database to fetch
        
        //prompt the created user to the sendEmail method and await res to send json to client once email created
        return sendEmail({ email, username, res });

    } catch(err) {
        console.error(err);
    }
}

exports.login = async (req, res) => {
    try {
        //get user data
        const {emailOrUsername, password} = req.body;

        //validate user data
        if(!(emailOrUsername && password)) {
            res.status(400).send("All data (email/username, password) is required");
        }

        //use regex to capture given value is username or email
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const data = regexEmail.test(emailOrUsername)
        ? {email: emailOrUsername,} : {username: emailOrUsername,};

        //validate if user exist in database
        const user = await User.findOne(data); //either email or username wrapped in {}

        if(user && (await bcrypt.compare(password, user.password))) { //compare the password as well
            //create token
            const email = user.email;
            const token = jwt.sign({user_id: user._id, email},
                process.env.TOKEN_SECRET_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return the user data to the frontend
            return res.status(200).json(user);

        } else {
            res.status(400).send("Invalid Credentials");
        }
        
    } catch (err) {
        console.error(err);
        return res.status(400).send(err.message);
    }
}