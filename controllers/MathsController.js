import Controller from './Controller.js';

export default class MathsController extends Controller {
    async get() {
        const { op, x, y, n } = this.HttpContext.path.params;

        let operation = op && op.trim() !== '' ? op : '+';

        try {
            const result = await this.handleMathOperations(operation, x, y, n);
            if (result !== undefined) {
                this.HttpContext.response.JSON({
                    op: operation,
                    x: x !== undefined ? x : null,
                    y: y !== undefined ? y : null,
                    n: n !== undefined ? n : null,
                    value: result,
                });
            } else {
                this.HttpContext.response.badRequest('Invalid operation or missing parameters.');
            }
        } catch (error) {
            this.HttpContext.response.badRequest({
                error: error.message,
            });
        }
    }

    async handleMathOperations(op, x, y, n) {
        x = parseFloat(x);
        y = parseFloat(y);
        n = parseInt(n);

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
}
