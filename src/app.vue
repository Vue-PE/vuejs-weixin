<template>
    <router-view></router-view>
    <tip :show.sync='tips.show' :options.sync='tips.options'></tip>
    <wechat></wechat>
</template>
<script>
import store from './vuex/store'
import Tip from './components/tips.vue'
import Wechat from './service/wechat.vue'

export default {
    data: function(){
        return{
            tips: this.$store.state.tip
        }
    },
    ready: function(){
        document.body.addEventListener('touchmove', function (event) {event.preventDefault()}, true)
        let screenWidth = window.screen.width
        window.onresize = function () {
            if(Math.abs(screenWidth - window.screen.width) > 20) location.reload()
        }
    },
    components: {
        Tip, Wechat
    },
    store
}
</script>