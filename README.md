<div align="center">
  <picture>
      <img src="https://nyxland.github.io/assets/assets/logo.png" width="128">
  </picture>

  # Nyx Programming Language

  Nyx is a new programming language that combines the syntax of Python and JavaScript. It is designed to be fast, easy to read, easy to write, resource efficient, and cross-platform compatible. Nyx compiles to native executables for various operating systems.
</div>

> [!WARNING]
> **This project is under construction** and is not yet ready for production use. Please check back later for updates. We do not recommend using this project in its current state. This project is still in the early stages of development and is not yet ready for use. We are developing it publicly to allow for community feedback and contributions. Please check back later for updates.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Building Nyx](#building-nyx)
  - [Running Nyx Code](#running-nyx-code)
  - [Example of Using the New CLI Interface](#example-of-using-the-new-cli-interface)
- [Nyx Syntax](#nyx-syntax)
  - [Variables](#variables)
  - [Functions](#functions)
  - [Conditionals](#conditionals)
  - [Loops](#loops)
  - [Classes](#classes)
- [Contributing](#contributing)
- [License](#license)
- [Automated Build Process](#automated-build-process)

## Features

- Combines the best features of Python and JavaScript
- Easy-to-read syntax
- Interprets `.nyx` files directly without compilation

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- pnpm (version 8 or higher)

### Building Nyx

1. Clone the repository:

   ```sh
   git clone https://github.com/nyxland/nyx.git
   cd nyx
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Build the project:

   ```sh
   pnpm build
   ```

### Running Nyx Code

To run Nyx code, use the `nyx` script. The `nyx` script takes a Nyx source file as input and interprets it directly.

```sh
node dist/main.js path/to/your_code.nyx
```

This will interpret and execute the Nyx code in the specified file.

### Example of Using the New CLI Interface

To run a Nyx source file, use the following command:

```sh
node dist/main.js example/index.nyx
```

This will interpret and execute the Nyx code in the `example/index.nyx` file.

## Nyx Syntax

Nyx syntax combines elements of Python and JavaScript. Here are some examples:

### Variables

```nyx
let x = 10
const y = 20
```

### Functions

```nyx
def add = (a, b) => {
    return a + b;
}
```

### Conditionals

```nyx
if x > y:
    print("x is greater than y");
else:
    print("x is not greater than y");
```

### Loops

```nyx
for i in range(10) {
    print(i);
}
```

### Classes

```nyx
class Person:
    def __init__ = (self, name, age) => {
        self.name = name
        self.age = age
    }

    def greet = (self) => {
        print(f"Hello, my name is {self.name} and I am {self.age} years old")
    }
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Automated Build Process

This project uses GitHub Actions to automate the build process. The workflow is triggered on push and pull request events to the `main` branch. The workflow sets up a Node.js environment, installs dependencies, and builds the project using the `tsconfig.json` file.

You can view the build status in the GitHub repository under the "Actions" tab. The build status for each commit and pull request will be displayed there.
