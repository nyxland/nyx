import { ASTNode, VariableDeclarationNode, FunctionDeclarationNode, IfStatementNode, ForStatementNode, WhileStatementNode, ReturnStatementNode, ClassDeclarationNode, PrintStatementNode, ExpressionStatementNode, BinaryExpressionNode, UnaryExpressionNode, LiteralNode, VariableNode, GroupingNode, AssignmentNode } from './ast';

export class Interpreter {
    interpret(node: ASTNode): void {
        this.executeNode(node);
    }

    private executeNode(node: ASTNode): void {
        if (node instanceof VariableDeclarationNode) {
            this.executeVariableDeclaration(node);
        } else if (node instanceof FunctionDeclarationNode) {
            this.executeFunctionDeclaration(node);
        } else if (node instanceof IfStatementNode) {
            this.executeIfStatement(node);
        } else if (node instanceof ForStatementNode) {
            this.executeForStatement(node);
        } else if (node instanceof WhileStatementNode) {
            this.executeWhileStatement(node);
        } else if (node instanceof ReturnStatementNode) {
            this.executeReturnStatement(node);
        } else if (node instanceof ClassDeclarationNode) {
            this.executeClassDeclaration(node);
        } else if (node instanceof PrintStatementNode) {
            this.executePrintStatement(node);
        } else if (node instanceof ExpressionStatementNode) {
            this.executeExpressionStatement(node);
        } else if (node instanceof BinaryExpressionNode) {
            this.executeBinaryExpression(node);
        } else if (node instanceof UnaryExpressionNode) {
            this.executeUnaryExpression(node);
        } else if (node instanceof LiteralNode) {
            this.executeLiteral(node, true);
        } else if (node instanceof VariableNode) {
            this.executeVariable(node);
        } else if (node instanceof GroupingNode) {
            this.executeGrouping(node);
        } else if (node instanceof AssignmentNode) {
            this.executeAssignment(node);
        }
    }

    private executeVariableDeclaration(node: VariableDeclarationNode): void {
        if (!node.initializer) {
            throw new Error('Missing initializer in variable declaration');
        }
        this.executeNode(node.initializer);
    }

    private executeFunctionDeclaration(node: FunctionDeclarationNode): void {
        for (const stmt of node.body) {
            this.executeNode(stmt);
        }
    }

    private executeIfStatement(node: IfStatementNode): void {
        this.executeNode(node.condition);
        this.executeNode(node.thenBranch);
        if (node.elseBranch) {
            this.executeNode(node.elseBranch);
        }
    }

    private executeForStatement(node: ForStatementNode): void {
        if (node.initializer) {
            this.executeNode(node.initializer);
        }
        if (node.condition) {
            this.executeNode(node.condition);
        }
        if (node.increment) {
            this.executeNode(node.increment);
        }
        this.executeNode(node.body);
    }

    private executeWhileStatement(node: WhileStatementNode): void {
        this.executeNode(node.condition);
        this.executeNode(node.body);
    }

    private executeReturnStatement(node: ReturnStatementNode): void {
        if (node.value) {
            this.executeNode(node.value);
        }
    }

    private executeClassDeclaration(node: ClassDeclarationNode): void {
        for (const method of node.methods) {
            this.executeNode(method);
        }
    }

    private executePrintStatement(node: PrintStatementNode): void {
        if (node.value instanceof LiteralNode) {
            this.executeLiteral(node.value, true);
        } else {
            this.executeNode(node.value);
            console.log();
        }
    }

    private executeExpressionStatement(node: ExpressionStatementNode): void {
        this.executeNode(node.expression);
    }

    private executeBinaryExpression(node: BinaryExpressionNode): void {
        this.executeNode(node.left);
        this.executeNode(node.right);
    }

    private executeUnaryExpression(node: UnaryExpressionNode): void {
        this.executeNode(node.right);
    }

    private executeLiteral(node: LiteralNode, isString: boolean): void {
        if (isString) {
            console.log(node.value);
        } else {
            console.log(node.value);
        }
    }

    private executeVariable(node: VariableNode): void {
        console.log(node.name.lexeme);
    }

    private executeGrouping(node: GroupingNode): void {
        this.executeNode(node.expression);
    }

    private executeAssignment(node: AssignmentNode): void {
        this.executeNode(node.value);
    }
}
