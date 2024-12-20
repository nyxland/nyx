import { Token, TokenType } from "./lexer";

export abstract class ASTNode {}

export abstract class ExpressionNode extends ASTNode {}

export abstract class StatementNode extends ASTNode {}

export class VariableDeclarationNode extends StatementNode {
    constructor(
        public type: TokenType,
        public name: Token,
        public initializer: ASTNode
    ) {
        super();
    }
}

export class FunctionDeclarationNode extends StatementNode {
    constructor(
        public name: Token,
        public parameters: Token[],
        public body: ASTNode[]
    ) {
        super();
    }
}

export class IfStatementNode extends StatementNode {
    constructor(
        public condition: ASTNode,
        public thenBranch: ASTNode,
        public elseBranch: ASTNode | null
    ) {
        super();
    }
}

export class ForStatementNode extends StatementNode {
    constructor(
        public initializer: ASTNode | null,
        public condition: ASTNode | null,
        public increment: ASTNode | null,
        public body: ASTNode
    ) {
        super();
    }
}

export class WhileStatementNode extends StatementNode {
    constructor(
        public condition: ASTNode,
        public body: ASTNode
    ) {
        super();
    }
}

export class ReturnStatementNode extends StatementNode {
    constructor(
        public keyword: Token,
        public value: ASTNode | null
    ) {
        super();
    }
}

export class ClassDeclarationNode extends StatementNode {
    constructor(
        public name: Token,
        public methods: ASTNode[]
    ) {
        super();
    }
}

export class PrintStatementNode extends StatementNode {
    constructor(
        public value: ASTNode
    ) {
        super();
    }
}

export class ExpressionStatementNode extends StatementNode {
    constructor(
        public expression: ASTNode
    ) {
        super();
    }
}

export class BinaryExpressionNode extends ExpressionNode {
    constructor(
        public left: ASTNode,
        public op: Token,
        public right: ASTNode
    ) {
        super();
    }
}

export class UnaryExpressionNode extends ExpressionNode {
    constructor(
        public op: Token,
        public right: ASTNode
    ) {
        super();
    }
}

export class LiteralNode extends ExpressionNode {
    constructor(
        public value: string
    ) {
        super();
    }
}

export class VariableNode extends ExpressionNode {
    constructor(
        public name: Token
    ) {
        super();
    }
}

export class GroupingNode extends ExpressionNode {
    constructor(
        public expression: ASTNode
    ) {
        super();
    }
}

export class AssignmentNode extends ExpressionNode {
    constructor(
        public name: Token,
        public value: ASTNode
    ) {
        super();
    }
}
