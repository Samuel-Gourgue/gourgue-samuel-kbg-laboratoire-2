import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        const { op, x, y, n } = this.HttpContext.path.params;

        let operation = op && op.trim() !== '' ? op : '+';

        let missingParams = this.checkMissingParams(operation, x, y, n);
        if (missingParams.length > 0) {
            return this.HttpContext.response.badRequest(`Missing required parameters: ${missingParams.join(', ')}`);
        }

        try {
            const result = await this.handleMathOperations(operation, x, y, n);
            const response = { op: operation, value: result };
            if (n !== undefined) response.n = n;

            this.HttpContext.response.JSON(response);
        } catch (error) {
            const errorResponse = {
                op: operation,
                error: error.message,
            };
            if (x !== undefined) errorResponse.x = x;
            if (y !== undefined) errorResponse.y = y;
            if (n !== undefined) errorResponse.n = n;

            this.HttpContext.response.JSON(errorResponse);
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
        if (['+', '-', '*', '/'].includes(op)) {
            if (x !== undefined) {
                x = parseFloat(x);
                if (isNaN(x)) throw new Error("'x' parameter is not a number");
            }
            if (y !== undefined) {
                y = parseFloat(y);
                if (isNaN(y)) throw new Error("'y' parameter is not a number");
            }
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
                return this.isPrime(n);
            default:
                throw new Error(`Unsupported operation: ${op}`);
        }
    }

    isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
}
