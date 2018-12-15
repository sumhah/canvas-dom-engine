import _ from './util'

const px = _.px

function stylesToFit(styles, canvasWidth) {
    for (let key of Object.keys(styles)) {
        const style = styles[key]
        for (let prop of Object.keys(style)) {
            const value = style[prop]
            if (typeof value === 'number' && prop !== 'scale') {
                style[prop] = px(value, canvasWidth)
            }
        }

        // const image = AssetsLoader.images[Array.isArray(style.image) ? style.image[0] : style.image]
        // if (style.image) {
        //     if (!style.width) {
        //         style.width = px(image.width)
        //     }
        //     if (!style.height) {
        //         style.height = px(image.height)
        //     }
        // }
    }
}

const style = function (canvasWidth) {
    const styles = {
        app: {
            width: 750,
            height: 1334,
            backgroundColor: '#ccc',
            borderRadius: 10,
        },
        header: {
            width: 400,
            height: 300,
            left: 100,
            top: 20,
            backgroundColor: '#333',
            fontSize: 30,
            color: '#fff',
            textAlign: 'center',
        },
        list: {
            width: 200,
            height: 400,
            overflow: 'scroll',
            backgroundColor: '#fff',
        },
        item: {
            position: 'static',
            width: 200,
            height: 30,
            fontSize: 20,
            color: '#000',
            textAlign: 'center',
            backgroundColor: '#ccc',
        }
    }
    stylesToFit(styles, canvasWidth)
    return styles
}

export default style
