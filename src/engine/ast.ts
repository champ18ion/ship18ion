import fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface EnvUsage {
    name: string;
    line: number;
    file: string;
}

export function findEnvUsages(filePath: string): EnvUsage[] {
    if (!fs.existsSync(filePath)) return [];

    const code = fs.readFileSync(filePath, 'utf-8');
    const usages: EnvUsage[] = [];

    // Only parse JS/TS files
    if (!/\.(js|ts|jsx|tsx)$/.test(filePath)) {
        return [];
    }

    try {
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });

        traverse(ast, {
            MemberExpression(path) {
                // 1. Check for process.env.VAR
                if (
                    t.isMemberExpression(path.node.object) &&
                    t.isIdentifier(path.node.object.object) &&
                    path.node.object.object.name === 'process' &&
                    t.isIdentifier(path.node.object.property) &&
                    path.node.object.property.name === 'env'
                ) {
                    if (t.isIdentifier(path.node.property)) {
                        usages.push({
                            name: path.node.property.name,
                            line: path.node.loc?.start.line || 0,
                            file: filePath
                        });
                    } else if (t.isStringLiteral(path.node.property)) {
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

                if (
                    t.isMemberExpression(path.node.object) &&
                    t.isMetaProperty(path.node.object.object) &&
                    path.node.object.object.meta.name === 'import' &&
                    path.node.object.object.property.name === 'meta' &&
                    t.isIdentifier(path.node.object.property) &&
                    path.node.object.property.name === 'env'
                ) {
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

    } catch (e) {
        // console.warn(`Failed to parse ${filePath}:`, e);
    }
    return usages;
}
