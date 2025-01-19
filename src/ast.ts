export interface ASTNode {
  type: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

export interface Program extends ASTNode {
  type: "Program";
  body: ASTNode[];
}

export interface FunctionDeclaration extends ASTNode {
  type: "FunctionDeclaration";
  id: Identifier;
  params: Identifier[];
  body: BlockStatement;
}

export interface CallExpression extends ASTNode {
  type: "CallExpression";
  callee: Identifier;
  arguments: ASTNode[];
}

export interface VariableDeclaration extends ASTNode {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "let" | "const";
}

export interface VariableDeclarator extends ASTNode {
  type: "VariableDeclarator";
  id: Identifier;
  init: ASTNode | null;
}

export interface IfStatement extends ASTNode {
  type: "IfStatement";
  test: ASTNode;
  consequent: BlockStatement;
  alternate: BlockStatement | null;
}

export interface ForStatement extends ASTNode {
  type: "ForStatement";
  init: ASTNode;
  test: ASTNode;
  update: ASTNode;
  body: BlockStatement;
}

export interface WhileStatement extends ASTNode {
  type: "WhileStatement";
  test: ASTNode;
  body: BlockStatement;
}

export interface BlockStatement extends ASTNode {
  type: "BlockStatement";
  body: ASTNode[];
}

export interface Identifier extends ASTNode {
  type: "Identifier";
  name: string;
}

export interface Literal extends ASTNode {
  type: "Literal";
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value: any;
}

export interface BinaryExpression extends ASTNode {
  type: "BinaryExpression";
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

export function parse(code: string): Program {
  // Placeholder for the actual parser implementation
  return {
    type: "Program",
    body: [
      {
        type: "CallExpression",
        callee: { type: "Identifier", name: "main" },
        arguments: [],
      },
    ],
  };
}
