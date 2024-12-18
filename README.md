<div align="center">
  <picture>
      <img src="https://raw.githubusercontent.com/nyxland/assets/main/assets/logo.png" width="128">
  </picture>

  # Nyx Programming Language

  Nyx is a new programming language that combines the syntax of Python and JavaScript. It is designed to be fast, easy to read, easy to write, resource efficient, and cross-platform compatible. Nyx compiles to native executables for various operating systems.
</div>

> [!WARNING]
> **This project is under construction** and is not yet ready for production use. Please check back later for updates. We do not recommend using this project in its current state This project is still in the early stages of development and is not yet ready for use. We are developing it publicly to allow for community feedback and contributions. Please check back later for updates.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Building Nyx](#building-nyx)
  - [Compiling Nyx Code](#compiling-nyx-code)
  - [Example of Using the New CLI Interface](#example-of-using-the-new-cli-interface)
- [Nyx Syntax](#nyx-syntax)
  - [Variables](#variables)
  - [Functions](#functions)
  - [Conditionals](#conditionals)
  - [Loops](#loops)
  - [Classes](#classes)
- [Contributing](#contributing)
- [License](#license)

## Features

- Combines the best features of Python and JavaScript
- Easy-to-read syntax
- Compiles to native executables for various operating systems

## Getting Started

### Prerequisites

- C++ compiler (e.g., GCC, Clang, MSVC)
- CMake (version 3.10 or higher)

### Building Nyx

1. Clone the repository:

   ```sh
   git clone https://github.com/nyxland/nyx.git
   cd nyx
   ```

2. Create a build directory and navigate to it:

   ```sh
   mkdir build
   cd build
   ```

3. Run CMake to configure the project:

   ```sh
   cmake ..
   ```

4. Build the project:

   ```sh
   cmake --build .
   ```

### Compiling Nyx Code

To compile Nyx code, use the `nyx` executable generated in the build process. The `nyx` executable takes a Nyx source file as input and generates a native executable.

```sh
./nyx path/to/your_code.nyx
```

This will generate a native executable in the `build` directory.

### Example of Using the New CLI Interface

To compile a Nyx source file and generate a native executable, use the following command:

```sh
./nyx example/index.nyx
```

This will generate a native executable in the `build` directory with the name `index.nyx.exe`.

## Nyx Syntax

Nyx syntax combines elements of Python and JavaScript. Here are some examples:

### Variables

```nyx
let x = 10
const y = 20
```

### Functions

```nyx
def add(a, b):
    return a + b
```

### Conditionals

```nyx
if x > y:
    print("x is greater than y")
else:
    print("x is not greater than y")
```

### Loops

```nyx
for i in range(10):
    print(i)
```

### Classes

```nyx
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old")
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
