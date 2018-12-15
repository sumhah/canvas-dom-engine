export default class Watcher {
    _val = null

    constructor(obj, key, callback) {
        this._val = obj[key]
        const val = this._val
        if (val === undefined) {
            console.error(`watch attribute ${key} is not exist`)
            return
        }
        Object.defineProperty(obj, key, {
            get: () => {
                return this._val
            },
            set: (newVal) => {
                const oldVal = this._val
                if (oldVal !== newVal) {
                    this._val = newVal
                    callback(newVal, oldVal)
                }
            },
        })
    }
}