import { io } from "./stdlib/io.js";
import { http } from "./stdlib/http.js";
import IModule from "./interfaces/Module.js";
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
} from "./ast.js";
import { ParserError } from "./errors.js";

class Interpreter {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
  private modules: { [key: string]: IModule } = {
    io,
    http,
  };
  private functions: { [key: string]: FunctionDeclaration } = {};

  async interpret(ast: ASTNode): Promise<any> {
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
      const source = (ast.source as Literal).value;
      const moduleName = source.split("/")[1]; // Get 'io' or 'http' from 'nyx-stdlib/io'
      const module = this.modules[moduleName];
      if (!module) {
        throw new Error(`Module not found: ${moduleName}`);
      }
      this[localName] = module;
    }
  }

  handleFunctionDeclaration(ast: FunctionDeclaration) {
    const functionName = (ast.id as Identifier).name;
    this.functions[functionName] = ast;
  }

  async handleCallExpression(ast: CallExpression): Promise<any> {
    const callee = ast.callee as any;
    
    if (callee.type === "Identifier" && this.functions[callee.name]) {
      return await this.executeFunction(this.functions[callee.name], ast.arguments);
    }
    
    // Handle module function calls (e.g., http.get, io.println)
    if (callee.type === "MemberExpression") {
      const obj = await this.evaluate(callee.object);
      const prop = callee.property.name;
      if (obj && typeof obj[prop] === "function") {
        const args = await Promise.all(ast.arguments.map(arg => this.evaluate(arg)));
        return await obj[prop].apply(obj, args);
      }
    }

    // Handle direct function calls
    if (callee.type === "Identifier" && this[callee.name]) {
      const args = await Promise.all(ast.arguments.map(arg => this.evaluate(arg)));
      return await this[callee.name].apply(this, args);
    }

    throw new Error(`Unknown function: ${JSON.stringify(callee)}`);
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

  async handleAwaitExpression(ast: AwaitExpression): Promise<any> {
    return await this.evaluate(ast.argument);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async evaluate(node: ASTNode): Promise<any> {
    if (!node) return undefined;
    
    switch (node.type) {
      case "Literal":
        return node.value;
      case "Identifier":
        return this[node.name];
      case "MemberExpression":
        const obj = await this.evaluate(node.object);
        return obj[node.property.name];
      case "BinaryExpression":
        return this.evaluateBinaryExpression(node);
      case "CallExpression":
        return await this.handleCallExpression(node as CallExpression);
      case "AwaitExpression":
        return await this.handleAwaitExpression(node as AwaitExpression);
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

  async executeFunction(func: FunctionDeclaration, args: ASTNode[]): Promise<any> {
    const params = func.params.map((param) => (param as Identifier).name);
    const localScope: { [key: string]: any } = {};
    for (let i = 0; i < params.length; i++) {
      localScope[params[i]] = await this.evaluate(args[i]);
    }
    const previousScope = { ...this };
    Object.assign(this, localScope);
    const result: any = await this.interpret(func.body);
    Object.assign(this, previousScope);
    return result;
  }
}

export async function interpret(code: string) {
  try {
    const now = new Date();
    const ast: Program = parse(code);
    const interpreter = new Interpreter();
    await interpreter.interpret(ast).then(() => {
      console.log(`Execution time: ${new Date().getTime() - now.getTime()}ms`);
    });
  } catch (error) {
    if (error instanceof ParserError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
  }
}