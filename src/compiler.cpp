#include "compiler.h"
#include <fstream>
#include <iostream>
#include <sstream>

void Compiler::compile(const std::string& inputFilePath, const std::string& outputFilePath) {
    std::ifstream inputFile(inputFilePath);
    if (!inputFile.is_open()) {
        std::cerr << "Error: Could not open input file " << inputFilePath << std::endl;
        return;
    }

    std::stringstream buffer;
    buffer << inputFile.rdbuf();
    std::string sourceCode = buffer.str();
    inputFile.close();

    Lexer lexer(sourceCode);
    std::vector<Token> tokens = lexer.tokenize();

    Parser parser(tokens);
    ASTNode* ast = parser.parse();

    CodeGenerator codeGenerator;
    std::string machineCode = codeGenerator.generate(ast);

    std::ofstream outputFile(outputFilePath, std::ios::binary);
    if (!outputFile.is_open()) {
        std::cerr << "Error: Could not open output file " << outputFilePath << std::endl;
        return;
    }

    outputFile.write(machineCode.c_str(), machineCode.size());
    outputFile.close();
}
