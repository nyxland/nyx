#include "interpreter.h"
#include <iostream>
#include "ast.h"

void Interpreter::interpret(ASTNode* node) {
    executeNode(node);
}

void Interpreter::executeNode(ASTNode* node) {
    if (auto* varDecl = dynamic_cast<VariableDeclarationNode*>(node)) {
        executeVariableDeclaration(varDecl);
    } else if (auto* funcDecl = dynamic_cast<FunctionDeclarationNode*>(node)) {
        executeFunctionDeclaration(funcDecl);
    } else if (auto* ifStmt = dynamic_cast<IfStatementNode*>(node)) {
        executeIfStatement(ifStmt);
    } else if (auto* forStmt = dynamic_cast<ForStatementNode*>(node)) {
        executeForStatement(forStmt);
    } else if (auto* whileStmt = dynamic_cast<WhileStatementNode*>(node)) {
        executeWhileStatement(whileStmt);
    } else if (auto* returnStmt = dynamic_cast<ReturnStatementNode*>(node)) {
        executeReturnStatement(returnStmt);
    } else if (auto* classDecl = dynamic_cast<ClassDeclarationNode*>(node)) {
        executeClassDeclaration(classDecl);
    } else if (auto* printStmt = dynamic_cast<PrintStatementNode*>(node)) {
        executePrintStatement(printStmt);
    } else if (auto* exprStmt = dynamic_cast<ExpressionStatementNode*>(node)) {
        executeExpressionStatement(exprStmt);
    } else if (auto* binaryExpr = dynamic_cast<BinaryExpressionNode*>(node)) {
        executeBinaryExpression(binaryExpr);
    } else if (auto* unaryExpr = dynamic_cast<UnaryExpressionNode*>(node)) {
        executeUnaryExpression(unaryExpr);
    } else if (auto* literal = dynamic_cast<LiteralNode*>(node)) {
        executeLiteral(literal, true);
    } else if (auto* variable = dynamic_cast<VariableNode*>(node)) {
        executeVariable(variable);
    } else if (auto* grouping = dynamic_cast<GroupingNode*>(node)) {
        executeGrouping(grouping);
    } else if (auto* assignment = dynamic_cast<AssignmentNode*>(node)) {
        executeAssignment(assignment);
    }
}

void Interpreter::executeVariableDeclaration(VariableDeclarationNode* node) {
    if (!node->initializer) {
        std::cerr << "Error: Missing initializer in variable declaration" << std::endl;
        return;
    }
    executeNode(node->initializer);
}

void Interpreter::executeFunctionDeclaration(FunctionDeclarationNode* node) {
    for (auto* stmt : node->body) {
        executeNode(stmt);
    }
}

void Interpreter::executeIfStatement(IfStatementNode* node) {
    executeNode(node->condition);
    executeNode(node->thenBranch);
    if (node->elseBranch) {
        executeNode(node->elseBranch);
    }
}

void Interpreter::executeForStatement(ForStatementNode* node) {
    if (node->initializer) {
        executeNode(node->initializer);
    }
    if (node->condition) {
        executeNode(node->condition);
    }
    if (node->increment) {
        executeNode(node->increment);
    }
    executeNode(node->body);
}

void Interpreter::executeWhileStatement(WhileStatementNode* node) {
    executeNode(node->condition);
    executeNode(node->body);
}

void Interpreter::executeReturnStatement(ReturnStatementNode* node) {
    if (node->value) {
        executeNode(node->value);
    }
}

void Interpreter::executeClassDeclaration(ClassDeclarationNode* node) {
    for (auto* method : node->methods) {
        executeNode(method);
    }
}

void Interpreter::executePrintStatement(PrintStatementNode* node) {
    if (auto* literal = dynamic_cast<LiteralNode*>(node->value)) {
        executeLiteral(literal, true);
    } else {
        executeNode(node->value);
        std::cout << std::endl;
    }
}

void Interpreter::executeExpressionStatement(ExpressionStatementNode* node) {
    executeNode(node->expression);
}

void Interpreter::executeBinaryExpression(BinaryExpressionNode* node) {
    executeNode(node->left);
    executeNode(node->right);
}

void Interpreter::executeUnaryExpression(UnaryExpressionNode* node) {
    executeNode(node->right);
}

void Interpreter::executeLiteral(LiteralNode* node, bool isString) {
    if (isString) {
        std::cout << node->value;
    } else {
        std::cout << node->value;
    }
}

void Interpreter::executeVariable(VariableNode* node) {
    std::cout << node->name.lexeme << std::endl;
}

void Interpreter::executeGrouping(GroupingNode* node) {
    executeNode(node->expression);
}

void Interpreter::executeAssignment(AssignmentNode* node) {
    executeNode(node->value);
}
