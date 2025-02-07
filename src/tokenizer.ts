export enum TokenType {
  Keyword = 0,
  Identifier = 1,
  Literal = 2,
  Operator = 3,
  Punctuation = 4,
  EOF = 5,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

const keywords = new Set([
  "async",
  "def",
  "let",
  "const",
  "if",
  "else",
  "for",
  "while",
  "return",
  "import",
  "from",
  "as",
]);

const operators = new Set([
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "+",
  "-",
  "*",
  "/",
  "&&",
  "||",
  "!",
  "=>",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ",",
  ".",
  ":",
  ";",
]);

export class Tokenizer {
  private source: string;
  private position: number;
  private line: number;
  private column: number;

  constructor(source: string) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  private isEOF(): boolean {
    return this.position >= this.source.length;
  }

  private peek(): string {
    return this.source[this.position];
  }

  private advance(): string {
    const char = this.source[this.position++];
    if (char === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private isWhitespace(char: string): boolean {
    return char === " " || char === "\t" || char === "\n" || char === "\r";
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  private isAlphanumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private createToken(type: TokenType, value: string): Token {
    return { type, value, line: this.line, column: this.column };
  }

  private error(message: string): never {
    throw new Error(
      `Tokenizer error at ${this.line}:${this.column} - ${message}`,
    );
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isEOF()) {
      const char = this.peek();

      if (this.isWhitespace(char)) {
        this.advance();
        continue;
      }

      if (this.isDigit(char)) {
        tokens.push(this.tokenizeNumber());
        continue;
      }

      if (this.isAlpha(char)) {
        tokens.push(this.tokenizeIdentifierOrKeyword());
        continue;
      }

      if (operators.has(char)) {
        tokens.push(this.tokenizeOperator());
        continue;
      }

      if (char === '"' || char === "'") {
        tokens.push(this.tokenizeString());
        continue;
      }

      this.error(`Unexpected character: ${char}`);
    }

    tokens.push(this.createToken(TokenType.EOF, ""));
    return tokens;
  }

  private tokenizeNumber(): Token {
    let value = "";
    while (!this.isEOF() && this.isDigit(this.peek())) {
      value += this.advance();
    }
    return this.createToken(TokenType.Literal, value);
  }

  private tokenizeIdentifierOrKeyword(): Token {
    let value = "";
    while (!this.isEOF() && this.isAlphanumeric(this.peek())) {
      value += this.advance();
    }
    if (keywords.has(value)) {
      return this.createToken(TokenType.Keyword, value);
    }
    return this.createToken(TokenType.Identifier, value);
  }

  private tokenizeOperator(): Token {
    let value = this.advance();
    if (value === "=" && this.peek() === ">") {
      value += this.advance();
    }
    return this.createToken(TokenType.Operator, value);
  }

  private tokenizeString(): Token {
    const quote = this.advance();
    let value = "";
    while (!this.isEOF() && this.peek() !== quote) {
      value += this.advance();
    }
    this.advance(); // Consume the closing quote
    return this.createToken(TokenType.Literal, value);
  }
}
