export const OPERATORS = [
    '(',
    ')',
    '.',
    '[',
    ']',
    '++',
    '--',
    '!',
    '~',
    '**',
    '*',
    '/',
    '%',
    '+',
    '-',
    '<<',
    '>>',
    '>>>',
    '<',
    '<=',
    '>',
    '>=',
    '==',
    '!=',
    '===',
    '!==',
    '&',
    '^',
    '|',
    '&&',
    '||',
    ':',
    '?',
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
    '&=',
    '^=',
    '|=',
    '...',
    ',',
]

export function isStartOfIdentifier(char) {
    return /[$_a-zA-Z]/.test(char)
}

export function isPartOfNumber(char) {
    return /[0-9]/.test(char)
}

export function isPartOfIdentifier(char) {
    return /[$_a-zA-Z\d]/.test(char)
}

export function isStartOfString(char) {
    return /['"`]/.test(char)
}

export function isOperator(string) {
    return OPERATORS.includes(string)
}

export function isUnaryOperator(token) {
    return [
        '&',
        '|',
        '++',
        '--',
        '!',
    ].includes(token)
}

export function isBinaryOperator(token) {
    return [
        '+',
        '-',
        '*',
        '/',
        '&&',
        '||',
        '>',
        '>=',
        '<',
        '<=',
        '===',
        '!==',
        '==',
        '!=',
        '.',
        '=',
        '<<',
        '>>',
        '>>>',
    ].includes(token)
}

export function isConditionalOperator(token) {
    return [
        '?',
    ].includes(token)
}