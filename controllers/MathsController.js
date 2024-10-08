import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    
    async get() {
        const query = this.HttpContext.query || {};
        const { op, x, y, n } = query;
    
        const operation = op && op.trim() !== '' ? op : '+';
    
        try {
            const result = await this.handleMathOperations(operation, x, y, n);
            if (result !== undefined) {
                this.HttpContext.response.writeHead(200, { 'Content-Type': 'application/json' });
                this.HttpContext.response.end(JSON.stringify({
                    n,
                    op: operation,
                    value: result,
                }));
            }
        } catch (error) {
            this.HttpContext.response.writeHead(400, { 'Content-Type': 'application/json' });
            this.HttpContext.response.end(JSON.stringify({
                error: error.message,
            }));
        }
    }
    

    async handleMathOperations(op, x, y, n) {
        const errors = this.validateParameters(op, x, y, n);
        if (errors.length > 0) {
            return this.HttpContext.response.status(422).json({ errors });
        }

        let result;
        switch (op) {
            case '+':
                result = parseFloat(x) + parseFloat(y);
                break;
            case '-':
                result = parseFloat(x) - parseFloat(y);
                break;
            case '*':
                result = parseFloat(x) * parseFloat(y);
                break;
            case '/':
                if (parseFloat(y) === 0) {
                    return this.HttpContext.response.status(400).json({
                        error: "Division by zero is not allowed."
                    });
                }
                result = parseFloat(x) / parseFloat(y);
                break;
            case '%':
                result = parseFloat(x) % parseFloat(y);
                break;
            case '!':
                result = this.factorial(parseInt(n));
                break;
            case 'p':
                result = this.isPrime(parseInt(n));
                break;
            case 'np':
                result = this.nthPrime(parseInt(n));
                break;
            default:
                return this.HttpContext.response.status(422).json({
                    error: "Invalid operation"
                });
        }

        return result;
    }

    validateParameters(op, x, y, n) {
        const errors = [];
        const allowedOps = ['+', '-', '*', '/', '%', '!', 'p', 'np'];

        if (!allowedOps.includes(op)) {
            errors.push({ op: `Operation '${op}' is not valid.` });
        }

        if (x !== undefined && isNaN(x)) {
            errors.push({ x: `'x' parameter is not a number` });
        }
        if (y !== undefined && isNaN(y)) {
            errors.push({ y: `'y' parameter is not a number` });
        }

        if (['!', 'p', 'np'].includes(op) && (n === undefined || isNaN(n))) {
            errors.push({ n: `'n' parameter is not a number` });
        }

        if (['+', '-', '*', '/', '%'].includes(op) && (x === undefined || y === undefined)) {
            errors.push({ parameters: `Missing parameters x or y for operation '${op}'` });
        }

        return errors;
    }

    factorial(n) {
        if (n < 0) return false;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    isPrime(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    nthPrime(n) {
        let count = 0, num = 1;
        while (count < n) {
            num++;
            if (this.isPrime(num)) count++;
        }
        return num;
    }
}
