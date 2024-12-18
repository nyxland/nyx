#ifndef PARSER_H
#define PARSER_H

#include <vector>
#include "token.h"
#include "ast.h"

class Parser {
public:
    Parser(const std::vector<Token>& tokens);
    ASTNode* parse();

private:
    std::vector<Token> tokens;
    size_t position;

    ASTNode* parseStatement();
    ASTNode* parseVariableDeclaration();
    ASTNode* parseFunctionDeclaration();
    ASTNode* parseIfStatement();
    ASTNode* parseForStatement();
    ASTNode* parseWhileStatement();
    ASTNode* parseReturnStatement();
    ASTNode* parseClassDeclaration();
    ASTNode* parsePrintStatement();
    ASTNode* parseExpressionStatement();
    ASTNode* parseExpression();
    ASTNode* parseAssignment();
    ASTNode* parseEquality();
    ASTNode* parseComparison();
    ASTNode* parseTerm();
    ASTNode* parseFactor();
    ASTNode* parseUnary();
    ASTNode* parsePrimary();

    bool match(TokenType type);
    bool check(TokenType type);
    Token advance();
    bool isAtEnd();
    Token peek();
    Token previous();
    Token consume(TokenType type, const std::string& message);
    std::vector<ASTNode*> parseBlock();
};

#endif // PARSER_H
