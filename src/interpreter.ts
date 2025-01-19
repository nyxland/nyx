import axios from "axios";
import { parse, Program, ASTNode, ImportDeclaration, CallExpression, Identifier, Literal } from "./ast";

interface Module {
  [key: string]: any;
}

const io: Module = {
  println: (message: string) => {
    console.log(message);
  },
};

const http: Module = {
  get: async (url: string) => {
    const response = await axios.get(url);
    return response;
  },
};

class Interpreter {
  private modules: { [key: string]: Module } = {
    io,
    http,
  };

  async interpret(ast: Program) {
    switch (ast.type) {
      case "Program":
        for (const statement of ast.body) {
          await this.interpret(statement);
        }
        break;
      case "ImportDeclaration":
        this.handleImportDeclaration(ast);
        break;
      case "FunctionDeclaration":
        // Handle function declaration
        break;
      case "CallExpression":
        await this.handleCallExpression(ast);
        break;
      case "VariableDeclaration":
        // Handle variable declaration
        break;
      case "IfStatement":
        await this.handleIfStatement(ast);
        break;
      case "ForStatement":
        await this.handleForStatement(ast);
        break;
      case "WhileStatement":
        await this.handleWhileStatement(ast);
        break;
      default:
        throw new Error(`Unknown AST node type: ${ast.type}`);
    }
  }

  handleImportDeclaration(ast: ImportDeclaration) {
    const moduleName = (ast.source as Literal).value;
    const module = this.modules[moduleName];
    if (!module) {
      throw new Error(`Module not found: ${moduleName}`);
    }
    for (const specifier of ast.specifiers) {
      const localName = (specifier.local as Identifier).name;
      const importedName = (specifier.imported as Identifier).name;
      this[localName] = module[importedName];
    }
  }

  async handleCallExpression(ast: CallExpression) {
    const callee = (ast.callee as Identifier).name;
    if (callee === "main") {
      await this.main();
    } else if (this[callee]) {
      await this[callee](...ast.arguments.map((arg) => this.evaluate(arg)));
    } else {
      throw new Error(`Unknown function: ${callee}`);
    }
  }

  async handleIfStatement(ast: ASTNode) {
    const test = await this.evaluate(ast.test);
    if (test) {
      await this.interpret(ast.consequent);
    } else if (ast.alternate) {
      await this.interpret(ast.alternate);
    }
  }

  async handleForStatement(ast: ASTNode) {
    for (
      await this.evaluate(ast.init);
      await this.evaluate(ast.test);
      await this.evaluate(ast.update)
    ) {
      await this.interpret(ast.body);
    }
  }

  async handleWhileStatement(ast: ASTNode) {
    while (await this.evaluate(ast.test)) {
      await this.interpret(ast.body);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async evaluate(node: ASTNode): Promise<any> {
    switch (node.type) {
      case "Literal":
        return node.value;
      case "Identifier":
        return this[node.name];
      case "BinaryExpression":
        return this.evaluateBinaryExpression(node);
      case "CallExpression":
        return this.handleCallExpression(node);
      default:
        throw new Error(`Unknown AST node type: ${node.type}`);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async evaluateBinaryExpression(node: ASTNode): Promise<any> {
    const left = await this.evaluate(node.left);
    const right = await this.evaluate(node.right);
    switch (node.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  async main() {
    const response = await http.get(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    io.println(response.data);
  }
}

export function interpret(code: string) {
  const ast: Program = parse(code);
  const interpreter = new Interpreter();
  interpreter.interpret(ast);
}
