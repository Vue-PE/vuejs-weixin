<template>
<div class="page consumer" style="padding-bottom: 10px;">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">订单详情</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>

    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="title">订单详情</div>
    <div class="shop-title-container order">
        <div class="image-size-list" style="background-image: url({{$store.state.URL + userOrderInfo.item_image}});"></div>
        <!-- <img :src="$store.state.URL + userOrderInfo.item_image"> -->
        <h1>{{userOrderInfo.item_name}}</h1>
        <h5>套餐详情：{{userOrderInfo.item_intro}}</h5>
        <div class="price">
            <em>￥{{userOrderInfo.item_price}}</em>
        </div>
    </div>
    <div class="order-tech">
        <img :src="userOrderInfo.massagist_photo">
        <h1>工号：{{userOrderInfo.massagist_no}} 昵称：{{userOrderInfo.massagist_name}}</h1>
    </div>

    <ul class="mui-table-view order-info">
        <li class="mui-table-view-cell">
            房间号<span class="mui-pull-right">{{userOrderInfo.order_address == 0 ? userOrderInfo.room_num : userOrderInfo.order_room_num}}</span>
        </li>
        <li class="mui-table-view-cell">
            服务类型<span class="mui-pull-right">{{userOrderInfo.order_address == 0 ? '在店消费' : '技师上门'}}</span>
        </li>
        <li class="mui-table-view-cell">
            订单总价<span class="mui-pull-right">￥{{userOrderInfo.order_totalprice}}</span>
        </li>
        <li class="mui-table-view-cell show-color">
            需付款<span class="mui-pull-right show-color">￥{{userOrderInfo.order_totalprice}}</span>
        </li>
    </ul>
    <div class="title">订单信息</div>
    <ul class="mui-table-view order-info">
        <li class="mui-table-view-cell">
            订单备注<span class="mui-pull-right">{{userOrderInfo.order_info || '无'}}</span>
        </li>
        <li class="mui-table-view-cell">
            订单编号<span class="mui-pull-right">{{userOrderInfo.order_num}}</span>
        </li>
        <li class="mui-table-view-cell">
            创建时间<span class="mui-pull-right">{{userOrderInfo.order_createtime || '' | format 'yyyy-MM-dd hh:mm:ss'}}</span>
        </li>
        <li class="mui-table-view-cell">
            完成时间<span class="mui-pull-right">{{userOrderInfo.order_donetime || status | format 'yyyy-MM-dd hh:mm:ss'}}</span>
        </li>
        <li class="mui-table-view-cell show-color">
            订单状态<span class="mui-pull-right show-color">{{status}}</span>
        </li>
    </ul>
    <div style="width: 90%;margin: 15px auto;" v-if="userOrderInfo.order_status == 1 && userOrderInfo.order_pay == 0">
        <button type="button" class="mui-btn mui-btn-warning mui-btn-block" v-link="{path: '/consumer-pay/' + $route.params.token + '/' + $route.params.storeid + '/' + $route.params.id}">确认付款</button>
    </div>
    </div></div>
    
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerOrderInfo',
    data: function(){
        return{
            userOrderInfo: {},
            status: ''
        }
    },
    ready: function(){
        document.title = '订单详情'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getUserOrderInfo, {
            order_id: this.$route.params.id,
            sid: this.$route.params.storeid
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.userOrderInfo = data.data.list
            if(this.userOrderInfo.massagist_photo.indexOf('http')<0){
                this.userOrderInfo.massagist_photo = this.$store.state.URL + this.userOrderInfo.massagist_photo
            }
            if(this.userOrderInfo.order_status == 1 && this.userOrderInfo.order_pay == 0) this.status = '待付款'
            if(this.userOrderInfo.order_status == 1 && this.userOrderInfo.order_pay == 1) this.status = '已完成'
            if(this.userOrderInfo.order_status == 2) this.status = '已取消'
            if(this.userOrderInfo.order_status == 3) this.status = '未开始'
            if(this.userOrderInfo.order_status == 4) this.status = '消费中'
            if(this.userOrderInfo.order_status == 6) this.status = '待确认'
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        }
    },
    components: {
        Start
    }
}
    
</script>