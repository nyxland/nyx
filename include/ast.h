#ifndef AST_H
#define AST_H

#include <string>
#include <vector>
#include "token.h"

class ASTNode {
public:
    virtual ~ASTNode() = default;
};

class ExpressionNode : public ASTNode {};

class StatementNode : public ASTNode {};

class VariableDeclarationNode : public StatementNode {
public:
    VariableDeclarationNode(TokenType type, const Token& name, ASTNode* initializer)
        : type(type), name(name), initializer(initializer) {}

    TokenType type;
    Token name;
    ASTNode* initializer;
};

class FunctionDeclarationNode : public StatementNode {
public:
    FunctionDeclarationNode(const Token& name, const std::vector<Token>& parameters, const std::vector<ASTNode*>& body)
        : name(name), parameters(parameters), body(body) {}

    Token name;
    std::vector<Token> parameters;
    std::vector<ASTNode*> body;
};

class IfStatementNode : public StatementNode {
public:
    IfStatementNode(ASTNode* condition, ASTNode* thenBranch, ASTNode* elseBranch)
        : condition(condition), thenBranch(thenBranch), elseBranch(elseBranch) {}

    ASTNode* condition;
    ASTNode* thenBranch;
    ASTNode* elseBranch;
};

class ForStatementNode : public StatementNode {
public:
    ForStatementNode(ASTNode* initializer, ASTNode* condition, ASTNode* increment, ASTNode* body)
        : initializer(initializer), condition(condition), increment(increment), body(body) {}

    ASTNode* initializer;
    ASTNode* condition;
    ASTNode* increment;
    ASTNode* body;
};

class WhileStatementNode : public StatementNode {
public:
    WhileStatementNode(ASTNode* condition, ASTNode* body)
        : condition(condition), body(body) {}

    ASTNode* condition;
    ASTNode* body;
};

class ReturnStatementNode : public StatementNode {
public:
    ReturnStatementNode(const Token& keyword, ASTNode* value)
        : keyword(keyword), value(value) {}

    Token keyword;
    ASTNode* value;
};

class ClassDeclarationNode : public StatementNode {
public:
    ClassDeclarationNode(const Token& name, const std::vector<ASTNode*>& methods)
        : name(name), methods(methods) {}

    Token name;
    std::vector<ASTNode*> methods;
};

class PrintStatementNode : public StatementNode {
public:
    PrintStatementNode(ASTNode* value)
        : value(value) {}

    ASTNode* value;
};

class ExpressionStatementNode : public StatementNode {
public:
    ExpressionStatementNode(ASTNode* expression)
        : expression(expression) {}

    ASTNode* expression;
};

class BinaryExpressionNode : public ExpressionNode {
public:
    BinaryExpressionNode(ASTNode* left, const Token& op, ASTNode* right)
        : left(left), op(op), right(right) {}

    ASTNode* left;
    Token op;
    ASTNode* right;
};

class UnaryExpressionNode : public ExpressionNode {
public:
    UnaryExpressionNode(const Token& op, ASTNode* right)
        : op(op), right(right) {}

    Token op;
    ASTNode* right;
};

class LiteralNode : public ExpressionNode {
public:
    LiteralNode(const std::string& value)
        : value(value) {}

    std::string value;
};

class VariableNode : public ExpressionNode {
public:
    VariableNode(const Token& name)
        : name(name) {}

    Token name;
};

class GroupingNode : public ExpressionNode {
public:
    GroupingNode(ASTNode* expression)
        : expression(expression) {}

    ASTNode* expression;
};

class AssignmentNode : public ExpressionNode {
public:
    AssignmentNode(const Token& name, ASTNode* value)
        : name(name), value(value) {}

    Token name;
    ASTNode* value;
};

#endif // AST_H
