import axios from "axios";
import {
  parse,
  type Program,
  type ASTNode,
  type ImportDeclaration,
  type CallExpression,
  type Identifier,
  type Literal,
  type FunctionDeclaration,
  type VariableDeclaration,
  type IfStatement,
  type ForStatement,
  type WhileStatement,
  type AwaitExpression,
} from "./ast";
import { ParserError } from "./errors";

interface Module {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

const io: Module = {
  println: (message: any) => {
    console.log(message);
  },
};

const http: Module = {
  get: async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  },
};

class Interpreter {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
  private modules: { [key: string]: Module } = {
    io,
    http,
  };
  private functions: { [key: string]: FunctionDeclaration } = {};

  async interpret(ast: ASTNode) {
    switch (ast.type) {
      case "Program":
        for (const statement of ast.body) {
          await this.interpret(statement);
        }
        break;
      case "ImportDeclaration":
        this.handleImportDeclaration(ast as ImportDeclaration);
        break;
      case "FunctionDeclaration":
        this.handleFunctionDeclaration(ast as FunctionDeclaration);
        break;
      case "CallExpression":
        return await this.handleCallExpression(ast as CallExpression);
      case "VariableDeclaration":
        this.handleVariableDeclaration(ast as VariableDeclaration);
        break;
      case "IfStatement":
        await this.handleIfStatement(ast as IfStatement);
        break;
      case "ForStatement":
        await this.handleForStatement(ast as ForStatement);
        break;
      case "WhileStatement":
        await this.handleWhileStatement(ast as WhileStatement);
        break;
      case "AwaitExpression":
        return await this.handleAwaitExpression(ast as AwaitExpression);
      default:
        throw new Error(`Unknown AST node type: ${ast.type}`);
    }
  }

  handleImportDeclaration(ast: ImportDeclaration) {
    for (const specifier of ast.specifiers) {
      const localName = (specifier.local as Identifier).name;
      const importedName = (specifier.imported as Identifier).name;
      const moduleName = importedName.split("/")[0];
      const module = this.modules[moduleName];
      if (!module) {
        throw new Error(`Module not found: ${moduleName}`);
      }
      this[localName] = module[importedName.split("/")[1]];
    }
  }

  handleFunctionDeclaration(ast: FunctionDeclaration) {
    const functionName = (ast.id as Identifier).name;
    this.functions[functionName] = ast;
  }

  async handleCallExpression(ast: CallExpression) {
    const callee = (ast.callee as Identifier).name;
  
    if (this.functions[callee]) {
      return await this.executeFunction(this.functions[callee], ast.arguments);
    } else if (callee.includes(".") && this.modules[callee.split(".")[0]]) {
      const moduleName = callee.split(".")[0];
      const functionName = callee.split(".")[1];
      const module = this.modules[moduleName];
      if (module && module[functionName]) {
        const args = await Promise.all(ast.arguments.map((arg) => this.evaluate(arg)));
        return await module[functionName](...args);
      }
    } else if (this[callee]) {
      return await this[callee](...await Promise.all(ast.arguments.map((arg) => this.evaluate(arg))));
    } else {
      throw new Error(`Unknown function: ${callee}`);
    }
  }

  handleVariableDeclaration(ast: VariableDeclaration) {
    for (const declaration of ast.declarations) {
      const varName = (declaration.id as Identifier).name;
      this[varName] = declaration.init ? this.evaluate(declaration.init) : undefined;
    }
  }

  async handleIfStatement(ast: IfStatement) {
    const test = await this.evaluate(ast.test);
    if (test) {
      await this.interpret(ast.consequent);
    } else if (ast.alternate) {
      await this.interpret(ast.alternate);
    }
  }

  async handleForStatement(ast: ForStatement) {
    for (
      await this.evaluate(ast.init);
      await this.evaluate(ast.test);
      await this.evaluate(ast.update)
    ) {
      await this.interpret(ast.body);
    }
  }

  async handleWhileStatement(ast: WhileStatement) {
    while (await this.evaluate(ast.test)) {
      await this.interpret(ast.body);
    }
  }

  async handleAwaitExpression(ast: AwaitExpression) {
    return await this.evaluate(ast.argument);
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
        return this.handleCallExpression(node as CallExpression);
      case "AwaitExpression":
        return this.handleAwaitExpression(node as AwaitExpression);
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

  async executeFunction(func: FunctionDeclaration, args: ASTNode[]) {
    const params = func.params.map((param) => (param as Identifier).name);
    const localScope: { [key: string]: any } = {};
    for (let i = 0; i < params.length; i++) {
      localScope[params[i]] = await this.evaluate(args[i]);
    }
    const previousScope = { ...this };
    Object.assign(this, localScope);
    await this.interpret(func.body);
    Object.assign(this, previousScope);
  }
}

export async function interpret(code: string) {
  try {
    const ast: Program = parse(code);
    const interpreter = new Interpreter();
    await interpreter.interpret(ast);
  } catch (error) {
    if (error instanceof ParserError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
  }
}
