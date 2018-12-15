import Header from './components/Header'

export default {
    name: 'appPage',
    components: {
        Header,
    },
    template: `
<div class="app">
    <Header></Header>
    <div class="list">
        <div class="item" v-for="itemList" @click="itemHandler">{{ item.index }}</div>
    </div>
</div>
    `,
    data: {
        itemList: new Array(10).fill(0).map((item, i) => ({
            index: i,
        }))
    },
    created() {
        console.log('root created')
    },
    methods: {
        itemHandler(...args) {
            console.log(args)
            console.log('click')
        }
    }
}
