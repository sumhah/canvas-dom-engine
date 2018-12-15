import Tokenizer from './tokenizer'
import Parser from './parser'

export default class Compiler {

    static eval(code) {
        const tokens = Tokenizer.generate(code)
        console.log(tokens)
        const ast = Parser.parse(tokens)
        console.log(ast)
    }
}