<template>
<div class="page tech" style="padding-top: 0px; background-color: #f1f1f1;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">我的工单</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="top: 44px;">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted" style=" background-color: #fff;">
        <a class="winslow-control-item mui-active" >工单</a>
        <a class="winslow-control-item" @click="local('tech-comment')">评价</a>
        <a class="winslow-control-item" @click="local('tech-info')">资料</a>
    </div>
    
    
    <div id="item1mobile" class="mui-control-content fade-in-left mui-active">
        <div class="title">
            <a class="{{period == '' ? 'active' : ''}}" @click="getOrder('')">当天</a>
            <a class="{{period == 'week' ? 'active' : ''}}" @click="getOrder('week')">一周内</a>
            <a class="{{period == 'month' ? 'active' : ''}}" @click="getOrder('month')">一月内</a>
        </div>
        <ul class="order-item">
            <li v-for="item in orderList">
                <div class="order-code">订单号:{{item.order_num}}</div>
                <div class="mui-table-view-cell mui-media">
                    <a href="javascript:;">
                        <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                        <div class="mui-media-body mui-ellipsis">
                            {{item.item_name}}
                            <p>完成时间：{{item.order_donetime | format 'yyyy-MM-dd hh:mm:ss'}}</p>
                            <p class="price">订单总价：<span>￥{{item.order_totalprice}}</span></p>
                        </div>
                    </a>
                </div>
                <div class="bg"></div>
            </li>
            <div class="no-data" v-if="orderList.length<=0" >
                <h6>还没有订单哟~~~</h6>
            </div>
        </ul>
        <a class="btn-more" v-if="btnPage" @click="nextPage">查看更多</a>
    </div>
    </div>
    </div>
    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item " @click="local('tech')">
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
export default{
    name: 'techMy',
    data: function(){
        return{
            active: '',
            period: '',
            orderList: [],
            page: 1,
            btnPage: false
        }
    },
    ready: function(){
        document.title = '我的工单'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.getOrder('')
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        getOrder: function(name){
            this.period = this.active = name
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getWorkOrder, {
                time: this.period,
                page: this.page
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
                this.orderList = this.orderList.concat(data.data.list);
            }) 
        },
        nextPage(){
            this.page++
            this.getOrder(this.active)
        },
    }
}
    
</script>