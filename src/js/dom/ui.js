import style from './style'
import Vue from './vue'
import _ from './util'

function isInInner({x, y}, {left, right, top, bottom}) {
    return left < x && right > x && top < y && bottom > y
}

export default class UI {
    static vueInstance = []
    static styles = null
    static activeScrollViews = []
    static rootNode = null

    static create(vueConfig, canvas) {
        const canvasWidth = canvas.width
        this.styles = style(canvasWidth)
        this.vueInstance = new Vue(vueConfig, this.styles, undefined, canvas.getContext('2d'))
        this.rootNode = this.vueInstance.$domNodes[0]
        try {
            let lastY = 0
            canvas.addEventListener('click', e => {
                let x = e.layerX
                let y = e.layerY
                UI._triggerClick(this.rootNode, x, y)
                lastY = y
            })
            canvas.addEventListener('touchstart', e => {
                console.log(e)
                let x = e.changedTouches[0].clientX
                let y = e.changedTouches[0].clientY
                UI._triggerClick(this.rootNode, x, y)
                lastY = y
            })
            canvas.addEventListener('touchmove', e => {
                let y = e.changedTouches[0].clientY

                UI.activeScrollViews.forEach(item => {
                    item.scrollTop = _.numberLimit((item.scrollTop + lastY - y), 0, item.getScrollTopMax())
                    lastY = y
                })
            })
            canvas.addEventListener('touchend', (e) => {
                UI.activeScrollViews = []
            })
        } catch (e) {
            console.log(e)
        }
    }

    static _triggerClick(item, x, y) {
        if (!item.isShow) {
            return
        }

        const style = item.style
        const left = style.left
        const top = style.top
        const children = item.children
        if (children) {
            for (let i = children.length - 1; i >= 0; i -= 1) {
                const item = children[i]
                if (UI._triggerClick(item, x - left, y - top)) {
                    break
                }
            }
        }

        if (isInInner(
                {x, y},
                {
                    left,
                    top,
                    right: style.left + item.width,
                    bottom: style.top + item.height,
                })) {
            // if (style.overflow) {
            //     this.activeScrollViews.push(item)
            // }

            console.log(item.className, item)
            if (item.clickHandler) {
                requestAnimationFrame(() => item.clickHandler())
            }
            return true
        }
    }

    static update() {
        this.rootNode.update()
    }
}
