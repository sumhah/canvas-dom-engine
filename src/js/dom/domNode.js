import AssetsLoader from '../AssetsLoader.js'

export default class DomNode {
    name = ''
    ctx = null
    staticClassList = []
    dynamicClassList = []
    className = ''
    style = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        scale: 1,
        fontSize: 24,
        color: '#000',
    }
    scrollTop = 0
    content = ''
    isShow = true
    isVisible = true
    parent = null
    children = []
    imgSrc = ''
    clickHandler = null
    isPause = false
    stylesheet = {}
    childrenTotalHeight = null
    updateHandler = null

    constructor(name, stylesheet, ctx) {
        this.name = name
        this.stylesheet = stylesheet
        this.ctx = ctx
    }

    get width() {
        const {width, scale} = this.style
        return width * scale
    }

    get height() {
        const {height, scale} = this.style
        return height * scale
    }

    get styleShouldRefresh() {
        return this.className !== this.staticClassList.concat(this.dynamicClassList).join(' ')
    }

    bindParent(parent) {
        this.parent = parent
    }

    bindClick(handler) {
        this.clickHandler = handler
    }

    _calcStyle() {
        const classes = this.staticClassList.concat(this.dynamicClassList)
        this.className = classes.join(' ')
        const style = this.style
        const parentStyle = this.parent ? this.parent.style : {}
        for (let parentStyleProp of ['fontSize', 'color']) {
            if (parentStyle[parentStyleProp]) {
                style.fontSize = parentStyle[parentStyleProp]
            }
        }
        for (let className of classes) {
            const itemStyle = this.stylesheet[className]
            if (itemStyle) {
                for (let key of Object.keys(itemStyle)) {
                    style[key] = itemStyle[key]
                }
            }
        }
    }

    _getChildrenTotalHeight() {
        if (typeof this.childrenTotalHeight === 'number') {
            return this.childrenTotalHeight
        }
        const children = this.children
        if (!children || children.length === 0) {
            return 0
        }
        this.childrenTotalHeight = children.length * children[0].height
        return this.childrenTotalHeight
    }

    getScrollTopMax() {
        if (this.scrollTopMax) {
            return this.scrollTopMax
        }

        this.scrollTopMax = Math.max(this._getChildrenTotalHeight() - this.height, 0)
        return this.scrollTopMax
    }

    _notifyChildrenVisibleState() {
        this.isVisible = false
        this.children.forEach(child => child._notifyChildrenVisibleState())
    }

    update(contextLeft = 0, contextTop = 0, lastItemTop = 0, scrollTop = 0, isPause = false) {
        if (!this.isShow) {
            this._notifyChildrenVisibleState()
            return
        }
        this.isVisible = true
        if (this.styleShouldRefresh) {
            this._calcStyle()
        }
        const style = this.style
        let currentLeft = contextLeft + style.left
        let currentTop = contextTop + style.top

        if (style.position === 'static') {
            currentTop += lastItemTop
        }
        currentTop -= scrollTop

        const pause = isPause || this.isPause
        this.setAlpha()
        this.clipRoundRect(currentLeft, currentTop, this.width, this.height, style.borderRadius)
        this.drawBackgroundColor(currentLeft, currentTop, this.width, this.height, style.backgroundColor)
        this.drawImage(currentLeft, currentTop, pause)
        this.drawContent(currentLeft, currentTop)
        this.overflow(currentLeft, currentTop)
        this.roundRectRestore()
        this.drawChildren(currentLeft, currentTop, pause)
        this.restore()

        if (this.updateHandler) {
            this.updateHandler()
        }
    }

    setAlpha() {
        const opacity = this.style.opacity
        if (opacity) {
            this.ctx.save()
            this.ctx.globalAlpha = opacity
        }
    }

    clipRoundRect(x, y, w, h, r) {
        if (this.style.borderRadius) {
            let radius = r
            if (w < 2 * r) {
                radius = w / 2
            }
            if (h < 2 * r) {
                radius = h / 2
            }
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.moveTo(x + r, y)
            this.ctx.arcTo(x + w, y, x + w, y + h, radius)
            this.ctx.arcTo(x + w, y + h, x, y + h, radius)
            this.ctx.arcTo(x, y + h, x, y, radius)
            this.ctx.arcTo(x, y, x + w, y, radius)
            this.ctx.clip()
        }
    }

    drawBackgroundColor(left, top, width, height, backgroundColor) {
        if (this.style.backgroundColor) {
            this.ctx.fillStyle = backgroundColor
            this.ctx.fillRect(left, top, width, height)
        }
    }

    drawImage(left, top, isPause) {
        const style = this.style
        if (this.imgSrc) {
            const image = AssetsLoader.images[this.imgSrc]
            if (!image) {
                AssetsLoader.loadImage(this.imgSrc, this.imgSrc)
            } else {
                this.ctx.drawImage(image, 0, 0, image.width, image.height, left, top, this.width, this.height)
            }
        } else if (style.image) {
            let image
            if (Array.isArray(style.image)) {
                if (style.currentFrame === undefined) {
                    style.currentFrame = 0
                    style.duration = 0
                }
                style.duration += 1
                image = AssetsLoader.images[style.image[style.currentFrame]]
                if (style.duration >= style.updateDuration && !isPause) {
                    style.currentFrame = (style.currentFrame + 1) % style.image.length
                    style.duration = 0
                }
            } else {
                image = AssetsLoader.images[style.image]
            }
            this.ctx.drawImage(image, 0, 0, image.width, image.height, left, top, this.width, this.height)
        }
    }

    drawContent(left, top) {
        if (this.content) {
            const style = this.style
            if (style.fontSize) {
                this.ctx.font = `${style.fontWeight === 'bold' ? 'bold ' : ''}${style.fontSize}px Arial`
            }
            if (style.color) {
                this.ctx.fillStyle = style.color
            }
            const content = this.content
            const textLeft = style.textAlign === 'center' ? left + (this.width - this.ctx.measureText(content).width) / 2 : left
            this.ctx.fillText(content.toString(), textLeft, top + style.fontSize)
        }
    }

    overflow(left, top) {
        if (this.style.overflow) {
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.rect(left, top, this.width, this.height)
            this.ctx.clip()
        }
    }

    roundRectRestore() {
        if (this.style.borderRadius) {
            this.ctx.restore()
        }
    }

    restore() {
        if (this.style.overflow) {
            this.ctx.restore()
        }
        if (this.style.opacity) {
            this.ctx.restore()
        }
    }

    drawChildren(left, top, isPause) {
        const children = this.children
        if (children) {
            let lastItemTop = 0
            children.forEach(item => {
                item.update(left, top, lastItemTop, this.scrollTop, isPause)
                lastItemTop += item.height
            })
        }
    }
}
