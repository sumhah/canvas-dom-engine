export default class HtmlParser {
    static currentState = 'start'
    static tags = []
    static currentTag = {}
    static currentAttribute = {}
    static historyTags = []

    static parse(template) {
        this.tags = []
        this.template = template
        for (let i = 0, len = template.length; i < len; i += 1) {
            const char = template[i]
            this.readChar(char, i)
        }
        return this.tags
    }

    static readChar(char, i) {
        switch (this.currentState) {
            case 'start':
                if (char === '<') {
                    this.currentState = 'tagName'
                    this.currentTag = this.createTag()
                }
                break
            case 'tagName':
                if (this.currentTag.name === '') {
                    if (this.isTagNameBegin(char)) {
                        this.currentTag.name += char
                    } else {
                        console.error(`tag name has illegal char [${char}], at index ${i}`)
                    }
                } else {
                    if (this.isTagNameContent(char)) {
                        this.currentTag.name += char
                    } else if (char === '>') {
                        // 无闭合标签
                        this.matchFirstLessThanSign()
                    } else if (char === '/') {
                        this.currentState = 'tagNameEndAndHas/'
                    } else {
                        this.currentState = 'tagAttribute'
                    }
                }
                break
            case 'tagNameEndAndHas/':
                if (char === '>') {
                    this.tagEnd()
                } else {
                    console.error(`tag name / must match >,has illegal char [${char}], at index ${i}`)
                }
                break
            case 'tagAttribute':
                if (this.isAttributeNameContent(char)) {
                    this.currentState = 'tagAttributeName'
                    this.currentAttribute = this.createAttribute()
                    this.currentTag.attributes.push(this.currentAttribute)
                    this.currentAttribute.name += char
                } else if (char === '>') {
                    this.matchFirstLessThanSign()
                }
                break
            case 'tagAttributeName':
                if (this.isAttributeNameContent(char)) {
                    this.currentAttribute.name += char
                } else if (char === '=') {
                    this.currentState = 'tagAttributeValue'
                } else {
                    console.error(`attribute name has illegal char [${char}], at index ${i}`)
                }
                break
            case 'tagAttributeValue':
                if (char === `"`) {
                    this.currentState = 'tagAttributeValueBegin'
                } else {
                    console.error(`attribute: [=] has not match ["], error char is [${char}], at index ${i}`)
                }
                break
            case 'tagAttributeValueBegin':
                if (char !== `"`) {
                    this.currentAttribute.content += char
                } else {
                    this.currentState = 'tagAttribute'
                }
                break
            case 'tagContent':
                if (char === '<') {
                    this.currentState = 'tagContentAndHas<'
                } else {
                    this.currentTag.content += char
                }
                break
            case 'tagContentAndHas<':
                if (this.isTagNameBegin(char)) {
                    this.historyTags.push(this.currentTag)
                    const parentTag = this.currentTag
                    this.currentTag = this.createTag()
                    parentTag.children.push(this.currentTag)
                    this.currentTag.name += char
                    this.currentState = 'tagName'
                } else if (char === '/') {
                    this.currentState = 'tagEnd'
                } else if (char === '<') {
                    this.currentTag.content += '<'
                } else {
                    this.currentTag.content += `<${char}`
                    this.currentState = 'tagContent'
                }
                break
            case 'tagEnd':
                if (char === '>') {
                    this.tagEnd()
                }
                break
        }
    }

    static isTagNameBegin(char) {
        return /[a-zA-Z]/.test(char)
    }

    static isTagNameContent(char) {
        return /[\w-]/.test(char)
    }

    static isAttributeNameContent(char) {
        return /[\w:@-]/.test(char)
    }

    static createTag() {
        return {
            name: '',
            attributes: [],
            content: '',
            children: [],
        }
    }

    static tagEnd() {
        if (this.historyTags.length > 0) {
            this.currentTag = this.historyTags.pop()
            this.currentState = 'tagContent'
        } else {
            this.tags.push(this.currentTag)
            this.currentState = 'start'
        }
    }

    static createAttribute() {
        return {
            name: '',
            content: '',
        }
    }

    static matchFirstLessThanSign() {
        if (this.currentTag.name === 'img' || this.currentTag.name === 'br') {
            this.tagEnd()
        } else {
            this.currentState = 'tagContent'
        }
    }
}