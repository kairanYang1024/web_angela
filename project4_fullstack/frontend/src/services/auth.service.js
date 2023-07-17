import axios from "axios";  // HTTP Client, axios makes http requests like get, post, put, delete... like postman and HTML methods

// The API endpoint to communicate with the server, previously stored in the backend controller file
const API_URL = "http://localhost:4000/api";  

//services on the front end to handle login and register routes
const signup = ({firstName, lastName, username, email, password}) => {
    //remember, at front end, the route is called /signup while at backend it is called /register
    return axios.post(`${API_URL}/register`, {firstName, lastName, username, email, password}); //returns JavaScript promises for all operations, allowing developers to use asynchronous operations
}

const verify = (confirmToken) => { 
    //wrapped from the front end to let user click to trigger verify on backend (set verified=true in db)
    return axios.get(`${API_URL}/verify/${confirmToken}`);
}

const login = ({emailOrUsername, password}) => {
    return axios.post(`${API_URL}/login`, { emailOrUsername, password }).then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data)); //store the user data including the token in the localStorage
        return res.data;
    });
}

const logout = () => { //very simplistic
    localStorage.removeItem("user");
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user")); //localStorage functions as a cache to the browser data
}

const AuthService = {
    signup,
    login,
    verify,
    logout,
    getCurrentUser,
};
  
export default AuthService;