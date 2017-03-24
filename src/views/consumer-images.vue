<template>
<div class="page consumer" style="background-color: #444;">
    <header id="header" class="mui-bar mui-bar-nav bar-images">
        <h1 class="mui-title">个人封面</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>

    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <ul class="images-container">
        <li v-for="item in massagistInfo.massagist_image">
            <img :src=" $store.state.URL + item.img_url ">
            <a @click="del(item.img_id)">删除</a><a @click="changePic(item.img_id)">更换</a>
        </li>
        <li class="notitle" v-if="3-massagistInfo.massagist_image.length>2" @click="add"><img :src="'images/add.jpg'"></li>
        <li class="notitle" v-if="3-massagistInfo.massagist_image.length>1" @click="add"><img :src="'images/add.jpg'"></li>
        <li class="notitle" v-if="3-massagistInfo.massagist_image.length>0" @click="add"><img :src="'images/add.jpg'"></li>
    </ul>
    </div></div>
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
export default{
    name: 'consumerImages',
    data: function(){
        return{
            showCrop: false,
            cropImg: '',
            massagistInfo: {
                massagist_image: []
            },
            changeId: 0
        }
    },
    ready: function(){
        document.title = '个人封面'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getMassagistInfo, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.massagistInfo = data.data.object
            if(this.massagistInfo.massagist_photo.indexOf('http')<0){
                this.massagistInfo.massagist_photo = this.$store.state.URL + this.massagistInfo.massagist_photo
            }
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        del: function(id){
            let me = this
            if(me.massagistInfo.massagist_image.length<=1){
                me.$store.state.showTip({type: 'error', content: '至少保留一张封面图片' })
                return
            }
            mui.confirm('确定删除这张封面吗？', '提醒', ['取消', '确定'], function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: '删除中...' })
                    me.$http.post(API.deleteTechnicianImg, {
                        img_id: id
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '删除成功' })
                        location.reload()
                    })
                }
            })
        },
        changePic: function(id){
            this.changeId = parseInt(id)
            this.file()
        },
        add: function(){
            this.changeId = 0
            this.file()
        },
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
                            $(".cropper").cropper({aspectRatio: 1 / 0.466})
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
                    img_id: this.changeId,
                    base64: picURL
                }).then( (data) => {
                    if(data.data.errorInfo) return
                    this.$store.state.hideTip()
                    this.$store.state.locationReload()
                })
            }, 100)
        }
    }
}
    
</script>