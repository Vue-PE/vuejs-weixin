<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">我的订单</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>
    
    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item mui-active" >我的订单</a>
        <a class="winslow-control-item" v-link="{path: '/consumer-my/' + $route.params.token + '/' + $route.params.storeid}">我的资料</a>
    </div>

    <ul class="order-container">
        <li v-for="item in userOrderlist">
            <div class="order-text">
                <div class="image-size-list" style="background-image: url({{$store.state.URL + item.item_image}});"></div>
                <!-- <img :src="$store.state.URL + item.item_image"> -->
                <h1>{{item.item_name}}</h1>
                <h6>下单时间：{{item.order_createtime | format 'yyyy-MM-dd hh:mm'}}</h6>
                <p>总价：￥{{item.order_totalprice}}</p>
                <div class="price">￥{{item.order_totalprice}}<br>
                    <em class="suc" v-if="item.order_status == 1 && item.order_pay == 1">完成</em>
                    <em class="cancel" v-if="item.order_status == 2">已取消</em>
                    <em v-if="item.order_status == 3">未开始</em>
                    <em class="fin" v-if="item.order_status == 4">消费中</em>
                    <em class="fin" v-if="item.order_status == 6">待确认</em>
                    <em class="fin" v-if="item.order_status == 1 && item.order_pay == 0">待付款</em>
                </div>
            </div>
            <div class="order-btn">
                <a v-if="item.order_status == 3" @click="cancelOrder(item.order_id)">取消订单</a>
                <a v-link="{path: '/consumer-order-info/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.order_id}">订单详情</a>
                <a class="red" v-if="item.order_status == 1 && item.order_pay == 0" v-link="{path: '/consumer-pay/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.order_id}">确认付款</a>
                <a class="red" v-if="item.order_status == 6" @click="$store.state.showTip({type: 'error', content: '订单金额不详，请与前台联系' })">待确认</a>
                <a class="red" v-if="item.order_status == 1 && !item.order_comment && item.order_pay == 1" v-link="{path: '/consumer-post-comment/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.order_id}">发表评价</a>
                <a class="red" v-if="item.order_status == 1 && item.comment && item.order_pay == 1">已评价</a>
                <a class="red" v-if="item.order_status == 2" @click="delOrder(item.order_id)">删除订单</a>
            </div>
        </li>
    </ul>

    <div class="no-data" v-if="userOrderlist.length<=0">
        <h1>您还没有相关订单</h1>
        <h6>去下一单试试吧</h6>
        <a v-link="{path: '/consumer/' + this.$route.params.token + '/' + this.$route.params.storeid}">去店铺逛逛</a>
    </div>

    <a class="btn-more" v-if="btnPage" @click="nextPage">查看更多</a>

    </div>
    </div>

    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item" v-link="{path: '/consumer/' + this.$route.params.token + '/' + this.$route.params.storeid}">
            <span class="iconfont">&#xe67d;</span>
            <span class="mui-tab-label">首页</span>
        </a>
        <a class="winslow-tab-item mui-active">
            <span class="iconfont">&#xe61e;</span>
            <span class="mui-tab-label">我的</span>
        </a>
    </nav>
    
    
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerOrderList',
    data: function(){
        return{
            userOrderlist: [],
            page: 1,
            btnPage: false
        }
    },
    ready: function(){
        document.title = '我的订单'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getUserOrderlist, {
            page: this.page,
            sid: this.$route.params.storeid
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip();
            if(!data.data.list){
                this.btnPage = false;
                return;
            }else if(data.data.list.length < this.$store.state.pageSize){
                this.btnPage = false;
            }else{
                this.btnPage = true;
            };
            this.userOrderlist = data.data.list
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        nextPage(){
            this.page++
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getUserOrderlist, {page: this.page}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip();
                if(!data.data.list){
                    this.btnPage = false;
                    return;
                }else if(data.data.list.length < this.$store.state.pageSize){
                    this.btnPage = false;
                }else{
                    this.btnPage = true;
                };
                this.userOrderlist = this.userOrderlist.concat(data.data.list)
            })
        },
        cancelOrder(id){
            let me = this
            mui.confirm('确定取消吗？', '提醒', ['取消', '确定'], function(e) {
                if(e.index == 1){
                    me.$store.state.showTip({type: 'loading', content: '取消中...' })
                    me.$http.post(API.deleteOrderList, {
                        order_id: id,
                        sid: me.$route.params.storeid,
                        action: 'cancel'
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '取消成功' })
                        setTimeout(()=>{ location.reload() }, 1500)
                    })
                }
            })
        },
        delOrder(id){
            let me = this
            mui.confirm('确定删除吗？', '提醒', ['取消', '确定'], function(e) {
                if(e.index == 1){
                    me.$store.state.showTip({type: 'loading', content: '删除中...' })
                    me.$http.post(API.deleteOrderList, {
                        order_id: id,
                        sid: me.$route.params.storeid
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '删除成功' })
                        setTimeout(()=>{ location.reload() }, 1500)
                    })
                }
            })
        }
    },
    components: {
        Start
    }
}
    
</script>