import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        let param = this.HttpContext.path.params;

        let x = param['x'] !== undefined ? param['x'] : param['X'];
        let y = param['y'] !== undefined ? param['y'] : param['Y'];
        let n = param['n'] !== undefined ? param['n'] : param['N'];

        let operation = param['op'] && param['op'].trim() !== '' ? param['op'] : '+';

        let missingParams = this.checkMissingParams(operation, x, y, n);
        if (missingParams.length > 0) {
            return this.HttpContext.response.badRequest(`Missing required parameters: ${missingParams.join(', ')}`);
        }

        try {
            const result = await this.handleMathOperations(operation, x, y, n);

            const response = { op: operation, value: result };
            if (param['X'] !== undefined) response.X = param['X'];
            if (param['x'] !== undefined) response.x = param['x'];
            if (param['Y'] !== undefined) response.Y = param['Y'];
            if (param['y'] !== undefined) response.y = param['y'];
            if (param['n'] !== undefined) response.n = param['n'];

            this.HttpContext.response.JSON(response);
        } catch (error) {
            const errorResponse = { op: operation, error: error.message };
            if (param['X'] !== undefined) errorResponse.X = param['X'];
            if (param['x'] !== undefined) errorResponse.x = param['x'];
            if (param['Y'] !== undefined) errorResponse.Y = param['Y'];
            if (param['y'] !== undefined) errorResponse.y = param['y'];
            if (param['n'] !== undefined) errorResponse.n = param['n'];

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
                if (x === undefined || x === '') missing.push("'x'");
                if (y === undefined || y === '') missing.push("'y'");
                break;
            case 'np':
            case 'p':
            case '!':
                if (n === undefined || n === '') missing.push("'n'");
                break;
            default:
                missing.push("'op'");
        }
        return missing;
    }

    async handleMathOperations(op, x, y, n) {
        if (['+', '-', '*', '/', '%'].includes(op)) {
            if (x !== undefined && x !== '') {
                x = parseFloat(x);
                if (isNaN(x)) throw new Error("'x' parameter is not a number");
            } else {
                throw new Error("'x' parameter is missing");
            }
    
            if (y !== undefined && y !== '') {
                y = parseFloat(y);
                if (isNaN(y)) throw new Error("'y' parameter is not a number");
            } else {
                throw new Error("'y' parameter is missing");
            }
        }
    
        if (n !== undefined) {
            n = parseFloat(n);
            if (isNaN(n)) throw new Error("'n' parameter is not a number");
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
                    if (x === 0) {
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
        if (num <= 0) throw new Error("'n' parameter must be an integer > 0");
        if (!Number.isInteger(num)) throw new Error("'n' parameter must be an integer > 0");
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
        if (n <= 0) throw new Error("'n' parameter must be an integer > 0");
        if (!Number.isInteger(n)) throw new Error("'n' parameter must be an integer > 0");
        if (n === 0) return 1;

        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}
