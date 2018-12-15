import {isOperator, isPartOfIdentifier, isPartOfNumber, isStartOfIdentifier, isStartOfString} from './util'

export default class Tokenizer {

    static reset() {
        this.state = 'start'
        this.currentStr = ''
        this.startChar = ''
        this.tokens = []
        this.code = ''
        this.maxIndex = 0
        this.currentIndex = 0
    }

    static generate(code) {
        this.reset()
        this.code = code + ' '
        this.maxIndex = code.length + 1
        while (this.readChar()) {
            console.log(1)
        }
        return this.tokens
    }

    static readChar() {
        const char = this.code[this.currentIndex]
        switch (this.state) {
            case 'start':
                if (isStartOfIdentifier(char)) {
                    this.currentStr = char
                    this.state = 'identifier'
                } else if (isStartOfString(char)) {
                    this.currentStr = char
                    this.startChar = char
                    this.state = 'string'
                } else if (isPartOfNumber(char)) {
                    this.currentStr = char
                    this.state = 'number'
                } else if (isOperator(char)) {
                    this.currentStr = char
                    this.state = 'operator'
                }
                this.next()
                break
            case 'identifier':
                if (isPartOfIdentifier(char)) {
                    this.currentStr += char
                    this.next()
                } else {
                    this.addToken('identifier', this.currentStr)
                }
                break
            case 'number':
                if (isPartOfNumber(char)) {
                    this.currentStr += char
                    this.next()
                } else {
                    this.addToken('number', this.currentStr)
                }
                break
            case 'string':
                if (char === this.startChar) {
                    this.addToken('string', this.currentStr.substring(1))
                } else {
                    this.currentStr += char
                }
                this.next()
                break
            case 'operator':
                if (isOperator(this.currentStr) && !isOperator(this.currentStr + char)) {
                    this.addToken('operator', this.currentStr)
                } else {
                    this.currentStr += char
                    this.next()
                }
                break
        }

        return this.currentIndex <= this.maxIndex
    }

    static addToken(type, value) {
        this.tokens.push({type, value})
        this.currentStr = ''
        this.state = 'start'
    }

    static next() {
        this.currentIndex += 1
    }
}