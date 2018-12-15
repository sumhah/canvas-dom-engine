import ConditionalExpression from './conditionalExpression'
import {OPERATORS, isUnaryOperator, isBinaryOperator, isConditionalOperator} from './util'
import ExpressionParser from './compiler'
import BinaryExpression from './binaryExpression'
import UnaryExpression from './unaryExpression'

export default class Parser {

    static parse(tokens) {
        this.currentIndex = 0
        this.maxIndex = 0
        this.evalCount = 0
        this.maxIndex = tokens.length
        return this.generate(tokens)
    }

    static generate(tokens) {
        while (tokens.length > 1) {
            ExpressionParser.evalCount += 1
            if (ExpressionParser.evalCount > 1000) {
                break
            }
            const {left, operatorToken, targetTokens, nextIndex} = this.split(tokens)
            tokens.splice(0, nextIndex, this.createExpression(operatorToken, left, targetTokens))
        }
        return tokens[0]
    }

    static createExpression(operatorToken, left, targetTokens) {
        if (isBinaryOperator(operatorToken.value)) {
            return new BinaryExpression(operatorToken.value, left, this.generate(targetTokens))
        }
        if (isUnaryOperator(operatorToken.value)) {
            return new UnaryExpression(operatorToken.value, this.generate(targetTokens))
        }
        if (isConditionalOperator(operatorToken.value)) {
            const {consequent, alternate} = this.splitCondition(targetTokens)
            return new ConditionalExpression(left, this.generate(consequent), this.generate(alternate))
        }
    }

    static split(tokens) {
        const operatorIndex = tokens.findIndex(item => item.type === 'operator')
        const operatorToken = tokens[operatorIndex]
        const rightTokens = tokens.slice(operatorIndex + 1)
        const rightTokenIndex = rightTokens.findIndex(item => OPERATORS.indexOf(item.value) > OPERATORS.indexOf(operatorToken.value))
        const sliceIndex = rightTokenIndex === -1 ? rightTokens.length : rightTokenIndex

        return {
            left: tokens[0],
            operatorToken,
            targetTokens: rightTokens.slice(0, sliceIndex),
            nextIndex: operatorIndex + sliceIndex + 1,
        }
    }

    static splitCondition(tokens) {
        const questionMarks = []
        let colonIndex = 0
        tokens.forEach((token, i) => {
            if (token.value === '?') {
                questionMarks.push(token.value)
            }
            if (token.value === ':') {
                if (questionMarks.length === 0) {
                    colonIndex = i
                } else {
                    questionMarks.pop()
                }
            }
        })
        return {
            consequent: tokens.slice(0, colonIndex),
            alternate: tokens.slice(colonIndex + 1),
        }
    }
}