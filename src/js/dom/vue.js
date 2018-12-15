import DomNode from './domNode'
import HtmlParser from './htmlParser'
import Watcher from './watcher'

export default class Vue {
    name = ''
    $domNodes = []
    $elements = []
    $children = {}
    $watchers = []
    $parent = null
    $parserNode = null
    $stylesheet = null

    constructor(config, stylesheet, parent = {}, ctx) {
        this.name = config.name
        this.$ctx = ctx
        this.$parent = parent
        this.$stylesheet = stylesheet
        this._bindRelationship(config, stylesheet)
    }

    $update() {
        this.$domNodes[0].children = this.generateDomNode(this.$parserNode, this, undefined, this.$stylesheet, [])[0].children
    }

    _bindRelationship(config, stylesheet) {
        this._bindData(config)
        this._bindMethods(config)
        this._bindComputed(config)
        this._bindWatcher(config)
        const domNode = this._bindTemplate(config, stylesheet)[0]
        domNode._this = this
        this._bindElements(domNode) // 只有这个跟渲染的样式有关
        this.$domNodes.push(domNode)
        if (config.created) {
            config.created.call(this)
        }
    }

    _bindTemplate(config, stylesheet) {
        if (config.template) {
            return this.generate(config.template, this, stylesheet, config.components)
        } else {
            console.error('config no template')
        }
    }

    _bindMethods(config) {
        if (config.methods) {
            for (let key of Object.keys(config.methods)) {
                this[key] = config.methods[key].bind(this)
            }
        }
    }

    _bindData(config) {
        if (config.data) {
            for (let key of Object.keys(config.data)) {
                this[key] = config.data[key]
            }
        }
    }

    _bindElements(node) {
        this.$elements[node.staticClassList.concat(node.dynamicClassList).join(' ')] = node
        node.children.forEach(node => this._bindElements(node))
    }

    _bindComputed(config) {
        const computed = config.computed
        if (computed) {
            for (let key of Object.keys(computed)) {
                Object.defineProperty(this, key, {
                    get: () => {
                        return computed[key].call(this)
                    },
                })
            }
        }
    }

    _bindWatcher(config) {
        const watch = config.watch
        if (watch) {
            for (let key of Object.keys(watch)) {
                this.$watchers.push(new Watcher(this, key, (newVal, oldVal) => {
                    watch[key].call(this, newVal, oldVal)
                }))
            }
        }
    }

    generateDomNode(node, _this, scopeItem, stylesheet, components) {
        const attributeFor = node.attributes.find(item => item.name === 'v-for')
        const dataArr = attributeFor ? this.evalVarName(attributeFor.content, _this) : [undefined]

        return dataArr.map((item, i) => {
            const component = components[node.name]
            if (component) {
                const vue = new Vue(component, stylesheet, this, this.$ctx)
                if (Array.isArray(this.$children[vue.name])) {
                    this.$children[vue.name].push(vue)
                } else {
                    this.$children[vue.name] = [vue]
                }
                return vue.$domNodes[0]
            }
            const currentItem = item || scopeItem
            const domNode = new DomNode(node.name, stylesheet, this.$ctx)
            this._bindAttributes(domNode, node.attributes, _this, currentItem, i)
            this._bindContent(domNode, node.content, _this, currentItem, i)
            node.children.forEach(child => domNode.children.push(...this.generateDomNode(child, _this, currentItem, stylesheet, components)))
            domNode.children.forEach(child => child.bindParent(domNode))
            return domNode
        })
    }

    generate(template, _this, stylesheet, components = []) {
        const node = HtmlParser.parse(template)[0]
        this.$parserNode = node
        return this.generateDomNode(node, _this, undefined, stylesheet, components)
    }

    evalVarName(string, _this, scopeItem, scopeIndex) {
        const isIndex = typeof scopeIndex === 'number' && string === 'i'
        if (isIndex) {
            return scopeIndex
        }

        const isItem = scopeItem && string.substr(0, 4) === 'item'
        let current = isItem ? scopeItem : _this
        string.split('.').slice(isItem ? 1 : 0).forEach(name => {
            current = current[name]
        })
        return current
    }

    // eval(ast, _this) {
    //
    // }

    _bindAttributes(domNode, attributes, _this, scopeItem, scopeIndex) {
        attributes.forEach(attribute => {
            const name = attribute.name
            const content = attribute.content
            if (name === ':pause') {
                Object.defineProperty(domNode, 'isPause', {
                    get: () => {
                        return this.evalVarName(content, _this, scopeItem, scopeIndex)
                    },
                })
            }
            if (name === ':src') {
                Object.defineProperty(domNode, 'imgSrc', {
                    get: () => {
                        return this.evalVarName(content, _this, scopeItem, scopeIndex)
                    },
                })
            }
            if (name === 'v-show') {
                // 未实现for
                Object.defineProperty(domNode, 'isShow', {
                    get: () => {
                        return this.evalVarName(content, _this, scopeItem, scopeIndex)
                    },
                })
            }
            if (name === 'class') {
                domNode.staticClassList = content.split(' ')
            }
            if (name === ':class') {
                const classArray = content.split(' ')
                Object.defineProperty(domNode, 'dynamicClassList', {
                    get: () => {
                        if (scopeItem) {
                            return classArray.map(className => className.replace(/{([$\w.]+)}/ig, (str, varName) => this.evalVarName(varName, _this, scopeItem, scopeIndex)))
                        } else {
                            const className = this[content]
                            if (className === '') {
                                return []
                            } else {
                                return className.split(' ')
                            }
                        }
                    },
                })
            }
            if (name === ':top') {
                Object.defineProperty(domNode.style, 'top', {
                    get: () => {
                        return this.evalVarName(content, _this, scopeItem, scopeIndex)
                    },
                })
            }
            if (name === ':width') {
                Object.defineProperty(domNode.style, 'width', {
                    get: () => {
                        return this.evalVarName(content, _this, scopeItem, scopeIndex)
                    },
                })
            }
            if (name === '@click') {
                const contents = content.split('=')
                if (contents.length === 1) {
                    domNode.bindClick(() => {
                        _this[contents[0]](scopeItem, scopeIndex)
                    })
                }
                if (contents.length === 2) {
                    const prop = contents[0].trim()
                    const value = contents[1].trim()
                    domNode.bindClick(() => {
                        _this[prop] = this.eval(value, _this)
                    })
                }
            }
            if (name === '@update') {
                domNode.updateHandler = this[content]
            }
            if (name === '@showStateChange') {
                this.$watchers.push(new Watcher(domNode, 'isVisible', this[content]))
            }
        })
    }

    _bindContent(domNode, content, _this, scopeItem, scopeIndex) {
        Object.defineProperty(domNode, 'content', {
            get: () => {
                if (content.includes('{{')) {
                    return content.replace(/{{([\w\W]+)}}/ig, (string, value) => this.evalVarName(value.trim(), _this, scopeItem, scopeIndex))
                }
                return content.trim()
            },
        })
    }
}
