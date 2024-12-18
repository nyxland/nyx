#ifndef LEXER_H
#define LEXER_H

#include <string>
#include <vector>
#include <iostream>
#include "token.h"

class Lexer {
public:
    Lexer(const std::string& source);
    std::vector<Token> tokenize();

private:
    std::string source;
    size_t position;

    Token tokenizeIdentifier();
    Token tokenizeNumber();

    static const std::unordered_map<std::string, TokenType> keywords;
};

#endif // LEXER_H
