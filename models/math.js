import Model from './model.js';

export default class Math extends Model {
    constructor() {
        super();

        this.addField('op', 'string');
        this.addField('x', 'number');
        this.addField('y', 'number');
        this.addField('n', 'number');

        this.setKey('op');
    }
}