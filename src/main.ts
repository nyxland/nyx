import { Lexer, Token, TokenType } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import { ProgramNode } from './ast';

function main(sourceCode: string): void {
    const lexer = new Lexer(sourceCode);
    const tokens: Token[] = lexer.tokenize();

    console.log("Tokens:\n" + JSON.stringify(tokens, null, 2));

    const parser = new Parser(tokens);
    const ast = parser.parse();

    if (ast instanceof ProgramNode) {
        console.log("\nAST:\n" + JSON.stringify(ast, null, 2));
    } else {
        console.error("Parsing failed. AST is not a ProgramNode.");
        return;
    }

    const interpreter = new Interpreter();
    interpreter.interpret(ast);
}

export { main };
