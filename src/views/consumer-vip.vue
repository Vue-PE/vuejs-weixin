<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">VIP中心</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="vip-info">
        <img :src="userInfo.wechat_headimgurl">
        <h1>{{userInfo.wechat_nickname}} <i class="lv lv{{userInfo.wechat_userlevel}}"></i></h1>
        <p v-if="userInfo.wechat_userlevel<=0">您还不是VIP</p>
        <p v-if="userInfo.wechat_userlevel>0">您已开通VIP</p>
    </div>

    <div class="vip-wrap">
        <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
            <a class="mui-control-item mui-active" href="#item1"><i class="iconfont">&#xe60c;</i> 终身VIP</a>
            <a class="mui-control-item" href="#item2">体验VIP</a>
        </div>
        <div id="item1" class="mui-slider-item mui-control-content mui-active">
            <p>
                畅想VIP特权，查看技师真实图片，一次充值，终身有效。<br>
                现推广期内加入终身VIP，可永享V9最高等级！
            </p>
            <input type="text" value="￥100" readonly="readonly" class="{{userInfo.wechat_userlevel>0 ? 'vip' : ''}}">
            <button class="vip" v-if="userInfo.wechat_userlevel>0">立即开通</button>
            <button v-if="userInfo.wechat_userlevel<=0" @click="pay(1)">立即开通</button>
        </div>
        <div id="item2" class="mui-slider-item mui-control-content">
            <p>
                体验VIP特权，可查看技师真实图片，体验期三天
            </p>
            <input type="text" value="￥5" readonly="readonly" class="{{userInfo.wechat_userlevel>0 ? 'vip' : ''}}">
            <button class="vip" v-if="userInfo.wechat_userlevel>0">立即开通</button>
            <button v-if="userInfo.wechat_userlevel<=0" @click="pay(2)">立即开通</button>
        </div>
    </div>
    
    <div class="vip-foot">
        <p>VIP使用说明：</p>
        <p>· VIP服务一经开通后不支持退款；</p>
        <p>· 如遇到支付问题，请拨打客服电话：<a href="tel:021-67652958">021-67652958；</a></p>
        <p>· 自购买之时起5分钟内生效；</p>
        <p>· 系统VIP不同于商家会员，VIP可以在本系统全国所有商家享受VIP 特权； </p>
    </div>
    </div></div>
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerVip',
    data: function(){
        return{
            userInfo: {wechat_userlevel: 0}
        }
    },
    ready: function(){
        document.title = 'VIP中心'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getUserInfo, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.userInfo = data.data.object
            if(this.userInfo.wechat_headimgurl.indexOf('http')<0){
                this.userInfo.wechat_headimgurl = this.$store.state.URL + this.userInfo.wechat_headimgurl
            }
            if(!this.userInfo.wechat_user_viptime){
                this.userInfo.wechat_userlevel = 0
            }else if(this.userInfo.wechat_user_viptime == '1'){
                this.userInfo.wechat_userlevel = 7
            }else if( this.userInfo.wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                this.userInfo.wechat_userlevel = 0
            }else{
                this.userInfo.wechat_userlevel = 1
            }
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        pay(type){
            if(type == 2 && this.userInfo.wechat_user_viptime){
                this.$store.state.showTip({type: 'error', content: '您已经开通过体验会员了，不能第二次开通，请去开通永久会员吧' })
                return
            }
            window.location.href = API.wxPayIndex + '?token=' + this.$route.params.token + '&type=' + type
        }
    },
    components: {
        Start
    }
}
    
</script>