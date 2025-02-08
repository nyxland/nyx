export class ParserError extends Error {
  line: number;
  column: number;
  unexpectedToken: string;

  constructor(line: number, column: number, unexpectedToken: string, message: string) {
    super(message);
    this.line = line;
    this.column = column;
    this.unexpectedToken = unexpectedToken;
    this.name = "ParserError";
  }

  toString(): string {
    return `${this.name}: ${this.message} at line ${this.line}, column ${this.column}. Unexpected token: ${this.unexpectedToken}`;
  }
}
