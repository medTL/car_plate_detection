import axios from "axios";
import fs from 'fs';
import FormData from "form-data";
import promptSync  from "prompt-sync";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners";
import { throws } from "assert";
const prompt = promptSync()
const predictFromImageFile = (file_path) => {
    try {
        if(!fs.existsSync(file_path))
        {
          console.error("\x1b[31m","File not found!")
          return;
        }
        const file = fs.createReadStream(file_path)
       
        let bodyFormData = new FormData();
        bodyFormData.append('imageData', file);
        axios({
            method: "post",
            url: "http://localhost:80/image",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
            
                console.log(response.data);
               
            })
            .catch(function (error) {
                //handle error
                
                console.error("\x1b[31m",error?.response?.data);
                 
            });
    } catch (error) {
        console.error("\x1b[31m",error);
    }
 

}



const predictFromUrl = (url) => {
    try {
        axios({
            method: "post",
            url: "http://localhost:80/url",
            data: { "url": url },
            headers: { "Content-Type": "application/json" },
        })
            .then(function (response) {
                //handle success
                console.log(response.data);
            })
            .catch(function (error) {
                //handle error
                console.error("\x1b[31m",error.response?.data);
            });
    } catch (error) {
        console.log("\x1b[31m",error)
    }
  
}

const main = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "Prediction_Type",
                message: "Select a prediction type",
                choices: ["File Image", "Image Url"]
            }
        ])
        .then((answers) => {
            switch (answers.Prediction_Type) {
                case "File Image":
                    const file_path = prompt("Enter file path: ");
                    predictFromImageFile(file_path);
                    break;
                case "Image Url":
                    const url = prompt("Enter image url: ");
                    predictFromUrl(url)
                    break;
            }
        });
}

main()
