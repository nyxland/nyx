#ifndef TOKEN_H
#define TOKEN_H

#include <string>
#include <unordered_map>

enum class TokenType {
    BANG_EQUAL,
    IDENTIFIER,
    NUMBER,
    PLUS,
    MINUS,
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
};

class Token {
public:
    Token(TokenType type, const std::string& lexeme, const std::string& literal = "")
        : type(type), lexeme(lexeme), literal(literal) {}

    TokenType type;
    std::string lexeme;
    std::string literal;
};

#endif // TOKEN_H
