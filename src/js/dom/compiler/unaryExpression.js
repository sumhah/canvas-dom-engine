export default class UnaryExpression {
    argument = null
    type = 'UnaryExpression'

    constructor(operator, argument, prefix) {
        this.operator = operator
        this.argument = argument
        this.prefix = prefix
    }
}