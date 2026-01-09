"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEnvUsages = findEnvUsages;
const fs_1 = __importDefault(require("fs"));
const parser = __importStar(require("@babel/parser"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
function findEnvUsages(filePath) {
    if (!fs_1.default.existsSync(filePath))
        return [];
    const code = fs_1.default.readFileSync(filePath, 'utf-8');
    const usages = [];
    // Only parse JS/TS files
    if (!/\.(js|ts|jsx|tsx)$/.test(filePath)) {
        return [];
    }
    try {
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });
        (0, traverse_1.default)(ast, {
            MemberExpression(path) {
                // 1. Check for process.env.VAR
                if (t.isMemberExpression(path.node.object) &&
                    t.isIdentifier(path.node.object.object) &&
                    path.node.object.object.name === 'process' &&
                    t.isIdentifier(path.node.object.property) &&
                    path.node.object.property.name === 'env') {
                    if (t.isIdentifier(path.node.property)) {
                        usages.push({
                            name: path.node.property.name,
                            line: path.node.loc?.start.line || 0,
                            file: filePath
                        });
                    }
                    else if (t.isStringLiteral(path.node.property)) {
                        usages.push({
                            name: path.node.property.value,
                            line: path.node.loc?.start.line || 0,
                            file: filePath
                        });
                    }
                }
                // 2. Check for import.meta.env.VAR (Vite)
                // AST structure: MemberExpression
                //   object: MemberExpression
                //     object: MetaProperty (import.meta)
                //     property: Identifier (env)
                //   property: Identifier (VAR)
                if (t.isMemberExpression(path.node.object) &&
                    t.isMetaProperty(path.node.object.object) &&
                    path.node.object.object.meta.name === 'import' &&
                    path.node.object.object.property.name === 'meta' &&
                    t.isIdentifier(path.node.object.property) &&
                    path.node.object.property.name === 'env') {
                    if (t.isIdentifier(path.node.property)) {
                        usages.push({
                            name: path.node.property.name,
                            line: path.node.loc?.start.line || 0,
                            file: filePath
                        });
                    }
                }
            }
        });
    }
    catch (e) {
        // console.warn(`Failed to parse ${filePath}:`, e);
    }
    return usages;
}
