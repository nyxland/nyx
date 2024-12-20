#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include "lexer.h"
#include "parser.h"
#include "interpreter.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <nyx_source_file>" << std::endl;
        return 1;
    }

    std::string sourceFilePath = argv[1];
    std::ifstream inputFile(sourceFilePath);
    if (!inputFile.is_open()) {
        std::cerr << "Error: Could not open input file " << sourceFilePath << std::endl;
        return 1;
    }

    std::stringstream buffer;
    buffer << inputFile.rdbuf();
    std::string sourceCode = buffer.str();
    inputFile.close();

    Lexer lexer(sourceCode);
    std::vector<Token> tokens = lexer.tokenize();

    Parser parser(tokens);
    ASTNode* ast = parser.parse();

    Interpreter interpreter;
    interpreter.interpret(ast);

    return 0;
}
