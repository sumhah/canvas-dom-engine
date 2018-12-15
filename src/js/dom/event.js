export default class Event {
    static eventMap = {}

    static on(eventName, callback) {
        if (!Event.hasEvent(eventName)) {
            Event.eventMap[eventName] = [callback]
            return
        }

        Event.eventMap[eventName].push(callback)
    }

    static emit(eventName, ...props) {
        if (!Event.hasEvent(eventName)) {
            console.error(`no event ${eventName}`)
            return
        }

        Event.eventMap[eventName].forEach(fn => fn(...props))
    }

    static hasEvent(eventName) {
        return Array.isArray(Event.eventMap[eventName])
    }
}