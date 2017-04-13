<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">会员中心</h1>
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

    <div class="vip-wrap" v-if="memberInfo" style="font-size: 14px;text-align: left;color: #666;padding: 15px;">
        会员账号：{{memberInfo.member_num}} <br>
        会员等级：{{memberInfo.member_level}} <br>
        联系方式：{{memberInfo.member_tel}} <br>
        账户余额：{{memberInfo.member_balance}} <br>
        会员积分：{{memberInfo.member_integral}} 
    </div>
    <button v-if="!memberInfo" type="button" class="mui-btn mui-btn-warning mui-btn-block" @click="bindVip" style="width: 90%;margin: 10px 5%;">绑定会员</button>
    
    <div class="vip-foot">
        <p>尊敬的会员：</p>
        <p>如果您发现账户余额与会员积分有误，请及时联系商户说明情况！祝您消费愉快！</p>
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
            userInfo: {wechat_userlevel: 0},
            memberInfo: {}
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
        });
        this.$http.post(API.user_get_member_info, {
            sid: this.$route.params.storeid
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.memberInfo = (data.data.object);
        });
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        bindVip(){
            let btnArray = ['取消', '确定']
            let me = this
            mui.prompt('', me.userInfo.wechat_member, '请输入会员账号', btnArray, function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: '绑定中...' })
                    me.$http.post(API.Binding_member, {
                        sid: me.$route.params.storeid,
                        num: e.value,
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '绑定成功' })
                        setTimeout(()=>{me.resload()}, 2000)
                    })
                }
            });
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