#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <filesystem>
#include <vector>
#include <chrono>
#include <unordered_map>
#include "lexer.h"
#include "parser.h"
#include "code_generator.h"
#include "compiler.h"

namespace fs = std::filesystem;

std::unordered_map<std::string, std::time_t> getFileModificationTimes(const std::vector<std::string>& files) {
    std::unordered_map<std::string, std::time_t> fileModificationTimes;
    for (const auto& file : files) {
        fileModificationTimes[file] = fs::last_write_time(file).time_since_epoch().count();
    }
    return fileModificationTimes;
}

bool hasFileChanged(const std::unordered_map<std::string, std::time_t>& oldTimes, const std::unordered_map<std::string, std::time_t>& newTimes) {
    for (const auto& [file, oldTime] : oldTimes) {
        if (newTimes.at(file) != oldTime) {
            return true;
        }
    }
    return false;
}

std::vector<std::string> getAllNyxFiles(const std::string& directory) {
    std::vector<std::string> nyxFiles;
    for (const auto& entry : fs::directory_iterator(directory)) {
        if (entry.path().extension() == ".nyx") {
            nyxFiles.push_back(entry.path().string());
        }
    }
    return nyxFiles;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <nyx_source_directory>" << std::endl;
        return 1;
    }

    std::string sourceDirectory = argv[1];
    std::string buildDirectory = "build";
    std::string outputFilePath = buildDirectory + "/project.exe";

    if (!fs::exists(buildDirectory)) {
        fs::create_directory(buildDirectory);
    }

    std::vector<std::string> nyxFiles = getAllNyxFiles(sourceDirectory);

    std::unordered_map<std::string, std::time_t> oldModificationTimes = getFileModificationTimes(nyxFiles);

    Compiler compiler;
    for (const auto& nyxFile : nyxFiles) {
        compiler.compile(nyxFile, outputFilePath);
    }

    std::unordered_map<std::string, std::time_t> newModificationTimes = getFileModificationTimes(nyxFiles);

    if (hasFileChanged(oldModificationTimes, newModificationTimes)) {
        for (const auto& nyxFile : nyxFiles) {
            compiler.compile(nyxFile, outputFilePath);
        }
    }

    std::system(outputFilePath.c_str());

    return 0;
}
