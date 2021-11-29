const dropboxV2Api = require('dropbox-v2-api');
var dotenv = require('dotenv'); 
dotenv.config();
const fs = require('fs')

const dropbox = dropboxV2Api.authenticate({
    token: process.env.ACCESS_TOKEN
});

async function download_file(path, output) {
    await dropbox({
        resource: 'files/download',
        parameters: {
            path: path
        }
    }, (err) => {
        if (err) throw Error;
    })
    .pipe(fs.createWriteStream(output))

}

async function download_folder(path, output) {   
    await dropbox({
        resource: 'files/list_folder',
        parameters: {
            path: path
        }
    }, (err, result) => {
        if (err) throw Error;
        for (var i=0; i < result.entries.length; i++) {
            f = result.entries[i]
            download_file(f.path_display, output + "/" + f.name)
        }
    });
}

function upload_file(f, path) {
    const dropboxUploadStream = dropbox({
        resource: 'files/upload',
        parameters: {
            path: path
        }
    }, (err, result) => {
        if (err) console.log(err);
        console.log(result)
    });
    fs.createReadStream(f).pipe(dropboxUploadStream);
}

function get_icon_names() {
    var icons = []
    const dir = fs.opendirSync('public/icons')
    let dirent;
    while ((dirent = dir.readSync()) !== null) {
        icons.push(dirent.name)
    }
    dir.closeSync()
    return icons
}

module.exports = {
    upload_file,
    download_folder,
    download_file,
    get_icon_names
}

