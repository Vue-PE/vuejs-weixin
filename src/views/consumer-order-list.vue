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
                <h1 style="width: 80%;">{{item.item_name}}</h1>
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
                <a v-if="item.order_status != 1 && item.order_status != 2" @click="chooseGood(item.order_id)">商品消费</a>
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

    <div class="choose-good" v-show="goodShow">
        <div class="container">
            <h1>选择商品</h1>
            <ul class="wrap">
                <li v-for="item in goodsList" data-id="{{item.goods_id}}">
                    <img src="{{$store.state.URL+item.goods_head}}">
                    <span class="name">{{item.goods_name}}</span>
                    <span class="price">￥{{item.goods_price}}</span>
                    <div class="mui-numbox">
                      <button class="mui-btn mui-numbox-btn-minus" type="button">-</button>
                      <input class="mui-numbox-input" type="number" value="{{item.value}}" />
                      <button class="mui-btn mui-numbox-btn-plus" type="button">+</button>
                    </div>
                </li>
                <div v-if="goodsList.length<=0" class="no-data"><h6>店铺没有商品可选</h6></div>
            </ul>
            <footer>
                <a @click="goodShow = false">取消</a><a @click="subGood()">确定</a>
            </footer>
        </div>
    </div>
    
    
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
            btnPage: false,
            goodShow: false,
            goodsList: [],
            goodsInfo: {
                oid: null,
                gid: []
            }
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
        });
        let me = this;
        $('.choose-good').on('click', '.mui-numbox-btn-plus', function(){
            var _ = parseInt($(this).prev().val());
            $(this).prev().val(_+1);
            me.setGoodId();
        });
        $('.choose-good').on('click', '.mui-numbox-btn-minus', function(){
            var _ = parseInt($(this).next().val());
            if(_<=0) return;
            $(this).next().val(_-1);
            me.setGoodId();
        });

    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        setGoodId(){
            let me = this;
            me.goodsInfo.gid = [];
            for(var i=0; i<$('.choose-good li').length; i++){
                for(var j=0; j<$('.choose-good li:eq('+i+')').find('input').val(); j++){
                    me.goodsInfo.gid.push($('.choose-good li:eq('+i+')').attr('data-id'));
                }
            }
        },
        subGood(){
            let me = this;
            if(me.goodsInfo.gid.length == 0){
                me.$store.state.showTip({type: 'error', content: '请添加或修改商品' })
                return;
            }
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.user_add_goods_this_order, {
                sid: this.$route.params.storeid,
                id: this.goodsInfo.oid,
                goods: this.goodsInfo.gid
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.showTip({type: 'success', content: '处理成功' });
                let socket = new WebSocket("ws://121.43.163.207:9509");
                let self = this;
                socket.onopen = function (event) {
                    socket.send('{"store": "'+ self.$route.params.storeid +'","fun1":"1","fun2":"2","fun3":"3"}');
                };
                socket.onmessage = function (event) {
                    console.log(event.data);
                }
                setTimeout(()=>{
                    location.reload();
                }, 1500);
            })
        },
        chooseGood(id){
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            let me =this;
            this.$http.post(API.user_get_this_order_goods, {
                sid: this.$route.params.storeid,
                pid: id
            }).then( (data) => {
                if(data.data.errorInfo) return
                let goodList = data.data.list ? data.data.list : [];
                this.$http.post(API.user_get_goods_select, {
                    sid: this.$route.params.storeid,
                }).then( (data) => {
                    if(data.data.errorInfo) return
                    this.$store.state.hideTip();
                    this.goodsList = [];
                    for(var i=0; i<data.data.list.length; i++){
                        this.goodsList[i] = data.data.list[i];
                        this.goodsList[i].value = 0;
                        for(var j=0; j<goodList.length; j++){
                            if(goodList[j].id == me.goodsList[i].goods_id){
                                me.goodsList[i].value = goodList[j].num;
                            }
                        }
                    }
                    this.goodShow = true;
                    this.goodsInfo.oid = id;
                });
            });
        },
        nextPage(){
            this.page++
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getUserOrderlist, {
                page: this.page,
                sid:  this.$route.params.storeid
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
                        me.$store.state.showTip({type: 'success', content: '取消成功' });
                        let socket = new WebSocket("ws://121.43.163.207:9509");
                        let self = this;
                        socket.onopen = function (event) {
                            socket.send('{"store": "'+ self.$route.params.storeid +'","fun1":"1","fun2":"2","fun3":"3"}');
                        };
                        socket.onmessage = function (event) {
                            console.log(event.data);
                        }
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