<template>
<div class="page manage">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">技师管理</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: px;">
    <div class="mui-scroll">
    <div class="my-info-container no-border">
        <div class="my-info">
            <img :src="techInfo.massagist_photo" class="head">
            <div class="info mui-ellipsis">
                <h1>工号：{{techInfo.massagist_no}}</h1>
                <h2>年龄：{{techInfo.massagist_birth || '未设置' | years}}</h2>
                <h3><start :value='parseInt(techInfo.massagist_store)'></start> {{parseInt(techInfo.massagist_store)}}分</h3>
            </div>
            <div class="info">
                <h1>昵称：{{techInfo.massagist_name}}</h1>
                <h2>籍贯：{{techInfo.c_name}}</h2>
            </div>
        </div>
    </div>

    <div class="title" @click="showChange=!showChange"><i class="ico-down {{!showChange?'up':''}}"></i>项目调整申请({{getHandleProject.length}})</div>
        <ul class="mui-table-view item-container" v-show="showChange">
            <li class="mui-table-view-cell mui-media" v-for="item in getHandleProject">
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body">
                        {{item.item_name}}
                        <p class="mui-ellipsis">申请时间：{{(item.apply_time || '前台添加') | format 'yyyy-MM-dd hh:mm'}}</p>
                    </div>
                    <i class="status-text">申请{{item.handle == 'add' ? '添加' : '移除'}}</i>
                    <i class="status agree" v-if="item.apply_state == 1">已同意</i>
                    <i class="status reject" v-if="item.apply_state == 2">已拒绝</i>
                    <i class="status true" v-if="item.apply_state == 0" @click="operate(item.item_id, 'agree')">同意</i>
                    <i class="status false" v-if="item.apply_state == 0" @click="operate(item.item_id, 'refuse')">退回</i>
                </a>
            </li>
            <div class="no-data" v-if="getHandleProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>

        <div class="title" @click="showHave=!showHave"><i class="ico-down {{!showHave?'up':''}}"></i>已添加项目({{getHaveProject.length}})</div>
        <ul class="mui-table-view item-container" v-show="showHave">
            <li class="mui-table-view-cell mui-media" v-for="item in getHaveProject" >
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body center">
                        {{item.item_name}}
                    </div>
                    <i class="status center remove" v-if="item.apply_state!=0" @click="operate(item.item_id, 'delete')">移除</i>
                    <i class="status center fail" v-if="item.apply_state==0">已申请</i>
                </a>
            </li>
            <div class="no-data" v-if="getHaveProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>

        <div class="title" @click="showProject=!showProject"><i class="ico-down {{!showProject?'up':''}}"></i>可申请项目({{getAddProject.length}})</div>
        <ul class="mui-table-view item-container" v-show="showProject">
            <li class="mui-table-view-cell mui-media" v-for="item in getAddProject" >
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body center">
                        {{item.item_name}}
                    </div>
                    <i class="status center add" v-if="item.apply_state!=0" @click="operate(item.item_id, 'add')">添加</i>
                    <i class="status center fail" v-if="item.apply_state==0">已申请</i>
                </a>
            </li>
            <div class="no-data" v-if="getAddProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>

        </div></div>
    
</div>
</template>

<script>
import Start from '../../components/start.vue'
export default{
    name: 'manageTechInfo',
    data: function(){
        return{
            getHaveProject: [],
            getHandleProject: [],
            getAddProject: [],
            showChange: true,
            showHave: true,
            showProject: true,
            techInfo: {}
        }
    },
    ready: function(){
        document.title = '技师管理'
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$http.post(API.getMassagistInfo, {tid: this.$route.params.id}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.techInfo = data.data.object
            if(this.techInfo.massagist_photo.indexOf('http')<0){
                this.techInfo.massagist_photo = this.$store.state.URL + this.techInfo.massagist_photo
            }
        })
        this.getProject()
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        getProject(){
            // 获取已有项目
            this.$http.post(API.getHaveProject, {tid: this.$route.params.id}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getHaveProject = data.data.list
            })
            // 获取已申请项目
            this.$http.post(API.getHandleProject, {tid: this.$route.params.id}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getHandleProject = data.data.list
            })
            // 获取可申请项目
            this.$http.post(API.getAddProject, {tid: this.$route.params.id}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getAddProject = data.data.list
            })
        },
        operate(pid, action){
            let alertText = ''
            let me = this
            if(action == 'add') alertText = '添加'
            if(action == 'delete') alertText = '移除'
            if(action == 'agree') alertText = '同意审核'
            if(action == 'refuse') alertText = '退回'
            mui.confirm('确定'+alertText+'该项目吗？', '提醒', ['取消', '确定'], function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: alertText + '中...' })
                    me.$http.post(API.applyProject, {
                        pid: pid,
                        tid: me.$route.params.id,
                        action: action
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '处理成功' })
                        me.getProject()
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