<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">提交订单</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="shop-title-container order">
        <img :src="$store.state.URL + htmlInfo.project_info.item_image">
        <h1 style="width: 80%;">{{htmlInfo.project_info.item_name}}</h1>
        <h5>套餐详情：{{htmlInfo.project_info.item_intro}}</h5>
        <div class="price">
            <em>￥{{htmlInfo.project_info.item_price}}</em>
        </div>
    </div>
    <div class="order-tech">
        <img :src="htmlInfo.technician_info.massagist_photo">
        <h1>工号：{{htmlInfo.technician_info.massagist_no}}&nbsp;&nbsp;&nbsp;&nbsp;昵称：{{htmlInfo.technician_info.massagist_name}}</h1>
    </div>

    <form class="order-form select-working">
        <div class="mui-input-row mui-radio mui-left {{serType==0 ? 'show-color' : ''}}">
            <label>在店消费</label>
            <input name="radio1" type="radio" v-model="serType" value="0">
        </div>
        <div class="mui-input-row mui-radio mui-left {{serType==1 ? 'show-color' : ''}}">
            <label>技师上门</label>
            <input name="radio1" type="radio" v-model="serType" value="1">
        </div>
        <section v-show="serType == 0">
            手牌号：
            <select v-model="handId" style="color: #{{handId == 0? '999' : '333'}};">
                <option value="0" disabled selected style='display:none;'>手牌</option>
                <option v-for="item in handList" value="{{item.value}}" :selected="$index == 0">{{item.text}}</option>
            </select>
            <br>
            房间号：
            <select v-model="roomStorey" style="color: #{{roomStorey == 0? '999' : '333'}};">
                <option value="0" disabled selected style='display:none;'>楼层</option>
                <option v-for="item in htmlInfo.room_info" value="{{item}}" :selected="$index == 0">{{item}}楼</option>
            </select>
            <select v-model="roomNo" style="color: #{{roomNo == 0? '999' : '333'}};">
                <option value="0" disabled selected style='display:none;'>房间号</option>
                <option v-for="item in roomNoList" value="{{item.id}}">{{item.value}}</option>
            </select>
        </section>
        <section v-show="serType == 1">
            房间号：
            <input type="text" style="width: 150px;" v-model="roomInfo">
        </section>
        <section>　备注：<input type="text" placeholder="请输入您要备注的信息" v-model="info"></section>
    </form>
    
    <div class="order-foot">
        <h3>订单总价：<span>￥{{htmlInfo.total_price}}</span></h3>
        <button type="button" class="mui-btn mui-btn-warning mui-btn-block" @click="submit">提交订单</button>
    </div>
    </div></div>
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerOrderSub',
    data: function(){
        return{
            htmlInfo: {},
            serType: 0,
            roomStorey: 0,
            roomNo: 0,
            roomInfo: '',
            roomNoList: [],
            handList: [],
            handId: 0,
            info: ''
        }
    },
    watch: {
        'roomStorey': function(){
            if(this.roomStorey == 0) return
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getRoomNum, {
                sid: this.$route.params.storeid,
                floor: this.roomStorey
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.roomNoList = data.data.list
            })
        }
    },
    ready: function(){
        document.title = '提交订单'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.generateOrderHtml, {
            sid: this.$route.params.storeid,
            pid: this.$route.params.pid,
            tid: this.$route.params.tid
        }).then( (data) => {
            if(data.data.errorInfo) return;
            this.$store.state.hideTip();
            this.htmlInfo = data.data.list;
            if(this.htmlInfo.technician_info.massagist_photo.indexOf('http')<0){
                this.htmlInfo.technician_info.massagist_photo = this.$store.state.URL + this.htmlInfo.technician_info.massagist_photo;
            }
        });
        this.$http.post(API.userGetHandSelect, {
            sid: this.$route.params.storeid
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.handList = data.data.list;
        });
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        submit(){
            if(this.roomNo == 0 && this.roomInfo.length<=0){
                this.$store.state.showTip({type: 'error', content: '请输入正确的房间号' })
                return 
            }
            this.$store.state.showTip({type: 'loading', content: '提交中...' });
            let _data = {
                belongs: this.$route.params.storeid,
                projectid: this.$route.params.pid,
                massagist: this.$route.params.tid,
                address: this.serType,
                info: this.info,
            };
            this.serType == 0 ? _data.room = this.roomNo : _data.room_num = this.roomInfo;
            if(this.handId!=0) _data.hand = this.handId;
            this.$http.post(API.userSubmitOrder, _data).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.$store.state.showTip({type: 'success', content: '提交成功' });
                let socket = new WebSocket("ws://121.43.163.207:9509");
                let self = this;
                socket.onopen = function (event) {
                    socket.send('{"store": "'+ self.$route.params.storeid +'","fun1":"1","fun2":"2","fun3":"3"}');
                };
                socket.onmessage = function (event) {
                    console.log(event.data);
                }
                setTimeout(()=>{
                    this.$router.go('/consumer-order-list/' + this.$route.params.token + '/' + this.$route.params.storeid);
                }, 1500)
            })
        }
    },
    components: {
        Start
    }
}
    
</script>