/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import * as qr from "qr-image";
import * as fs from "fs";

const question = {
    type: 'input',
    name: 'url',
    message: 'Enter a valid URL: \n',
}; //actually specify the question object, not a string

inquirer.prompt([question]).then((ans)=>{
    console.log(typeof(ans), ans);
    var qr_png = qr.image(ans['url'], {type:'png'}); //both question and answer are object with fields, not plain strings
    qr_png.pipe(fs.createWriteStream('user_qr.png'));
    //var qr_string = qr.imageSync()
})
.catch((error) => { 
    if (error.isTtyError) {
    console.log("Prompt couldn't be rendered in the current environment");
  } else {
    console.log(error);
  }
});