<template>
<div class="page consumer">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">我的资料</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>
    
    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item" v-link="{path: '/consumer-order-list/' + this.$route.params.token + '/' + this.$route.params.storeid}">我的订单</a>
        <a class="winslow-control-item mui-active">我的资料</a>
    </div>

    <ul class="mui-table-view user-info fade-in-left">
        <li class="mui-table-view-cell" @click="file" id="fileStart">
            <a class="mui-navigate-right" style="line-height: 50px;">
                头像
                <img :src="userInfo.wechat_headimgurl" class="head">
            </a>
        </li>
        <li class="mui-table-view-cell" @click="updateName">
            昵称
            <span class="mui-pull-right">{{userInfo.wechat_nickname}}</span>
        </li>
        <li class="mui-table-view-cell" v-link="{path: '/consumer-vip/' + this.$route.params.token + '/' + this.$route.params.storeid}">
            VIP等级
            <span class="mui-pull-right"><i class="lv lv{{userInfo.wechat_userlevel}}"></i></span>
        </li>
        <li class="mui-table-view-cell" @click="sex">
            性别
            <span class="mui-pull-right">{{userInfo.wechat_sex | sex}}</span>
        </li>
        <li class="mui-table-view-cell" v-link="{path: '/consumer-member/' + this.$route.params.token + '/' + this.$route.params.storeid}">
            会员信息
            <span class="mui-pull-right">{{userInfo.wechat_member || '没有绑定'}}</span>
        </li>
    </ul>
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
    <input id="fileCrop" style="opacity: 0;" type="file" accept="image/*" v-on:change="change">
    <div class="crop-container" v-show="showCrop">
        <div class="wrap">
            <img class="cropper" :src="cropImg">
        </div>
        <div class="btn">
            <div><button type="button" class="mui-btn mui-btn-block" @click="$store.state.locationReload()">取消</button></div>
            <div><button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="saveCrop">保存</button></div>
        </div>
    </div> 
    
</div>
</template>

<script>
import EXIF from '../vendor/exif.js'
import Start from '../components/start.vue'
import '../vendor/mui.picker.all'
import '../vendor/mui.poppicker'
export default{
    name: 'consumerMy',
    data: function(){
        return{
            showCrop: false,
            cropImg: '',
            userInfo:{}
        }
    },
    ready: function(){
        document.title = '我的资料'
        this.resload()
        mui('.mui-scroll-wrapper').scroll({bounce: false})
    },
    methods: {
        file(){
            let u = navigator.userAgent
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

            if(isAndroid) mui('#fileCrop')[0].click()
            else if(isiOS) {
                mui('#fileCrop')[0].click()
                mui('#fileCrop')[0].click()
            }
        },
        change(e){
            this.$store.state.showTip({type: 'loading', content: '努力加载图像中...' })
            this.showCrop = true
            let orientation = null
            let FILE = e.target.files[0]

            EXIF.getData(FILE, function(){
                let obj = Object.assign({}, EXIF.getAllTags(this))
                orientation = obj.Orientation
            })

            let reader = new FileReader()
            let self = this

            reader.onload = function(e) {
                self.$store.state.__getImgData(e.target.result, orientation, function(data){
                    let pic = new Image()
                    pic.src = data
                    pic.onload= function() {
                        self.cropImg = data
                        setTimeout(()=>{
                            $(".cropper").cropper({aspectRatio: 1 / 1})
                            self.$store.state.hideTip()
                        }, 100)
                    }
                })
            }
            reader.readAsDataURL(FILE)
        },
        saveCrop(){
            this.$store.state.showTip({type: 'loading', content: '上传中...' })
            setTimeout(()=>{
                let dataURL = $(".cropper").cropper("getDataURL")
                let picURL = dataURL.replace(/^.*?,/, '')
                this.$http.post(API.uploadImg, {
                    type: 'head',
                    base64: picURL
                }).then( (data) => {
                    if(data.data.errorInfo) return
                    this.$store.state.hideTip()
                    this.$store.state.locationReload()
                })
            }, 100)
        },
        updateName(){
            let btnArray = ['取消', '确定']
            let me = this
            mui.prompt('', me.userInfo.wechat_nickname, '请输入您新的昵称', btnArray, function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: '修改中...' })
                    me.$http.post(API.updateUserInfo, {
                        name: e.value
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '修改成功' })
                        setTimeout(()=>{me.resload()}, 2000)
                    })
                }
            });
        },
        resload(){
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
        sex(){
            let sexPicker = new mui.PopPicker();
            let me = this
            sexPicker.setData([{ value: 1, text: '男'}, { value: 2, text: '女'}])
            sexPicker.pickers[0].setSelectedValue(me.userInfo.wechat_sex)
            sexPicker.show(function(items) {
                me.$store.state.showTip({type: 'loading', content: '修改中...' })
                me.$http.post(API.updateUserInfo, {
                    sex: items[0].value
                }).then( (data) => {
                    if(data.data.errorInfo) return
                    me.$store.state.hideTip()
                    me.$store.state.showTip({type: 'success', content: '修改成功' })
                    setTimeout(()=>{me.resload()}, 2000)
                })
            })
        },
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        }
    },
    components: {
        Start,
        // VueCoreImageUpload
    }
}
    
</script>