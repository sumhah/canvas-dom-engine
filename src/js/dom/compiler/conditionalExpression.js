export default class ConditionalExpression {
    type = 'ConditionalExpression'
    test = null
    consequent = null
    alternate = null

    constructor(test, consequent, alternate) {
        this.test = test
        this.consequent = consequent
        this.alternate = alternate
    }
}