import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        const { op, x, y, n } = this.HttpContext.path.params;

        let operation = op && op.trim() !== '' ? op : '+';

        let missingParams = this.checkMissingParams(operation, x, y, n);
        if (missingParams.length > 0) {
            return this.sendResponse(400, {
                error: `Missing required parameters: ${missingParams.join(', ')}`
            });
        }

        try {
            const result = await this.handleMathOperations(operation, x, y, n);
            if (result !== undefined) {
                this.sendResponse(200, {
                    op: operation,
                    x: x !== undefined ? x : null,
                    y: y !== undefined ? y : null,
                    n: n !== undefined ? n : null,
                    value: result,
                });
            } else {
                this.sendResponse(422, {
                    error: 'Invalid operation or parameters.'
                });
            }
        } catch (error) {
            this.sendResponse(422, {
                error: error.message,
            });
        }
    }

    checkMissingParams(op, x, y, n) {
        let missing = [];
        switch (op) {
            case '+':
            case '-':
            case '*':
            case '/':
                if (x === undefined) missing.push('x');
                if (y === undefined) missing.push('y');
                break;
            case 'p':
                if (n === undefined) missing.push('n');
                break;
            default:
                missing.push('op');
        }
        return missing;
    }

    async handleMathOperations(op, x, y, n) {
        if (x !== undefined) {
            x = parseFloat(x);
            if (isNaN(x)) throw new Error("'x' parameter is not a number");
        }
        if (y !== undefined) {
            y = parseFloat(y);
            if (isNaN(y)) throw new Error("'y' parameter is not a number");
        }
        if (n !== undefined) {
            n = parseInt(n);
            if (isNaN(n)) throw new Error("'n' parameter is not an integer");
        }

        switch (op) {
            case '+':
            case ' ':
                return x + y;
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                if (y === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                return x / y;
            case 'p':
                return n % 2 === 0;
            default:
                throw new Error(`Unsupported operation: ${op}`);
        }
    }

    sendResponse(statusCode, jsonData) {
        this.HttpContext.response.writeHead(statusCode, { 'Content-Type': 'application/json' });
        this.HttpContext.response.end(JSON.stringify(jsonData));
    }
}
