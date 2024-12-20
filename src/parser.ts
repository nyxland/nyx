import { Token, TokenType } from './lexer';
import { ASTNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ForStatementNode, WhileStatementNode, ReturnStatementNode, ClassDeclarationNode, PrintStatementNode, ExpressionStatementNode, BinaryExpressionNode, UnaryExpressionNode, LiteralNode, VariableNode, GroupingNode, AssignmentNode, ProgramNode } from './ast';

class Parser {
    private position: number = 0;

    constructor(private tokens: Token[]) {}

    public parse(): ASTNode {
        const statements: ASTNode[] = [];
        while (!this.isAtEnd()) {
            statements.push(this.parseStatement());
        }
        return new ProgramNode(statements);
    }

    private parseStatement(): ASTNode {
        if (this.match(TokenType.LET) || this.match(TokenType.CONST)) {
            return this.parseVariableDeclaration();
        } else if (this.match(TokenType.DEF)) {
            return this.parseFunctionDeclaration();
        } else if (this.match(TokenType.IF)) {
            return this.parseIfStatement();
        } else if (this.match(TokenType.FOR)) {
            return this.parseForStatement();
        } else if (this.match(TokenType.WHILE)) {
            return this.parseWhileStatement();
        } else if (this.match(TokenType.RETURN)) {
            return this.parseReturnStatement();
        } else if (this.match(TokenType.CLASS)) {
            return this.parseClassDeclaration();
        } else if (this.match(TokenType.PRINT)) {
            return this.parsePrintStatement();
        } else {
            return this.parseExpressionStatement();
        }
    }

    private parseVariableDeclaration(): ASTNode {
        const type = this.previous().type;
        const name = this.consume(TokenType.IDENTIFIER, "Expected variable name");
        this.consume(TokenType.EQUAL, "Expected '=' after variable name");
        if (this.check(TokenType.SEMICOLON)) {
            throw new Error("Missing initializer in variable declaration");
        }
        const initializer = this.parseExpression();
        return new VariableDeclarationNode(type, name, initializer);
    }

    private parseFunctionDeclaration(): ASTNode {
        const name = this.consume(TokenType.IDENTIFIER, "Expected function name");
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name");
        const parameters: Token[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                parameters.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name"));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
        this.consume(TokenType.LEFT_BRACE, "Expected '{' before function body");
        const body = this.parseBlock();
        return new FunctionDeclarationNode(name, parameters, body);
    }

    private parseIfStatement(): ASTNode {
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'if'");
        const condition = this.parseExpression();
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after if condition");
        const thenBranch = this.parseStatement();
        let elseBranch: ASTNode | null = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.parseStatement();
        }
        return new IfStatementNode(condition, thenBranch, elseBranch);
    }

    private parseForStatement(): ASTNode {
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'for'");
        let initializer: ASTNode | null = null;
        if (!this.match(TokenType.SEMICOLON)) {
            initializer = this.parseStatement();
        }
        let condition: ASTNode | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.parseExpression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after loop condition");
        let increment: ASTNode | null = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.parseExpression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after for clauses");
        const body = this.parseStatement();
        return new ForStatementNode(initializer, condition, increment, body);
    }

    private parseWhileStatement(): ASTNode {
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'while'");
        const condition = this.parseExpression();
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after while condition");
        const body = this.parseStatement();
        return new WhileStatementNode(condition, body);
    }

    private parseReturnStatement(): ASTNode {
        const keyword = this.previous();
        let value: ASTNode | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.parseExpression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after return value");
        return new ReturnStatementNode(keyword, value);
    }

    private parseClassDeclaration(): ASTNode {
        const name = this.consume(TokenType.IDENTIFIER, "Expected class name");
        this.consume(TokenType.LEFT_BRACE, "Expected '{' before class body");
        const methods: ASTNode[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            methods.push(this.parseFunctionDeclaration());
        }
        this.consume(TokenType.RIGHT_BRACE, "Expected '}' after class body");
        return new ClassDeclarationNode(name, methods);
    }

    private parsePrintStatement(): ASTNode {
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'print'");
        const value = this.parseExpression();
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after value");
        this.consume(TokenType.SEMICOLON, "Expected ';' after value");
        return new PrintStatementNode(value);
    }

    private parseExpressionStatement(): ASTNode {
        const expr = this.parseExpression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after expression");
        return new ExpressionStatementNode(expr);
    }

    private parseExpression(): ASTNode {
        return this.parseAssignment();
    }

    private parseAssignment(): ASTNode {
        const expr = this.parseEquality();
        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous();
            const value = this.parseAssignment();
            if (expr instanceof VariableNode) {
                const name = expr.name;
                return new AssignmentNode(name, value);
            }
            throw new Error("Invalid assignment target");
        }
        return expr;
    }

    private parseEquality(): ASTNode {
        let expr = this.parseComparison();
        while (this.match(TokenType.BANG_EQUAL) || this.match(TokenType.EQUAL_EQUAL)) {
            const op = this.previous();
            const right = this.parseComparison();
            expr = new BinaryExpressionNode(expr, op, right);
        }
        return expr;
    }

    private parseComparison(): ASTNode {
        let expr = this.parseTerm();
        while (this.match(TokenType.GREATER) || this.match(TokenType.GREATER_EQUAL) || this.match(TokenType.LESS) || this.match(TokenType.LESS_EQUAL)) {
            const op = this.previous();
            const right = this.parseTerm();
            expr = new BinaryExpressionNode(expr, op, right);
        }
        return expr;
    }

    private parseTerm(): ASTNode {
        let expr = this.parseFactor();
        while (this.match(TokenType.MINUS) || this.match(TokenType.PLUS)) {
            const op = this.previous();
            const right = this.parseFactor();
            expr = new BinaryExpressionNode(expr, op, right);
        }
        return expr;
    }

    private parseFactor(): ASTNode {
        let expr = this.parseUnary();
        while (this.match(TokenType.SLASH) || this.match(TokenType.STAR)) {
            const op = this.previous();
            const right = this.parseUnary();
            expr = new BinaryExpressionNode(expr, op, right);
        }
        return expr;
    }

    private parseUnary(): ASTNode {
        if (this.match(TokenType.BANG) || this.match(TokenType.MINUS)) {
            const op = this.previous();
            const right = this.parseUnary();
            return new UnaryExpressionNode(op, right);
        }
        return this.parsePrimary();
    }

    private parsePrimary(): ASTNode {
        if (this.match(TokenType.NUMBER)) {
            return new LiteralNode(this.previous().literal);
        }
        if (this.match(TokenType.STRING)) {
            return new LiteralNode(this.previous().literal);
        }
        if (this.match(TokenType.IDENTIFIER)) {
            return new VariableNode(this.previous());
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.parseExpression();
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
            return new GroupingNode(expr);
        }
        throw new Error("Expected expression");
    }

    private match(type: TokenType): boolean {
        if (this.check(type)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.position++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.END_OF_FILE;
    }

    private peek(): Token {
        return this.tokens[this.position];
    }

    private previous(): Token {
        return this.tokens[this.position - 1];
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw new Error(message);
    }

    private parseBlock(): ASTNode[] {
        const statements: ASTNode[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.parseStatement());
        }
        this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");
        return statements;
    }
}

export { Parser };
