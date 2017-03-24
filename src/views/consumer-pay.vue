<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">付款详情</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="imgs">
        订单信息：{{userOrderInfo.item_name}} 技师：{{userOrderInfo.massagist_name}}
    </div>
    <div class="imgs">
        支付方式：
        <a class="active">微信在现在支付</a>
        <a>线下支付</a>
    </div>
    <div class="imgs">
        需付款：<em>￥{{userOrderInfo.order_totalprice}}</em>
    </div>

    <button type="button" class="mui-btn mui-btn-warning mui-btn-block" style="width: 90%;margin: 20px auto;" @click="pay">付款</button>
    </div></div>
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerPay',
    data: function(){
        return{
            userOrderInfo: {}
        }
    },
    ready: function(){
        document.title = '付款详情'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getStoreWx, {
            oid: this.$route.params.id,
            sid: this.$route.params.storeid
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.userOrderInfo = data.data.object
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        pay(){
            window.location.href = API.wxPayOrder + '?token=' + this.$route.params.token + '&sid=' + this.$route.params.storeid + '&num=' + this.userOrderInfo.order_num
        }
    },
    components: {
        Start
    }
}
    
</script>