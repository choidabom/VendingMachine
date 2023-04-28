import fs from "fs";
import path from "path";
import yaml from "js-yaml";

class Config {
    private configFile: string;

    constructor(configFile: string) {
        this.configFile = configFile;
    }

    load(): any {
        const file = fs.readFileSync(path.join(__dirname, this.configFile), 'utf8');
        const config = yaml.load(file);
        return config;
    }
}

const config = new Config('config.yaml');
let MYSQL = config.load();
export default MYSQL;
