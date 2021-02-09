import { dirname, basename } from 'path';
import { renameSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

export class DragonBoneUtils {
    public static suffixes: string[] = [
        '_ske.json',
        '_tex.json',
        '_tex.png',
        '_tex_[0-9].json',
        '_tex_[0-9].png'
    ]

    public static getRegExp(): RegExp {
        let pattern = '';
        for (let i = 0; i < this.suffixes.length; i++) {
            let suffix = this.suffixes[i];
            if (i != this.suffixes.length - 1) {
                pattern += `${suffix}|`;
            } else {
                pattern += suffix;
            }
        }

        return new RegExp(pattern);
    }

    public static getName(path: string): string {
        let baseName = basename(path);
        let regExp = this.getRegExp();
        let index = baseName.search(regExp);
        if (index == -1) return null;
        return baseName.slice(0, index);
    }

    /** 檢查是否為合法的龍骨檔案，接受 _ske.json, _tex.json, _tex_[0-9].json, _tex.png, _tex_[0-9].png */
    public static isValidFile(path: string): boolean {
        let regExp = this.getRegExp();
        return regExp.test(path);
    }

    /** 找到所有相關檔案 */
    public static findDependencies(path: string): string[] {
        let regExp = this.getRegExp();
        if (!regExp.test(path)) {
            return null;
        }
        
        path = path.replace(regExp, '');
        let files: string[] = []
        for (let i = 0; i < this.suffixes.length; i++) {
            let suffix = this.suffixes[i];
            let file = `${path}${suffix}`;
            files = files.concat(glob.sync(file));
        }

        return files;
    }

    public static getReplacedPaths(paths: string[], name: string): string[] {
        if (!paths || paths.length == 0) {
            return null;
        }

        let regExp = this.getRegExp();
        let results: string[] = [];
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let baseName = basename(path);
            let index = baseName.search(regExp);
            if (index == -1) continue;
            let dirName = dirname(path);
            let suffix = baseName.slice(index);
            let result = `${dirName}\\${name}${suffix}`;
            results.push(result);
        }

        return results;
    }

    public static rename(paths: string[], name: string): string[] {
        if (!paths || paths.length == 0) {
            return null;
        }

        let results = this.getReplacedPaths(paths, name);
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let newPath = results[i];
            this.format(path, name);
            renameSync(path, newPath);
        }

        return results;
    }

    private static format(path: string, name: string): void {
        if (this.tryFormatSkeJson(path, name)) {
            console.log(`format ske: ${path} to with name: ${name}`);
        } else if (this.tryFormatTexJson(path, name)) {
            console.log(`format tex: ${path} to with name: ${name}`);
        }
    }

    private static tryFormatSkeJson(path: string, name: string): boolean {
        let regExp = new RegExp('_ske.json');
        let index = path.search(regExp);
        if (index == -1) return;
        let buffer = readFileSync(path, 'utf-8');
        let content = JSON.parse(buffer);
        content.name = name;
        let armature = content.armature;
        for (let i = 0; i < armature.length; i++) {
            armature[i].name = name;
        }
        let data = JSON.stringify(content);
        writeFileSync(path, data);
    }

    private static tryFormatTexJson(path: string, name: string): boolean {
        let regExp = new RegExp('_tex.json|_tex_[0-9].json');
        let index = path.search(regExp);
        if (index == -1) return;
        let buffer = readFileSync(path, 'utf-8');
        let content = JSON.parse(buffer);
        content.name = name;
        content['imagePath'] = `${name}${path.slice(index, path.length - 4)}png`;
        let data = JSON.stringify(content);
        writeFileSync(path, data);
    }
}