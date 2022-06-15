const chokidar = require('chokidar');
const dotenv = require('dotenv');
const fs = require('fs');
const {promisify} = require('util');
const readline = require('readline');
const {google} = require('googleapis');
const mime = require('mime-types');
// const {GoogleAuth} = require('google-auth-library');
const path = require('path');
const chalk = require('chalk');
dotenv.config()
const readF = promisify(fs.readdir);


// AUTHENTICATION
const KEY_PATH = path.resolve(__dirname ,'token.json');
const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({keyFile: KEY_PATH, scopes: scopes})

// THE WATCHER   
const folderPath = 'D:\\theFolderToBeWatched';
// chokidar.watch(folderPath).on('add', (path,stats) => {
//     //UploadFile(auth)
//     console.log(path);
// });

const readFolder = async()=>{
    try {
        const files = await readF(folderPath)
        files.forEach(file => {
            UploadFile(auth, file)
        });     
    } catch (error) {
        console.log(error.message)
    }
}
readFolder()


//GOOGLE DRIVE
//const KEY_PATH = require('./token.json')
// const auth = new google.auth.JWT(
//     KEY_PATH.client_email, null,
//     KEY_PATH.private_key, scopes
// );


async function UploadFile(auth, fileName) {
    const drive = google.drive({version: 'v3', auth})
    const fileMetadata = {
        'name': fileName,
        'parents': ['1ve1eEX3xf_CRDVUetk4YGeA1J9wiluP1']
    };
    const media = {
        mimeType: getMimeType(fileName), //application/CDFV2 for revit files
        body: fs.createReadStream(path.resolve( folderPath,fileName)),
    };
    try {
        const res = await drive.files.create({resource: fileMetadata, media: media, fields: 'id'})
        console.log(res.status)
        console.log(chalk.green.bold('DONE'))        
    } catch (error) {
        console.log(error.message)
    }
}






const getFileEx = (file)=>{
    return file.split(".")[1];
}

const getMimeType = (file)=>{
    switch(getFileEx(file)){
        case 'dyn':
            return 'application/json';
        case 'rvt':
            return 'application/CDFV2';
        default:
            return mime.lookup(file); 
    };
};

