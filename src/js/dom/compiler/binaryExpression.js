export default class BinaryExpression {
    left = null
    right = null
    type = 'BinaryExpression'

    constructor(operator, left, right) {
        this.operator = operator
        this.left = left
        this.right = right
    }
}