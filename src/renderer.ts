// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { basename, dirname } from 'path';

var nameText = <HTMLInputElement>document.getElementById("name");
nameText.addEventListener("input", function () {
    ipcRenderer.send("name", nameText.value);
});

var renameButton = document.getElementById("rename");
renameButton.addEventListener("click", function () {
    ipcRenderer.send("rename");
});

var fileDragHandler = document.getElementById('file');
fileDragHandler.ondragover = () => {
    return false;
};

fileDragHandler.ondragleave = () => {
    return false;
};

fileDragHandler.ondragend = () => {
    return false;
};

fileDragHandler.ondrop = (e: DragEvent) => {
    e.preventDefault();

    let path = e.dataTransfer.files[0].path;
    ipcRenderer.send("file", path);

    return false;
};

ipcRenderer.on("file-reply", (event: IpcRendererEvent, paths: string[], name: string, err: string) => {
    let info = document.getElementById('info');
    if (info) info.remove();
    // clear list first.
    let fileList = document.getElementById("fromFileList");
    fileList.innerHTML = '';

    if (!err) {
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let dirName = dirname(path);
            let baseName = basename(path);
            let node = document.createElement('p');
            node.innerText = `${dirName}/`;
            let basenameNode = document.createElement('span'); 
            basenameNode.className = 'basename';
            basenameNode.innerText = baseName;
            node.appendChild(basenameNode);
            fileList.appendChild(node);
        }

        document.getElementById('inputNameField').style.display = "block";
        document.getElementById('fromFile').style.display = "block";
        document.getElementById('rename').style.display = "block";
    } else {
        document.getElementById('inputNameField').style.display = "none";
        document.getElementById('fromFile').style.display = "none";
        document.getElementById('rename').style.display = "none";
        throw new Error(err);
    }

    nameText.value = name;
    ipcRenderer.send("name", name);
});

ipcRenderer.on("name-reply", (event: IpcRendererEvent, paths: string[], err: string) => {
    // clear list first.
    let fileList = document.getElementById("toFileList");
    fileList.innerHTML = '';

    if (!err) {
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let dirName = dirname(path);
            let baseName = basename(path);
            let node = document.createElement('p');
            node.innerText = `${dirName}/`;
            let basenameNode = document.createElement('span'); 
            basenameNode.className = 'basename';
            basenameNode.innerText = baseName;
            node.appendChild(basenameNode);
            fileList.appendChild(node);
        }

        document.getElementById('toFile').style.display = "block";
    } else {
        document.getElementById('toFile').style.display = 'none';
        throw new Error(err);
    }
});

ipcRenderer.on("rename-reply", (event: IpcRendererEvent, msg: string) => {
    let renameDiv = document.getElementById("renameDiv");
    let node = document.createElement('h3');
    node.id = "info";
    node.innerText = msg;
    node.style.color = '#00ff00';
    node.style.borderStyle = 'dashed';
    node.style.borderColor = '#00ff00';
    renameDiv.appendChild(node);
    document.getElementById('rename').style.display = "none";
});