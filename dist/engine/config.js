"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function loadConfig(cwd = process.cwd()) {
    const configPath = path_1.default.join(cwd, 'ship18ion.config.json');
    if (fs_1.default.existsSync(configPath)) {
        const content = fs_1.default.readFileSync(configPath, 'utf-8');
        try {
            return JSON.parse(content);
        }
        catch (e) {
            console.error('Failed to parse config file:', e);
            return {};
        }
    }
    return {};
}
