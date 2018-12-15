const pow2 = val => Math.pow(val, 2)

export default {
    rand(n, m) {
        return Math.floor(Math.random() * (m - n + 1) + n)
    },
    distance(n, m) {
        return Math.abs(n - m)
    },
    pointDistance(p1, p2) {
        return Math.sqrt(pow2(p1.x - p2.x) + pow2(p1.y - p2.y))
    },
    limit(val, max) {
        const dist = Math.min(Math.abs(val), max)
        return val > 0 ? dist : -dist
    },
    numberLimit(val, min, max) {
        if (val < min) {
            return min
        }
        if (val > max) {
            return max
        }
        return val
    },
    px(px, canvasWidth) {
        return canvasWidth / 750 * px
    },
}
