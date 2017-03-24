<template>
<div class="page login">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">选择身份</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <img class="login-tip" :src="'images/login/login-tip.png'" />
    <a class="btn-check" :class="{'active': identity==1}" @click="identity = 1">消费者</a>
    <a class="btn-check" :class="{'active': identity==2}" @click="identity = 2" >技师</a>
    <a class="btn-check" :class="{'active': identity==3}" @click="identity = 3">经理</a>
    <a class="btn-check" :class="{'active': identity==4}" @click="identity = 4">老板</a>
    <p class="text">提示：不同身份对应不同功能，一旦选择就不能更改！请据实选择！</p>
    <p class="password" v-if="identity!=0 && identity!=1"><input type="text" v-model="password"><br>请输入本店验证口令</p>
    <p class="number" v-if="identity==2"><input type="text" v-model="number"><br>请输入工号</p>
    <button type="button" class="mui-btn mui-btn-warning mui-btn-block" v-if="btnLogin" @click="login">登录</button>
    <button type="button" class="mui-btn mui-btn-outlined mui-btn-block" v-if="!btnLogin">登录</button>
    <p class="text gay">我们重视您的隐私，不会搜集手机号和位置信息！</p>
    </div></div>
</div>
</template>

<script>
export default{
    name: 'login',
    data: function(){
        return{
            identity: 0,
            btnLogin: false,
            password: '',
            number: ''
        }
    },
    ready: function(){
        document.title = '选择身份'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
    },
    watch: {
        identity: function(){
            this.isLogin()
        },
        password: function(){
            this.isLogin()
        },
        number: function(){
            this.isLogin()
        }
    },
    methods: {
        isLogin(){
            if(this.identity == 1) this.btnLogin = true
            else if(this.identity == 2){
                if(this.password == '' || this.number == '') this.btnLogin = false
                else this.btnLogin = true
            }else{
                if(this.password == '') this.btnLogin = false
                else this.btnLogin = true
            }
        },
        login(){
            let _data = {
                identity: this.identity,
                storeid: this.$route.params.storeid,
                code: this.password,
                num: this.number
            }
            this.$store.state.showTip({type: 'loading', content: '请稍等...' })
            this.$http.post(API.choiceIdentity, _data).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                // 消费者
                if(this.identity == 1){
                    this.$router.go('/consumer/' + this.$route.params.token + '/' + this.$route.params.storeid)
                    return
                }
                if(this.identity == 2){
                    this.$router.go('/tech/' + this.$route.params.token)
                    return
                }
                // 经理
                if(this.identity == 3 || this.identity == 4){
                    this.$router.go('/manage-shop/' + this.$route.params.token)
                    return
                }
            })
        }
    }
}
    
</script>