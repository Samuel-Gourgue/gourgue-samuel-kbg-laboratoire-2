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
            super.get(this.HttpContext.path.id);
        }
    }

    async handleMathOperations(op, x, y, n) {
        try {
            if (op === ' ') {
                op = '+';
            }

            if (!['+', '-', '*', '/', '!', 'p', 'np'].includes(op) || isNaN(x) || isNaN(y)) {
                return this.HttpContext.response.status(400).json({
                    n: y,
                    op: op,
                    value: false
                });
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
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
                    result = this.factorial(parseInt(n));
                    break;
                case 'p':
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
                    result = this.isPrime(parseInt(n));
                    break;
                case 'np':
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
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
                return this.HttpContext.response.status(400).json({
                    error: error.message
                });
            }
        }
    }

    invalidParams(params) {
        if (!this.HttpContext.response.headersSent) {
            return this.HttpContext.response.status(422).json({
                error: `Missing or invalid parameters: ${params.join(', ')}`
            });
        }
    }

    sendResult(value) {
        if (!this.HttpContext.response.headersSent) {
            this.HttpContext.response.status(200).json({
                value
            });
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
