import Model from './model.js';

export default class Controller {
    constructor(HttpContext, repository = null) {
        this.HttpContext = HttpContext;
        this.repository = repository;
    }

    async get() {
        const params = this.HttpContext.path.params || {};
        const { op, x, y, n } = params;

        if (op) {
            return await this.handleMathOperations(op, x, y, n);
        } else if (this.repository) {
            return await this.handleRepositoryOperations();
        } else {
            return this.HttpContext.response.badRequest("No operation or resource specified.");
        }
    }

    async handleRepositoryOperations() {
        if (this.HttpContext.path.id !== undefined) {
            if (!isNaN(this.HttpContext.path.id)) {
                const data = this.repository.get(this.HttpContext.path.id);
                if (data) {
                    return this.HttpContext.response.JSON(data);
                } else {
                    return this.HttpContext.response.notFound("Resource not found.");
                }
            } else {
                return this.HttpContext.response.badRequest("The Id in the request URL is not specified or syntactically incorrect.");
            }
        } else {
            return this.HttpContext.response.JSON(this.repository.getAll());
        }
    }

    async handleMathOperations(op, x, y, n) {
        try {
            if (op.trim() === '') {
                op = '+';
            }

            if (!['+', '-', '*', '/', '!', 'p', 'np'].includes(op) || isNaN(x) || (op !== '!' && isNaN(y))) {
                return this.HttpContext.response.status(400).json({
                    n,
                    op,
                    value: null,
                    error: "Invalid operation or parameters."
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
                    return await this.handleFactorial(n);
                case 'p':
                    return await this.handlePrime(n);
                case 'np':
                    return await this.handleNthPrime(n);
                default:
                    return this.HttpContext.response.status(422).json({
                        error: "Invalid operation"
                    });
            }

            return this.sendResult(result);
        } catch (error) {
            return this.HttpContext.response.status(400).json({
                error: error.message
            });
        }
    }

    async handleFactorial(n) {
        if (n === undefined || isNaN(n)) {
            return this.invalidParams(['n']);
        }
        const result = this.factorial(parseInt(n));
        return this.sendResult(result);
    }

    async handlePrime(n) {
        if (n === undefined || isNaN(n)) {
            return this.invalidParams(['n']);
        }
        const result = this.isPrime(parseInt(n));
        return this.sendResult(result);
    }

    async handleNthPrime(n) {
        if (n === undefined || isNaN(n)) {
            return this.invalidParams(['n']);
        }
        const result = this.nthPrime(parseInt(n));
        return this.sendResult(result);
    }

    invalidParams(params) {
        return this.HttpContext.response.status(422).json({
            error: `Missing or invalid parameters: ${params.join(', ')}`
        });
    }

    sendResult(value) {
        this.HttpContext.response.status(200).json({
            value
        });
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

    post(data) {
        data = this.repository.add(data);
        if (this.repository.model.state.isValid) {
            this.HttpContext.response.created(data);
        } else {
            this.handlePostErrors();
        }
    }

    handlePostErrors() {
        if (this.repository.model.state.inConflict) {
            this.HttpContext.response.conflict(this.repository.model.state.errors);
        } else {
            this.HttpContext.response.badRequest(this.repository.model.state.errors);
        }
    }

    put(data) {
        if (!isNaN(this.HttpContext.path.id)) {
            this.repository.update(this.HttpContext.path.id, data);
            this.handlePutErrors();
        } else {
            this.HttpContext.response.badRequest("The Id of the resource is not specified in the request URL.");
        }
    }

    handlePutErrors() {
        if (this.repository.model.state.isValid) {
            this.HttpContext.response.ok();
        } else {
            if (this.repository.model.state.notFound) {
                this.HttpContext.response.notFound(this.repository.model.state.errors);
            } else {
                this.handlePostErrors();
            }
        }
    }

    remove(id) {
        if (!isNaN(this.HttpContext.path.id)) {
            if (this.repository.remove(id)) {
                this.HttpContext.response.accepted();
            } else {
                this.HttpContext.response.notFound("Resource not found.");
            }
        } else {
            this.HttpContext.response.badRequest("The Id in the request URL is not specified or syntactically incorrect.");
        }
    }
}
