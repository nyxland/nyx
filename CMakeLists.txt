cmake_minimum_required(VERSION 3.10)

project(NyxLang)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_executable(nyx
    src/main.cpp
    src/lexer.cpp
    src/parser.cpp
    src/interpreter.cpp
)

target_include_directories(nyx PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_include_directories(nyx PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)
