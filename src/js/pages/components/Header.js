
export default {
    name: 'header',
    template: `
<div class="header" @click="test">
    hello world {{ timeText }}
</div>
    `,
    data: {
        time: 123
    },
    computed: {
        timeText() {
            return this.time + '小时'
        }
    },
    watch: {
        time(val) {
            console.log(val)
        }
    },
    created() {
    },
    methods: {
        test() {
            console.log('test')
        }
    }
}
