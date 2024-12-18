#ifndef CODE_GENERATOR_H
#define CODE_GENERATOR_H

#include <string>
#include "ast.h"

class CodeGenerator {
public:
    std::string generate(ASTNode* node);

private:
    void generateNode(ASTNode* node, std::stringstream& ss);
    void generateVariableDeclaration(VariableDeclarationNode* node, std::stringstream& ss);
    void generateFunctionDeclaration(FunctionDeclarationNode* node, std::stringstream& ss);
    void generateIfStatement(IfStatementNode* node, std::stringstream& ss);
    void generateForStatement(ForStatementNode* node, std::stringstream& ss);
    void generateWhileStatement(WhileStatementNode* node, std::stringstream& ss);
    void generateReturnStatement(ReturnStatementNode* node, std::stringstream& ss);
    void generateClassDeclaration(ClassDeclarationNode* node, std::stringstream& ss);
    void generatePrintStatement(PrintStatementNode* node, std::stringstream& ss);
    void generateExpressionStatement(ExpressionStatementNode* node, std::stringstream& ss);
    void generateBinaryExpression(BinaryExpressionNode* node, std::stringstream& ss);
    void generateUnaryExpression(UnaryExpressionNode* node, std::stringstream& ss);
    void generateLiteral(LiteralNode* node, std::stringstream& ss);
    void generateVariable(VariableNode* node, std::stringstream& ss);
    void generateGrouping(GroupingNode* node, std::stringstream& ss);
    void generateAssignment(AssignmentNode* node, std::stringstream& ss);
};

#endif // CODE_GENERATOR_H
