export default class Controller {
    constructor(HttpContext, repository = null) {
        this.HttpContext = HttpContext;
        this.repository = repository;
    }

    async get() {
        const params = this.HttpContext.path.params || {};
        const { op, x, y, n } = params;

        if (op) {
            return this.handleMathOperations(op, x, y, n);
        } else if (this.repository) {
            if (this.HttpContext.path.id !== undefined) {
                if (!isNaN(this.HttpContext.path.id)) {
                    let data = this.repository.get(this.HttpContext.path.id);
                    if (data) {
                        this.HttpContext.response.JSON(data);
                    } else {
                        this.HttpContext.response.notFound("Ressource not found.");
                    }
                } else {
                    this.HttpContext.response.badRequest("The Id in the request URL is not specified or syntactically incorrect.");
                }
            } else {
                this.HttpContext.response.JSON(this.repository.getAll());
            }
        } else {
            this.HttpContext.response.badRequest("No operation or resource specified.");
        }
    }

    async handleMathOperations(op, x, y, n) {
        try {
            if (isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
                return this.invalidParams(['x', 'y']);
            }
    
            switch (op) {
                case '+':
                    return this.sendResult(parseFloat(x) + parseFloat(y));
    
                case '-':
                    return this.sendResult(parseFloat(x) - parseFloat(y));
    
                case '*':
                    return this.sendResult(parseFloat(x) * parseFloat(y));
    
                case '/':
                    if (parseFloat(y) === 0) {
                        return this.HttpContext.response.status(400).json({
                            error: "Division by zero is not allowed"
                        });
                    }
                    return this.sendResult(parseFloat(x) / parseFloat(y));
    
                case '%':
                    return this.sendResult(parseFloat(x) % parseFloat(y));
    
                case '!':
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
                    return this.sendResult(this.factorial(parseInt(n)));
    
                case 'p':
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
                    return this.sendResult(this.isPrime(parseInt(n)));
    
                case 'np':
                    if (n === undefined) {
                        return this.invalidParams(['n']);
                    }
                    return this.sendResult(this.nthPrime(parseInt(n)));
    
                default:
                    return this.HttpContext.response.status(422).json({
                        error: "Invalid operation"
                    });
            }
        } catch (error) {
            return this.HttpContext.response.status(400).json({
                error: error.message
            });
        }
    }
    

    invalidParams(params) {
        return this.HttpContext.response.status(422).json({
            error: `Missing or invalid parameters: ${params.join(', ')}`
        });
    }

    sendResult(value) {
        return this.HttpContext.response.status(200).json({
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
            if (this.repository.model.state.inConflict)
                this.HttpContext.response.conflict(this.repository.model.state.errors);
            else
                this.HttpContext.response.badRequest(this.repository.model.state.errors);
        }
    }

    put(data) {
        if (!isNaN(this.HttpContext.path.id)) {
            this.repository.update(this.HttpContext.path.id, data);
            if (this.repository.model.state.isValid) {
                this.HttpContext.response.ok();
            } else {
                if (this.repository.model.state.notFound) {
                    this.HttpContext.response.notFound(this.repository.model.state.errors);
                } else {
                    if (this.repository.model.state.inConflict)
                        this.HttpContext.response.conflict(this.repository.model.state.errors);
                    else
                        this.HttpContext.response.badRequest(this.repository.model.state.errors);
                }
            }
        } else
            this.HttpContext.response.badRequest("The Id of the resource is not specified in the request URL.");
    }

    remove(id) {
        if (!isNaN(this.HttpContext.path.id)) {
            if (this.repository.remove(id))
                this.HttpContext.response.accepted();
            else
                this.HttpContext.response.notFound("Resource not found.");
        } else
            this.HttpContext.response.badRequest("The Id in the request URL is not specified or syntactically incorrect.");
    }
}
