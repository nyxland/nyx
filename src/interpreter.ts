import axios from "axios";

interface ASTNode {
  type: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

class Interpreter {
  async interpret(ast: ASTNode) {
    switch (ast.type) {
      case "Program":
        for (const statement of ast.body) {
          await this.interpret(statement);
        }
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

  async handleCallExpression(ast: ASTNode) {
    if (ast.callee.name === "main") {
      await this.main();
    } else {
      throw new Error(`Unknown function: ${ast.callee.name}`);
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
        // Handle identifier
        break;
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
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    console.log(response.data.title);
  }
}

export function interpret(code: string) {
  const ast: ASTNode = parse(code);
  const interpreter = new Interpreter();
  interpreter.interpret(ast);
}

function parse(code: string): ASTNode {
  // Placeholder for the actual parser implementation
  return {
    type: "Program",
    body: [
      {
        type: "CallExpression",
        callee: { name: "main" },
        arguments: [],
      },
    ],
  };
}
