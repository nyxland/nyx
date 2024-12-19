#include "lexer.h"
#include <cctype>
#include <unordered_map>
#include "token.h"

Lexer::Lexer(const std::string& source) : source(source), position(0) {}

std::vector<Token> Lexer::tokenize() {
    std::vector<Token> tokens;
    while (position < source.length()) {
        char currentChar = source[position];
        if (std::isspace(currentChar)) {
            position++;
        } else if (std::isalpha(currentChar) || currentChar == '_') {
            tokens.push_back(tokenizeIdentifier());
        } else if (std::isdigit(currentChar)) {
            tokens.push_back(tokenizeNumber());
        } else if (currentChar == '"') {
            tokens.push_back(tokenizeString());
        } else {
            switch (currentChar) {
                case '+':
                    tokens.push_back(Token(TokenType::PLUS, "+"));
                    break;
                case '-':
                    tokens.push_back(Token(TokenType::MINUS, "-"));
                    break;
                case '*':
                    tokens.push_back(Token(TokenType::STAR, "*"));
                    break;
                case '/':
                    tokens.push_back(Token(TokenType::SLASH, "/"));
                    break;
                case '=':
                    tokens.push_back(Token(TokenType::EQUAL, "="));
                    break;
                case '(':
                    tokens.push_back(Token(TokenType::LEFT_PAREN, "("));
                    break;
                case ')':
                    tokens.push_back(Token(TokenType::RIGHT_PAREN, ")"));
                    break;
                case '{':
                    tokens.push_back(Token(TokenType::LEFT_BRACE, "{"));
                    break;
                case '}':
                    tokens.push_back(Token(TokenType::RIGHT_BRACE, "}"));
                    break;
                case ':':
                    tokens.push_back(Token(TokenType::COLON, ":"));
                    break;
                case ';':
                    tokens.push_back(Token(TokenType::SEMICOLON, ";"));
                    break;
                case ',':
                    tokens.push_back(Token(TokenType::COMMA, ","));
                    break;
                case '.':
                    tokens.push_back(Token(TokenType::DOT, "."));
                    break;
                default:
                    std::cerr << "Unexpected character: " << currentChar << std::endl;
                    break;
            }
            position++;
        }
    }
    tokens.push_back(Token(TokenType::END_OF_FILE, ""));
    return tokens;
}

Token Lexer::tokenizeIdentifier() {
    size_t start = position;
    while (position < source.length() && (std::isalnum(source[position]) || source[position] == '_')) {
        position++;
    }
    std::string identifier = source.substr(start, position - start);
    TokenType type = TokenType::IDENTIFIER;
    if (keywords.find(identifier) != keywords.end()) {
        type = keywords.at(identifier);
    }
    return Token(type, identifier);
}

Token Lexer::tokenizeNumber() {
    size_t start = position;
    while (position < source.length() && std::isdigit(source[position])) {
        position++;
    }
    std::string number = source.substr(start, position - start);
    return Token(TokenType::NUMBER, number);
}

Token Lexer::tokenizeString() {
    size_t start = position + 1;
    position++;
    while (position < source.length() && source[position] != '"') {
        position++;
    }
    std::string str = source.substr(start, position - start);
    position++;
    return Token(TokenType::STRING, str);
}

const std::unordered_map<std::string, TokenType> Lexer::keywords = {
    {"let", TokenType::LET},
    {"const", TokenType::CONST},
    {"def", TokenType::DEF},
    {"if", TokenType::IF},
    {"else", TokenType::ELSE},
    {"for", TokenType::FOR},
    {"while", TokenType::WHILE},
    {"return", TokenType::RETURN},
    {"class", TokenType::CLASS},
    {"print", TokenType::PRINT}
};
