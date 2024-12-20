#ifndef INTERPRETER_H
#define INTERPRETER_H

#include "ast.h"

class Interpreter {
public:
    void interpret(ASTNode* node);

private:
    void executeNode(ASTNode* node);
    void executeVariableDeclaration(VariableDeclarationNode* node);
    void executeFunctionDeclaration(FunctionDeclarationNode* node);
    void executeIfStatement(IfStatementNode* node);
    void executeForStatement(ForStatementNode* node);
    void executeWhileStatement(WhileStatementNode* node);
    void executeReturnStatement(ReturnStatementNode* node);
    void executeClassDeclaration(ClassDeclarationNode* node);
    void executePrintStatement(PrintStatementNode* node);
    void executeExpressionStatement(ExpressionStatementNode* node);
    void executeBinaryExpression(BinaryExpressionNode* node);
    void executeUnaryExpression(UnaryExpressionNode* node);
    void executeLiteral(LiteralNode* node);
    void executeVariable(VariableNode* node);
    void executeGrouping(GroupingNode* node);
    void executeAssignment(AssignmentNode* node);
};

#endif // INTERPRETER_H
