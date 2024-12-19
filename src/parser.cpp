#include "parser.h"
#include "ast.h"
#include "token.h"
#include <iostream>

Parser::Parser(const std::vector<Token>& tokens) : tokens(tokens), position(0) {}

ASTNode* Parser::parse() {
    return parseStatement();
}

ASTNode* Parser::parseStatement() {
    if (match(TokenType::LET) || match(TokenType::CONST)) {
        return parseVariableDeclaration();
    } else if (match(TokenType::DEF)) {
        return parseFunctionDeclaration();
    } else if (match(TokenType::IF)) {
        return parseIfStatement();
    } else if (match(TokenType::FOR)) {
        return parseForStatement();
    } else if (match(TokenType::WHILE)) {
        return parseWhileStatement();
    } else if (match(TokenType::RETURN)) {
        return parseReturnStatement();
    } else if (match(TokenType::CLASS)) {
        return parseClassDeclaration();
    } else if (match(TokenType::PRINT)) {
        return parsePrintStatement();
    } else {
        return parseExpressionStatement();
    }
}

ASTNode* Parser::parseVariableDeclaration() {
    TokenType type = previous().type;
    Token name = consume(TokenType::IDENTIFIER, "Expected variable name");
    consume(TokenType::EQUAL, "Expected '=' after variable name");
    if (check(TokenType::SEMICOLON)) {
        std::cerr << "Error: Missing initializer in variable declaration" << std::endl;
        return nullptr;
    }
    ASTNode* initializer = parseExpression();
    return new VariableDeclarationNode(type, name, initializer);
}

ASTNode* Parser::parseFunctionDeclaration() {
    Token name = consume(TokenType::IDENTIFIER, "Expected function name");
    consume(TokenType::LEFT_PAREN, "Expected '(' after function name");
    std::vector<Token> parameters;
    if (!check(TokenType::RIGHT_PAREN)) {
        do {
            parameters.push_back(consume(TokenType::IDENTIFIER, "Expected parameter name"));
        } while (match(TokenType::COMMA));
    }
    consume(TokenType::RIGHT_PAREN, "Expected ')' after parameters");
    consume(TokenType::LEFT_BRACE, "Expected '{' before function body");
    std::vector<ASTNode*> body = parseBlock();
    return new FunctionDeclarationNode(name, parameters, body);
}

ASTNode* Parser::parseIfStatement() {
    consume(TokenType::LEFT_PAREN, "Expected '(' after 'if'");
    ASTNode* condition = parseExpression();
    consume(TokenType::RIGHT_PAREN, "Expected ')' after if condition");
    ASTNode* thenBranch = parseStatement();
    ASTNode* elseBranch = nullptr;
    if (match(TokenType::ELSE)) {
        elseBranch = parseStatement();
    }
    return new IfStatementNode(condition, thenBranch, elseBranch);
}

ASTNode* Parser::parseForStatement() {
    consume(TokenType::LEFT_PAREN, "Expected '(' after 'for'");
    ASTNode* initializer = nullptr;
    if (!match(TokenType::SEMICOLON)) {
        initializer = parseStatement();
    }
    ASTNode* condition = nullptr;
    if (!check(TokenType::SEMICOLON)) {
        condition = parseExpression();
    }
    consume(TokenType::SEMICOLON, "Expected ';' after loop condition");
    ASTNode* increment = nullptr;
    if (!check(TokenType::RIGHT_PAREN)) {
        increment = parseExpression();
    }
    consume(TokenType::RIGHT_PAREN, "Expected ')' after for clauses");
    ASTNode* body = parseStatement();
    return new ForStatementNode(initializer, condition, increment, body);
}

ASTNode* Parser::parseWhileStatement() {
    consume(TokenType::LEFT_PAREN, "Expected '(' after 'while'");
    ASTNode* condition = parseExpression();
    consume(TokenType::RIGHT_PAREN, "Expected ')' after while condition");
    ASTNode* body = parseStatement();
    return new WhileStatementNode(condition, body);
}

ASTNode* Parser::parseReturnStatement() {
    Token keyword = previous();
    ASTNode* value = nullptr;
    if (!check(TokenType::SEMICOLON)) {
        value = parseExpression();
    }
    consume(TokenType::SEMICOLON, "Expected ';' after return value");
    return new ReturnStatementNode(keyword, value);
}

ASTNode* Parser::parseClassDeclaration() {
    Token name = consume(TokenType::IDENTIFIER, "Expected class name");
    consume(TokenType::LEFT_BRACE, "Expected '{' before class body");
    std::vector<ASTNode*> methods;
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        methods.push_back(parseFunctionDeclaration());
    }
    consume(TokenType::RIGHT_BRACE, "Expected '}' after class body");
    return new ClassDeclarationNode(name, methods);
}

ASTNode* Parser::parsePrintStatement() {
    ASTNode* value = parseExpression();
    consume(TokenType::SEMICOLON, "Expected ';' after value");
    return new PrintStatementNode(value);
}

ASTNode* Parser::parseExpressionStatement() {
    ASTNode* expr = parseExpression();
    if (match(TokenType::SEMICOLON)) {
        consume(TokenType::SEMICOLON, "Expected ';' after expression");
    }
    return new ExpressionStatementNode(expr);
}

ASTNode* Parser::parseExpression() {
    return parseAssignment();
}

ASTNode* Parser::parseAssignment() {
    ASTNode* expr = parseEquality();
    if (match(TokenType::EQUAL)) {
        Token equals = previous();
        ASTNode* value = parseAssignment();
        if (dynamic_cast<VariableNode*>(expr)) {
            Token name = dynamic_cast<VariableNode*>(expr)->name;
            return new AssignmentNode(name, value);
        }
        std::cerr << "Invalid assignment target" << std::endl;
    }
    return expr;
}

ASTNode* Parser::parseEquality() {
    ASTNode* expr = parseComparison();
    while (match(TokenType::BANG_EQUAL) || match(TokenType::EQUAL_EQUAL)) {
        Token op = previous();
        ASTNode* right = parseComparison();
        expr = new BinaryExpressionNode(expr, op, right);
    }
    return expr;
}

ASTNode* Parser::parseComparison() {
    ASTNode* expr = parseTerm();
    while (match(TokenType::GREATER) || match(TokenType::GREATER_EQUAL) || match(TokenType::LESS) || match(TokenType::LESS_EQUAL)) {
        Token op = previous();
        ASTNode* right = parseTerm();
        expr = new BinaryExpressionNode(expr, op, right);
    }
    return expr;
}

ASTNode* Parser::parseTerm() {
    ASTNode* expr = parseFactor();
    while (match(TokenType::MINUS) || match(TokenType::PLUS)) {
        Token op = previous();
        ASTNode* right = parseFactor();
        expr = new BinaryExpressionNode(expr, op, right);
    }
    return expr;
}

ASTNode* Parser::parseFactor() {
    ASTNode* expr = parseUnary();
    while (match(TokenType::SLASH) || match(TokenType::STAR)) {
        Token op = previous();
        ASTNode* right = parseUnary();
        expr = new BinaryExpressionNode(expr, op, right);
    }
    return expr;
}

ASTNode* Parser::parseUnary() {
    if (match(TokenType::BANG) || match(TokenType::MINUS)) {
        Token op = previous();
        ASTNode* right = parseUnary();
        return new UnaryExpressionNode(op, right);
    }
    return parsePrimary();
}

ASTNode* Parser::parsePrimary() {
    if (match(TokenType::NUMBER)) {
        return new LiteralNode(previous().literal);
    }
    if (match(TokenType::STRING)) {
        return new LiteralNode(previous().literal);
    }
    if (match(TokenType::IDENTIFIER)) {
        return new VariableNode(previous());
    }
    if (match(TokenType::LEFT_PAREN)) {
        ASTNode* expr = parseExpression();
        consume(TokenType::RIGHT_PAREN, "Expected ')' after expression");
        return new GroupingNode(expr);
    }
    std::cerr << "Expected expression" << std::endl;
    return nullptr;
}

bool Parser::match(TokenType type) {
    if (check(type)) {
        advance();
        return true;
    }
    return false;
}

bool Parser::check(TokenType type) {
    if (isAtEnd()) return false;
    return peek().type == type;
}

Token Parser::advance() {
    if (!isAtEnd()) position++;
    return previous();
}

bool Parser::isAtEnd() {
    return peek().type == TokenType::END_OF_FILE;
}

Token Parser::peek() {
    return tokens[position];
}

Token Parser::previous() {
    return tokens[position - 1];
}

Token Parser::consume(TokenType type, const std::string& message) {
    if (check(type)) return advance();
    std::cerr << message << std::endl;
    return Token(TokenType::ERROR, "", 0);
}

std::vector<ASTNode*> Parser::parseBlock() {
    std::vector<ASTNode*> statements;
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        statements.push_back(parseStatement());
    }
    consume(TokenType::RIGHT_BRACE, "Expected '}' after block");
    return statements;
}
