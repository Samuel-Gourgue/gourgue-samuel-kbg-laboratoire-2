import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        let param = this.HttpContext.path.params;

        let operation = param['op'] && param['op'].trim() !== '' ? param['op'] : null;

        let x = param['x'] || param['X'];
        let y = param['y'] || param['Y'];
        let n = param['n'] || param['N'];

        let missingParams = this.checkMissingParams(operation, x, y, n);
        if (missingParams.length > 0) {
            const errorResponse = {
                op: operation,
                x: param['x'],
                y: param['y'],
                n: param['n'],
                X: param['X'],
                Y: param['Y'],
                N: param['N'],
                error: `${missingParams.join(', ')} parameter is missing`
            };
            return this.HttpContext.response.JSON(errorResponse);
        }

        let extraParams = this.checkExtraParams(param, operation);
        if (extraParams.length > 0 && missingParams.length === 0) {
            const errorResponse = {
                op: operation,
                x: param['x'],
                y: param['y'],
                n: param['n'],
                X: param['X'],
                Y: param['Y'],
                N: param['N'],
                error: `Too many parameters: ${extraParams.join(', ')}`
            };
            return this.HttpContext.response.JSON(errorResponse);
        }

        try {
            const result = await this.handleMathOperations(operation, param['x'], param['y'], param['n']);
            const response = { op: operation, value: result };
            if (param['x'] !== undefined) response.x = param['x'];
            if (param['y'] !== undefined) response.y = param['y'];
            if (param['n'] !== undefined) response.n = param['n'];

            this.HttpContext.response.JSON(response);
        } catch (error) {
            const errorResponse = { op: operation, error: error.message };
            if (param['x'] !== undefined) errorResponse.x = param['x'];
            if (param['y'] !== undefined) errorResponse.y = param['y'];
            if (param['n'] !== undefined) errorResponse.n = param['n'];

            this.HttpContext.response.JSON(errorResponse);
        }
    }

    checkMissingParams(op, x, y, n) {
        let missing = [];
        if (!op) {
            missing.push("'op'");
        } else {
            switch (op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    if (x === undefined || x === null || x === '') missing.push("'x'");
                    if (y === undefined || y === null || y === '') missing.push("'y'");
                    break;
                case 'np':
                case 'p':
                case '!':
                    if (n === undefined || n === null || n === '') missing.push("'n'");
                    break;
                default:
                    missing.push("'op'");
            }
        }
        return missing;
    }

    checkExtraParams(params, op) {
        const expectedParams = ['op'];
        if (['+', '-', '*', '/', '%'].includes(op)) {
            expectedParams.push('x', 'y');
        } else if (['np', 'p', '!'].includes(op)) {
            expectedParams.push('n');
        }

        return Object.keys(params).filter(param => !expectedParams.includes(param));
    }

    async handleMathOperations(op, x, y, n) {
        if (['+', '-', '*', '/', '%'].includes(op)) {
            if (x !== undefined || x == "") {
                x = parseFloat(x);
                if (isNaN(x)) throw new Error("'x' parameter is not a number");
            } else {
                throw new Error("'x' parameter is missing");
            }
    
            if (y !== undefined || y == "") {
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
