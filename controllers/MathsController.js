import MathModel from '../models/math.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new MathModel()));
    }

    async get() {
        const params = this.HttpContext.path.params || {};
        const { op, x, y, n } = params;

        if (op) {
            await this.handleMathOperations(op, x, y, n);
        } else {
            await super.get(this.HttpContext.path.id);
        }
    }

    async handleMathOperations(op, x, y, n) {
        try {
            if (op.trim() === '') {
                op = '+';
            }

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

            return this.sendResult(result);
        } catch (error) {
            if (!this.HttpContext.response.headersSent) {
                return this.HttpContext.response.status(500).json({
                    error: "An unexpected error occurred."
                });
            }
        }
    }

    validateParameters(op, x, y, n) {
        const errors = [];
        if (!['+', '-', '*', '/', '!', 'p', 'np'].includes(op)) {
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
        return errors;
    }

    sendResult(value) {
        if (!this.HttpContext.response.headersSent) {
            return this.HttpContext.response.status(200).json({ value });
        }
    }

    factorial(n) {
        if (n < 0) throw new Error("Negative number not allowed for factorial");
        return n <= 1 ? 1 : n * this.factorial(n - 1);
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