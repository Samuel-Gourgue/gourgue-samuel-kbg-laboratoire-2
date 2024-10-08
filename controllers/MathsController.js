import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        const { op, X, Y, n } = this.HttpContext.path.params;
        
        const x = X !== undefined ? X : undefined;
        const y = Y !== undefined ? Y : undefined;

        let operation = op && op.trim() !== '' ? op : '+';

        let missingParams = this.checkMissingParams(operation, x, y, n);
        if (missingParams.length > 0) {
            const errorResponse = { op: operation, X: x, Y: y, error: `Missing required parameters: ${missingParams.join(', ')}` };
            return this.HttpContext.response.JSON(errorResponse);
        }

        try {
            const result = await this.handleMathOperations(operation, x, y, n);

            const response = { op: operation, value: result };
            if (x !== undefined) response.X = x;
            if (y !== undefined) response.Y = y;
            if (n !== undefined) response.n = n;

            this.HttpContext.response.JSON(response);
        } catch (error) {
            const errorResponse = {
                op: operation,
                X: x,
                Y: y,
                error: error.message,
            };
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
            case '%':
                if (x === undefined) missing.push("'x'");
                if (y === undefined) missing.push("'y'");
                break;
            case 'np':
            case 'p':
            case '!':
                if (n === undefined) missing.push("'n'");
                break;
            default:
                missing.push("'op'");
        }
        return missing;
    }

    async handleMathOperations(op, x, y, n) {
        if (['+', '-', '*', '/', '%'].includes(op)) {
            if (x === undefined) throw new Error("'x' parameter is missing");
            x = parseFloat(x);
            if (isNaN(x)) throw new Error("'x' parameter is not a number");

            if (y === undefined) throw new Error("'y' parameter is missing");
            y = parseFloat(y);
            if (isNaN(y)) throw new Error("'y' parameter is not a number");
        }

        if (n !== undefined) {
            n = parseFloat(n);
            if (isNaN(n)) throw new Error("'n' parameter is not a number");
            if (!Number.isInteger(n) || n <= 0) throw new Error("'n' parameter must be an integer > 0");
        } else if (op === '!' || op === 'p' || op === 'np') {
            throw new Error("'n' parameter is missing");
        }

        switch (op) {
            case '+':
                return x + y;
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                if (y === 0) {
                    if (x === 0){
                        return x / y;
                    }
                    throw new Error("Infinity");
                }
                return x / y;
            case '%':
                return x % y;
            case 'p':
                return this.isPrime(n);
            case 'np':
                return this.getNthPrime(n);
            case '!':
                return this.factorial(n);
            default:
                throw new Error(`Unsupported operation: ${op}`);
        }
    }

    isPrime(num) {
        if (!Number.isInteger(n) || num <= 0) throw new Error("'n' parameter must be an integer > 0");
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    getNthPrime(n) {
        if (n < 1) throw new Error("'n' must be a positive integer");

        let count = 0;
        let num = 1;

        while (count < n) {
            num++;
            if (this.isPrime(num)) {
                count++;
            }
        }
        return num;
    }

    factorial(n) {
        if (!Number.isInteger(n) || n <= 0) throw new Error("'n' parameter must be an integer > 0");
        if (n === 0) return 1;

        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}
