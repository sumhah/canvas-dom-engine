import AssetsLoader from './AssetsLoader';
import UI from './dom/ui'
import AppPage from './pages/app'

export default class App {
    static init(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.preload().then(() => {
            this.run();
        });
    }

    static preload() {
        return AssetsLoader.load({
            image: [
            ],
            audio: [
            ],
        });
    }

    static run() {
        UI.create(AppPage, this.canvas)
        App.update()
    }

    static update() {
        this.ctx.clearRect(0, 0, 1000, 1000)
        UI.update()
        requestAnimationFrame(() => App.update())
    }

    static pause() {

    }
}
