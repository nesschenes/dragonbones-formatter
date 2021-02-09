import { ipcMain, IpcMainEvent } from "electron";
import { basename } from 'path';
import { DragonBoneUtils } from './dragonBoneUtils';

export class DragonBoneRenamer {
    private paths: string[];
    private newName: string;

    public constructor() {
        ipcMain.on("file", this.setFile);
        ipcMain.on("name", this.setName);
        ipcMain.on("rename", this.rename);
    }

    public setFile(event: IpcMainEvent, path: string): void {
        let baseName = basename(path);
        this.paths = DragonBoneUtils.findDependencies(path);
        if (this.paths && this.paths.length > 0) {
            event.sender.send("file-reply", this.paths, DragonBoneUtils.getName(this.paths[0]), null);
        } else {
            event.sender.send("file-reply", path, null, `${baseName} is not a valid DragonBone file!`);
        }
    }

    public setName(event: IpcMainEvent, name: string): void {
        this.newName = name;
        if (name == null) {
            return;
        }
        
        let paths: string[] = DragonBoneUtils.getReplacedPaths(this.paths, name);
        if (paths && paths.length > 0) {
            event.sender.send("name-reply", paths);
        } else {
            event.sender.send("name-reply", name, `unknown error occurred!`);
        }
    }

    public rename(event: IpcMainEvent): void {
        let results = DragonBoneUtils.rename(this.paths, this.newName);
        event.sender.send("rename-reply", '完成');
    }
}