import { Token, Tokenizer, TokenType } from "./tokenizer.js";
import { ParserError } from "./errors.js";

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
  async: boolean;
}

export interface CallExpression extends ASTNode {
  type: "CallExpression";
  callee: Identifier;
  arguments: ASTNode[];
  await: boolean;
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

export interface ImportDeclaration extends ASTNode {
  type: "ImportDeclaration";
  specifiers: ImportSpecifier[];
  source: Literal | null;
}

export interface ImportSpecifier extends ASTNode {
  type: "ImportSpecifier";
  local: Identifier;
  imported: Identifier;
}

export interface AwaitExpression extends ASTNode {
  type: "AwaitExpression";
  argument: ASTNode;
}

export interface MemberExpression extends ASTNode {
  type: "MemberExpression";
  object: ASTNode;
  property: Identifier;
}

export function parse(code: string, debug: boolean = false): Program {
  const tokens = tokenize(code, debug);
  const parser = new Parser(tokens, debug);
  return parser.parseProgram();
}

class Parser {
  private tokens: Token[];
  private current: number;
  private debug: boolean;

  constructor(tokens: Token[], debug: boolean = false) {
    this.tokens = tokens;
    this.current = 0;
    this.debug = debug;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  public parseProgram(): Program {
    const body: ASTNode[] = [];
    while (!this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    return { type: "Program", body };
  }

  private parseStatement(): ASTNode {
    if (this.match(TokenType.Keyword)) {
      switch (this.previous().value) {
        case "def":
          return this.parseFunctionDeclaration();
        case "async":
          return this.parseAsyncFunctionDeclaration();
        case "let":
        case "const":
          return this.parseVariableDeclaration();
        case "if":
          return this.parseIfStatement();
        case "for":
          return this.parseForStatement();
        case "while":
          return this.parseWhileStatement();
        case "return":
          return this.parseReturnStatement();
        case "import":
          return this.parseImportDeclaration();
        case "await":
          return this.parseAwaitExpression();
      }
    }
    return this.parseExpressionStatement();
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    const id = this.parseIdentifier();
    this.consume(TokenType.Operator, "Expected '(' after function name.");
    const params: Identifier[] = [];
    if (!this.check(TokenType.Operator) || this.peek().value !== ")") {
      do {
        params.push(this.parseIdentifier());
      } while (this.match(TokenType.Operator) && this.previous().value === ",");
    }
    this.consume(TokenType.Operator, "Expected ')' after parameters.");
    const body = this.parseBlockStatement();
    return { type: "FunctionDeclaration", id, params, body, async: false };
  }

  private parseAsyncFunctionDeclaration(): FunctionDeclaration {
    this.consume(TokenType.Keyword, "Expected 'def' after 'async'.");
    const id = this.parseIdentifier();
    this.consume(TokenType.Operator, "Expected '(' after function name.");
    const params: Identifier[] = [];
    if (!this.check(TokenType.Operator) || this.peek().value !== ")") {
      do {
        params.push(this.parseIdentifier());
      } while (this.match(TokenType.Operator) && this.previous().value === ",");
    }
    this.consume(TokenType.Operator, "Expected ')' after parameters.");
    const body = this.parseBlockStatement();
    return { type: "FunctionDeclaration", id, params, body, async: true };
  }

  private parseVariableDeclaration(): VariableDeclaration {
    const kind = this.previous().value as "let" | "const";
    const declarations: VariableDeclarator[] = [];
    do {
      const id = this.parseIdentifier();
      let init: ASTNode | null = null;
      if (this.match(TokenType.Operator) && this.previous().value === "=") {
        init = this.parseExpression();
      }
      declarations.push({ type: "VariableDeclarator", id, init });
    } while (this.match(TokenType.Operator) && this.previous().value === ",");
    this.consume(TokenType.Punctuation, "Expected ';' after variable declaration.");
    return { type: "VariableDeclaration", declarations, kind };
  }

  private parseIfStatement(): IfStatement {
    this.consume(TokenType.Operator, "Expected '(' after 'if'.");
    const test = this.parseExpression();
    this.consume(TokenType.Operator, "Expected ')' after condition.");
    const consequent = this.parseBlockStatement();
    let alternate: BlockStatement | null = null;
    if (this.match(TokenType.Keyword) && this.previous().value === "else") {
      alternate = this.parseBlockStatement();
    }
    return { type: "IfStatement", test, consequent, alternate };
  }

  private parseForStatement(): ForStatement {
    this.consume(TokenType.Operator, "Expected '(' after 'for'.");
    const init = this.parseExpression();
    this.consume(TokenType.Punctuation, "Expected ';' after initialization.");
    const test = this.parseExpression();
    this.consume(TokenType.Punctuation, "Expected ';' after condition.");
    const update = this.parseExpression();
    this.consume(TokenType.Operator, "Expected ')' after update.");
    const body = this.parseBlockStatement();
    return { type: "ForStatement", init, test, update, body };
  }

  private parseWhileStatement(): WhileStatement {
    this.consume(TokenType.Operator, "Expected '(' after 'while'.");
    const test = this.parseExpression();
    this.consume(TokenType.Operator, "Expected ')' after condition.");
    const body = this.parseBlockStatement();
    return { type: "WhileStatement", test, body };
  }

  private parseReturnStatement(): ASTNode {
    const argument = this.parseExpression();
    this.consume(TokenType.Punctuation, "Expected ';' after return value.");
    return { type: "ReturnStatement", argument };
  }

  private parseImportDeclaration(): ImportDeclaration {
    const specifiers: ImportSpecifier[] = [];
    do {
      const local = this.parseIdentifier();
      let imported = local;
      if (this.match(TokenType.Keyword) && this.previous().value === "as") {
        imported = this.parseIdentifier();
      }
      specifiers.push({ type: "ImportSpecifier", local, imported });
    } while (this.match(TokenType.Operator) && this.previous().value === ",");
    let source: Literal | null = null;
    if (this.match(TokenType.Keyword) && this.previous().value === "from") {
      source = this.parseLiteral();
    }
    this.consume(TokenType.Punctuation, "Expected ';' after import declaration.");
    return { type: "ImportDeclaration", specifiers, source };
  }

  private parseBlockStatement(): BlockStatement {
    this.consume(TokenType.Operator, "Expected '{' before block.");
    const body: ASTNode[] = [];
    while (!this.check(TokenType.Operator) || this.peek().value !== "}") {
      body.push(this.parseStatement());
    }
    this.consume(TokenType.Operator, "Expected '}' after block.");
    return { type: "BlockStatement", body };
  }

  private parseExpressionStatement(): ASTNode {
    const expression = this.parseExpression();
    this.consume(TokenType.Punctuation, "Expected ';' after expression.");
    return { type: "ExpressionStatement", expression };
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    const left = this.parseBinaryExpression();
    if (this.match(TokenType.Operator) && this.previous().value === "=") {
      const right = this.parseAssignment();
      return { type: "AssignmentExpression", left, right };
    }
    return left;
  }

  private parseBinaryExpression(): ASTNode {
    let left = this.parsePrimary();
    while (this.match(TokenType.Operator)) {
      const operator = this.previous().value;
      const right = this.parsePrimary();
      left = { type: "BinaryExpression", operator, left, right };
    }
    return left;
  }

  private parsePrimary(): ASTNode {
    if (this.match(TokenType.Identifier)) {
      const identifier = this.parseIdentifier();
      
      // Handle member expressions (e.g., http.get, io.println)
      if (this.match(TokenType.Operator) && this.previous().value === ".") {
        return {
          type: "MemberExpression",
          object: identifier,
          property: this.parseIdentifier()
        };
      }
      
      return identifier;
    }
    if (this.match(TokenType.Literal)) {
      return this.parseLiteral();
    }
    if (this.match(TokenType.Operator) && this.previous().value === "(") {
      const expression = this.parseExpression();
      this.consume(TokenType.Operator, "Expected ')' after expression.");
      return expression;
    }
    if (this.match(TokenType.Keyword) && this.previous().value === "await") {
      return this.parseAwaitExpression();
    }
    const token = this.peek();
    throw new ParserError(token.line, token.column, token.value, "Unexpected token.");
  }

  private parseIdentifier(): Identifier {
    return { type: "Identifier", name: this.previous().value };
  }

  private parseLiteral(): Literal {
    return { type: "Literal", value: this.previous().value };
  }

  private parseAwaitExpression(): AwaitExpression {
    const argument = this.parseExpression();
    return { type: "AwaitExpression", argument };
  }
}

function tokenize(code: string, debug: boolean = false): Token[] {
  const tokenizer = new Tokenizer(code);
  if (debug) {
    console.log(tokenizer.tokenize());
  }
  return tokenizer.tokenize();
}
