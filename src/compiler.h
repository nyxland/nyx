#ifndef COMPILER_H
#define COMPILER_H

#include <string>
#include "lexer.h"
#include "parser.h"
#include "code_generator.h"

class Compiler {
public:
    void compile(const std::string& inputFilePath, const std::string& outputFilePath);
};

#endif // COMPILER_H
