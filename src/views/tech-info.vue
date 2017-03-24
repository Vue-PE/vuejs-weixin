<template>
<div class="page tech" style="padding-top: 0px; background: #f9f9f9;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">个人资料</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="top: 44px;">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item " @click="local('tech-my')">工单</a>
        <a class="winslow-control-item " @click="local('tech-comment')">评价</a>
        <a class="winslow-control-item mui-active">资料</a>
    </div>

    <div id="slider" class="mui-slider" >
        <a class="edit-bg" v-link="{ path: '/consumer-images/'+$route.params.token }"><i class="iconfont">&#xe670;</i> 编辑</a>
        <div class="mui-slider-group mui-slider-loop">
            <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + massagistInfo.massagist_image[massagistInfo.massagist_image.length - 1].img_url ">
                </a>
            </div>

            <div class="mui-slider-item" v-for="item in massagistInfo.massagist_image">
                <a>
                    <img :src=" $store.state.URL + item.img_url ">
                </a>
            </div>
            <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + massagistInfo.massagist_image[0].img_url ">
                </a>
            </div>

        </div>
        <div class="mui-slider-indicator">
            <div class="mui-indicator {{$index == 0 ? 'mui-active' : ''}}" v-for="item in massagistInfo.massagist_image"></div>
        </div>
    </div>

    <ul class="mui-table-view user-info fade-in-left" id="head">
        <li class="mui-table-view-cell">
            <a class="mui-navigate-right" style="line-height: 50px;" v-link="{path: '/tech-my-head/' + $route.params.token}">
                头像
                <img :src="massagistInfo.massagist_photo" class="head">
            </a>
        </li>
        <li class="mui-table-view-cell" @click="updateName">
            昵称
            <span class="mui-pull-right">{{massagistInfo.massagist_name}}</span>
        </li>
        <li class="mui-table-view-cell">
            工号
            <span class="mui-pull-right">{{massagistInfo.massagist_no}}</span>
        </li>
        <li class="mui-table-view-cell" @click="showDate">
            出生日期
            <span class="mui-pull-right">{{massagistInfo.massagist_birth || '未设置' | format 'yyyy-MM-dd'}}</span>
        </li>
        <li class="mui-table-view-cell" @click="address">
            籍贯
            <span class="mui-pull-right">{{massagistInfo.c_name}}</span>
        </li>
        <li class="mui-table-view-cell" @click="sex">
            性别
            <span class="mui-pull-right">{{massagistInfo.massagist_sex | sex}}</span>
        </li>
    </ul>

    <ul class="mui-table-view user-info fade-in-left">
        <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
                我的赏金
                <span class="mui-pull-right navigate">￥0</span>
            </a>
        </li>
    </ul>

    <p class="explain">
        说明：<br>
        · 请使用本人真实照片，虚假、色情、违禁照片会直接封号！<br>
        · 使用真实照片，可以增加点单量，并获得消费者打赏和系统奖励（功能近期上线）！<br>
        · 您的照片只有VIP才能浏览，其他人无法看到，敬请放心！
    </p>

    </div></div>

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
import '../vendor/mui.picker.all'
import '../vendor/mui.poppicker'
export default{
    name: 'techInfo',
    data: function(){
        return{
            massagistInfo: {
                massagist_image: []
            },
            province: []
        }
    },
    ready: function(){
        document.title = '个人资料'
        mui("#slider").slider()   
        mui('.mui-scroll-wrapper').scroll({bounce: false})     
        this.resload()
    },
    methods: {
        local(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        updateName(){
            let btnArray = ['取消', '确定']
            let me = this
            mui.prompt('', me.massagistInfo.massagist_name, '请输入您新的昵称', btnArray, function(e) {
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
            })
        },
        resload(){
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
        showDate(){
            let me = this
            let _data = {
                type: "date",
                beginYear: 1900,
                endDate: new Date()
            }
            if(me.massagistInfo.massagist_birth){
                _data.value = new Date(me.massagistInfo.massagist_birth*1000).format('yyyy-MM-dd')
            }
            let picker = new mui.DtPicker(_data)
            picker.show(function(rs) {
                me.$store.state.showTip({type: 'loading', content: '修改中...' })
                me.$http.post(API.updateUserInfo, {
                    birthday: rs.text
                }).then( (data) => {
                    if(data.data.errorInfo) return
                    me.$store.state.hideTip()
                    me.$store.state.showTip({type: 'success', content: '修改成功' })
                    setTimeout(()=>{me.resload()}, 2000)
                })
                picker.dispose()
            })
        },
        address(){
            let me = this
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getProvince, {}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.province = data.data.list
                let addressPicker = new mui.PopPicker()
                addressPicker.setData(me.province)
                if(me.massagistInfo.massagist_native) addressPicker.pickers[0].setSelectedValue(me.massagistInfo.massagist_native)
                addressPicker.show(function(items) {
                    me.$store.state.showTip({type: 'loading', content: '修改中...' })
                    me.$http.post(API.updateUserInfo, {
                        place: items[0].value
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '修改成功' })
                        setTimeout(()=>{me.resload()}, 2000)
                    })
                })
            })
        },
        sex(){
            let sexPicker = new mui.PopPicker();
            let me = this
            sexPicker.setData([{ value: 1, text: '男'}, { value: 2, text: '女'}])
            sexPicker.pickers[0].setSelectedValue(me.massagistInfo.massagist_sex)
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
        }
    }
}
    
</script>