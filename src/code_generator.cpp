#include "code_generator.h"
#include <sstream>
#include <iostream>
#include "ast.h"

std::string CodeGenerator::generate(ASTNode* node) {
    std::stringstream ss;
    generateNode(node, ss);
    return ss.str();
}

void CodeGenerator::generateNode(ASTNode* node, std::stringstream& ss) {
    if (auto* varDecl = dynamic_cast<VariableDeclarationNode*>(node)) {
        generateVariableDeclaration(varDecl, ss);
    } else if (auto* funcDecl = dynamic_cast<FunctionDeclarationNode*>(node)) {
        generateFunctionDeclaration(funcDecl, ss);
    } else if (auto* ifStmt = dynamic_cast<IfStatementNode*>(node)) {
        generateIfStatement(ifStmt, ss);
    } else if (auto* forStmt = dynamic_cast<ForStatementNode*>(node)) {
        generateForStatement(forStmt, ss);
    } else if (auto* whileStmt = dynamic_cast<WhileStatementNode*>(node)) {
        generateWhileStatement(whileStmt, ss);
    } else if (auto* returnStmt = dynamic_cast<ReturnStatementNode*>(node)) {
        generateReturnStatement(returnStmt, ss);
    } else if (auto* classDecl = dynamic_cast<ClassDeclarationNode*>(node)) {
        generateClassDeclaration(classDecl, ss);
    } else if (auto* printStmt = dynamic_cast<PrintStatementNode*>(node)) {
        generatePrintStatement(printStmt, ss);
    } else if (auto* exprStmt = dynamic_cast<ExpressionStatementNode*>(node)) {
        generateExpressionStatement(exprStmt, ss);
    } else if (auto* binaryExpr = dynamic_cast<BinaryExpressionNode*>(node)) {
        generateBinaryExpression(binaryExpr, ss);
    } else if (auto* unaryExpr = dynamic_cast<UnaryExpressionNode*>(node)) {
        generateUnaryExpression(unaryExpr, ss);
    } else if (auto* literal = dynamic_cast<LiteralNode*>(node)) {
        generateLiteral(literal, ss);
    } else if (auto* variable = dynamic_cast<VariableNode*>(node)) {
        generateVariable(variable, ss);
    } else if (auto* grouping = dynamic_cast<GroupingNode*>(node)) {
        generateGrouping(grouping, ss);
    } else if (auto* assignment = dynamic_cast<AssignmentNode*>(node)) {
        generateAssignment(assignment, ss);
    }
}

void CodeGenerator::generateVariableDeclaration(VariableDeclarationNode* node, std::stringstream& ss) {
    if (!node->initializer) {
        std::cerr << "Error: Missing initializer in variable declaration" << std::endl;
        return;
    }
    ss << (node->type == TokenType::LET ? "auto " : "const auto ") << node->name.lexeme << " = ";
    generateNode(node->initializer, ss);
    ss << ";\n";
}

void CodeGenerator::generateFunctionDeclaration(FunctionDeclarationNode* node, std::stringstream& ss) {
    ss << "auto " << node->name.lexeme << "(";
    for (size_t i = 0; i < node->parameters.size(); ++i) {
        ss << "auto " << node->parameters[i].lexeme;
        if (i < node->parameters.size() - 1) {
            ss << ", ";
        }
    }
    ss << ") {\n";
    for (auto* stmt : node->body) {
        generateNode(stmt, ss);
    }
    ss << "}\n";
}

void CodeGenerator::generateIfStatement(IfStatementNode* node, std::stringstream& ss) {
    ss << "if (";
    generateNode(node->condition, ss);
    ss << ") {\n";
    generateNode(node->thenBranch, ss);
    ss << "}\n";
    if (node->elseBranch) {
        ss << "else {\n";
        generateNode(node->elseBranch, ss);
        ss << "}\n";
    }
}

void CodeGenerator::generateForStatement(ForStatementNode* node, std::stringstream& ss) {
    ss << "for (";
    if (node->initializer) {
        generateNode(node->initializer, ss);
    }
    ss << "; ";
    if (node->condition) {
        generateNode(node->condition, ss);
    }
    ss << "; ";
    if (node->increment) {
        generateNode(node->increment, ss);
    }
    ss << ") {\n";
    generateNode(node->body, ss);
    ss << "}\n";
}

void CodeGenerator::generateWhileStatement(WhileStatementNode* node, std::stringstream& ss) {
    ss << "while (";
    generateNode(node->condition, ss);
    ss << ") {\n";
    generateNode(node->body, ss);
    ss << "}\n";
}

void CodeGenerator::generateReturnStatement(ReturnStatementNode* node, std::stringstream& ss) {
    ss << "return ";
    if (node->value) {
        generateNode(node->value, ss);
    }
    ss << ";\n";
}

void CodeGenerator::generateClassDeclaration(ClassDeclarationNode* node, std::stringstream& ss) {
    ss << "class " << node->name.lexeme << " {\npublic:\n";
    for (auto* method : node->methods) {
        generateNode(method, ss);
    }
    ss << "};\n";
}

void CodeGenerator::generatePrintStatement(PrintStatementNode* node, std::stringstream& ss) {
    ss << "std::cout << ";
    generateNode(node->value, ss);
    ss << " << std::endl;\n";
}

void CodeGenerator::generateExpressionStatement(ExpressionStatementNode* node, std::stringstream& ss) {
    generateNode(node->expression, ss);
    ss << ";\n";
}

void CodeGenerator::generateBinaryExpression(BinaryExpressionNode* node, std::stringstream& ss) {
    generateNode(node->left, ss);
    ss << " " << node->op.lexeme << " ";
    generateNode(node->right, ss);
}

void CodeGenerator::generateUnaryExpression(UnaryExpressionNode* node, std::stringstream& ss) {
    ss << node->op.lexeme;
    generateNode(node->right, ss);
}

void CodeGenerator::generateLiteral(LiteralNode* node, std::stringstream& ss) {
    ss << node->value;
}

void CodeGenerator::generateVariable(VariableNode* node, std::stringstream& ss) {
    ss << node->name.lexeme;
}

void CodeGenerator::generateGrouping(GroupingNode* node, std::stringstream& ss) {
    ss << "(";
    generateNode(node->expression, ss);
    ss << ")";
}

void CodeGenerator::generateAssignment(AssignmentNode* node, std::stringstream& ss) {
    ss << node->name.lexeme << " = ";
    generateNode(node->value, ss);
}
