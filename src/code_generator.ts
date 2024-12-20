import { ASTNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ForStatementNode, WhileStatementNode, ReturnStatementNode, ClassDeclarationNode, PrintStatementNode, ExpressionStatementNode, BinaryExpressionNode, UnaryExpressionNode, LiteralNode, VariableNode, GroupingNode, AssignmentNode } from './ast';

export class CodeGenerator {
    generate(node: ASTNode): string {
        let code = '';
        this.generateNode(node, code);
        return code;
    }

    private generateNode(node: ASTNode, code: string): void {
        if (node instanceof VariableDeclarationNode) {
            this.generateVariableDeclaration(node, code);
        } else if (node instanceof FunctionDeclarationNode) {
            this.generateFunctionDeclaration(node, code);
        } else if (node instanceof IfStatementNode) {
            this.generateIfStatement(node, code);
        } else if (node instanceof ForStatementNode) {
            this.generateForStatement(node, code);
        } else if (node instanceof WhileStatementNode) {
            this.generateWhileStatement(node, code);
        } else if (node instanceof ReturnStatementNode) {
            this.generateReturnStatement(node, code);
        } else if (node instanceof ClassDeclarationNode) {
            this.generateClassDeclaration(node, code);
        } else if (node instanceof PrintStatementNode) {
            this.generatePrintStatement(node, code);
        } else if (node instanceof ExpressionStatementNode) {
            this.generateExpressionStatement(node, code);
        } else if (node instanceof BinaryExpressionNode) {
            this.generateBinaryExpression(node, code);
        } else if (node instanceof UnaryExpressionNode) {
            this.generateUnaryExpression(node, code);
        } else if (node instanceof LiteralNode) {
            this.generateLiteral(node, code);
        } else if (node instanceof VariableNode) {
            this.generateVariable(node, code);
        } else if (node instanceof GroupingNode) {
            this.generateGrouping(node, code);
        } else if (node instanceof AssignmentNode) {
            this.generateAssignment(node, code);
        }
    }

    private generateVariableDeclaration(node: VariableDeclarationNode, code: string): void {
        if (!node.initializer) {
            throw new Error('Missing initializer in variable declaration');
        }
        code += `${node.type === 'LET' ? 'let' : 'const'} ${node.name.lexeme} = `;
        this.generateNode(node.initializer, code);
        code += ';\n';
    }

    private generateFunctionDeclaration(node: FunctionDeclarationNode, code: string): void {
        code += `function ${node.name.lexeme}(`;
        for (let i = 0; i < node.parameters.length; i++) {
            code += node.parameters[i].lexeme;
            if (i < node.parameters.length - 1) {
                code += ', ';
            }
        }
        code += ') {\n';
        for (const stmt of node.body) {
            this.generateNode(stmt, code);
        }
        code += '}\n';
    }

    private generateIfStatement(node: IfStatementNode, code: string): void {
        code += 'if (';
        this.generateNode(node.condition, code);
        code += ') {\n';
        this.generateNode(node.thenBranch, code);
        code += '}\n';
        if (node.elseBranch) {
            code += 'else {\n';
            this.generateNode(node.elseBranch, code);
            code += '}\n';
        }
    }

    private generateForStatement(node: ForStatementNode, code: string): void {
        code += 'for (';
        if (node.initializer) {
            this.generateNode(node.initializer, code);
        }
        code += '; ';
        if (node.condition) {
            this.generateNode(node.condition, code);
        }
        code += '; ';
        if (node.increment) {
            this.generateNode(node.increment, code);
        }
        code += ') {\n';
        this.generateNode(node.body, code);
        code += '}\n';
    }

    private generateWhileStatement(node: WhileStatementNode, code: string): void {
        code += 'while (';
        this.generateNode(node.condition, code);
        code += ') {\n';
        this.generateNode(node.body, code);
        code += '}\n';
    }

    private generateReturnStatement(node: ReturnStatementNode, code: string): void {
        code += 'return ';
        if (node.value) {
            this.generateNode(node.value, code);
        }
        code += ';\n';
    }

    private generateClassDeclaration(node: ClassDeclarationNode, code: string): void {
        code += `class ${node.name.lexeme} {\n`;
        for (const method of node.methods) {
            this.generateNode(method, code);
        }
        code += '}\n';
    }

    private generatePrintStatement(node: PrintStatementNode, code: string): void {
        code += 'console.log(';
        this.generateNode(node.value, code);
        code += ');\n';
    }

    private generateExpressionStatement(node: ExpressionStatementNode, code: string): void {
        this.generateNode(node.expression, code);
        code += ';\n';
    }

    private generateBinaryExpression(node: BinaryExpressionNode, code: string): void {
        this.generateNode(node.left, code);
        code += ` ${node.op.lexeme} `;
        this.generateNode(node.right, code);
    }

    private generateUnaryExpression(node: UnaryExpressionNode, code: string): void {
        code += node.op.lexeme;
        this.generateNode(node.right, code);
    }

    private generateLiteral(node: LiteralNode, code: string): void {
        code += node.value;
    }

    private generateVariable(node: VariableNode, code: string): void {
        code += node.name.lexeme;
    }

    private generateGrouping(node: GroupingNode, code: string): void {
        code += '(';
        this.generateNode(node.expression, code);
        code += ')';
    }

    private generateAssignment(node: AssignmentNode, code: string): void {
        code += `${node.name.lexeme} = `;
        this.generateNode(node.value, code);
    }
}
