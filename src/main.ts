import { Lexer, Token, TokenType } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';

function main(sourceCode: string): void {
    const lexer = new Lexer(sourceCode);
    const tokens: Token[] = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const interpreter = new Interpreter();
    interpreter.interpret(ast);
}

export { main };
