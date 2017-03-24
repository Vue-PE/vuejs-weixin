<template>
<div class="page" style="background: #EEE;"></div>
</template>

<script>
export default{
    name: 'index',
    ready: function(){
        document.title = '养生汇'
        this.$store.state.showTip({type: 'loading', content: '请稍后...' })
        this.$http.post(API.getUserInfo, {
            token: this.$route.params.token
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            // 没有选择身份
            if(data.data.object.wechat_identity == 0){
                this.$router.go('/login/' + this.$route.params.token + '/' + this.$route.params.storeid)
                return
            }
            // 消费者
            if(data.data.object.wechat_identity == 1){
                this.$router.go('/consumer/' + this.$route.params.token + '/' + this.$route.params.storeid)
                return
            }
            // 技师
            if(data.data.object.wechat_identity == 2){
                this.$router.go('/tech/' + this.$route.params.token)
                return
            }
            // 经理
            if(data.data.object.wechat_identity == 3 || data.data.object.wechat_identity == 4){
                this.$router.go('/manage-shop/' + this.$route.params.token)
                return
            }
            
        })
    }
}
    
</script>