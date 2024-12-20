enum TokenType {
    BANG_EQUAL,
    IDENTIFIER,
    NUMBER,
    PLUS,
    MINUS,
    STRING,
    STAR,
    SLASH,
    SEMICOLON,
    EQUAL,
    EQUAL_EQUAL,
    LEFT_PAREN,
    RIGHT_PAREN,
    LEFT_BRACE,
    RIGHT_BRACE,
    COLON,
    COMMA,
    DOT,
    LET,
    CONST,
    DEF,
    IF,
    ELSE,
    FOR,
    WHILE,
    RETURN,
    CLASS,
    PRINT,
    END_OF_FILE,
    GREATER,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    BANG,
    ERROR,
}

class Token {
    constructor(public type: TokenType, public lexeme: string, public literal: string = "") {}
}

class Lexer {
    private position: number = 0;

    private static keywords: { [key: string]: TokenType } = {
        "let": TokenType.LET,
        "const": TokenType.CONST,
        "def": TokenType.DEF,
        "if": TokenType.IF,
        "else": TokenType.ELSE,
        "for": TokenType.FOR,
        "while": TokenType.WHILE,
        "return": TokenType.RETURN,
        "class": TokenType.CLASS,
        "print": TokenType.PRINT
    };

    constructor(private source: string) {}

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        while (this.position < this.source.length) {
            const currentChar = this.source[this.position];
            if (/\s/.test(currentChar)) {
                this.position++;
            } else if (/[a-zA-Z_]/.test(currentChar)) {
                tokens.push(this.tokenizeIdentifier());
            } else if (/\d/.test(currentChar)) {
                tokens.push(this.tokenizeNumber());
            } else if (currentChar === '"') {
                tokens.push(this.tokenizeString());
            } else {
                switch (currentChar) {
                    case '+':
                        tokens.push(new Token(TokenType.PLUS, "+"));
                        break;
                    case '-':
                        tokens.push(new Token(TokenType.MINUS, "-"));
                        break;
                    case '*':
                        tokens.push(new Token(TokenType.STAR, "*"));
                        break;
                    case '/':
                        tokens.push(new Token(TokenType.SLASH, "/"));
                        break;
                    case '=':
                        tokens.push(new Token(TokenType.EQUAL, "="));
                        break;
                    case '(':
                        tokens.push(new Token(TokenType.LEFT_PAREN, "("));
                        break;
                    case ')':
                        tokens.push(new Token(TokenType.RIGHT_PAREN, ")"));
                        break;
                    case '{':
                        tokens.push(new Token(TokenType.LEFT_BRACE, "{"));
                        break;
                    case '}':
                        tokens.push(new Token(TokenType.RIGHT_BRACE, "}"));
                        break;
                    case ':':
                        tokens.push(new Token(TokenType.COLON, ":"));
                        break;
                    case ';':
                        tokens.push(new Token(TokenType.SEMICOLON, ";"));
                        break;
                    case ',':
                        tokens.push(new Token(TokenType.COMMA, ","));
                        break;
                    case '.':
                        tokens.push(new Token(TokenType.DOT, "."));
                        break;
                    default:
                        console.error(`Unexpected character: ${currentChar}`);
                        break;
                }
                this.position++;
            }
        }
        tokens.push(new Token(TokenType.END_OF_FILE, ""));
        return tokens;
    }

    private tokenizeIdentifier(): Token {
        const start = this.position;
        while (this.position < this.source.length && /[a-zA-Z0-9_]/.test(this.source[this.position])) {
            this.position++;
        }
        const identifier = this.source.substring(start, this.position);
        const type = Lexer.keywords[identifier] || TokenType.IDENTIFIER;
        return new Token(type, identifier);
    }

    private tokenizeNumber(): Token {
        const start = this.position;
        while (this.position < this.source.length && /\d/.test(this.source[this.position])) {
            this.position++;
        }
        const number = this.source.substring(start, this.position);
        return new Token(TokenType.NUMBER, number);
    }

    private tokenizeString(): Token {
        const start = this.position + 1;
        this.position++;
        while (this.position < this.source.length && this.source[this.position] !== '"') {
            this.position++;
        }
        const str = this.source.substring(start, this.position);
        this.position++;
        return new Token(TokenType.STRING, str);
    }
}

export { TokenType, Token, Lexer };
