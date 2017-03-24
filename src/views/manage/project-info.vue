<template>
<div class="page manage" style="background: #fff;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">项目详情</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>

    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="banner-main" style="background-image: url({{$store.state.URL + projectInfo.item_image}})"></div>
    
    <div class="shop-title-container" style="padding-right: 95px;">
        <h1>{{projectInfo.item_name}}</h1>
        <h5>套餐详情:{{projectInfo.item_intro}}</h5>
        <h4>申请时间：{{projectInfo.item_date_sub || '' | format 'yyyy-MM-dd hh:mm:ss'}}</h4>
        <div class="price">
            <em>￥{{projectInfo.item_vipprice}}</em>
            <span>非会员:￥{{projectInfo.item_price}}</span>
        </div>
    </div>
    
    <div class="pro-btns" v-if="(projectInfo.item_status == 1 || projectInfo.item_status == 2) && $route.params.switch==1">
        <a class="true-ok">已通过</a>
    </div>
    <div class="pro-btns" v-if="projectInfo.item_status == 3 && $route.params.switch==1">
        <a class="true" @click="review('pass')">通过</a>
        <a class="false" @click="review('back')">退回</a>
    </div>
    <div class="pro-btns" v-if="projectInfo.item_status == 4 && $route.params.switch==1">
        <a class="false-ok">已退回</a>
    </div>
    </div>
    </div>
</div>
</template>

<script>
export default{
    name: 'manageProjectInfo',
    data: function(){
        return{
            projectInfo: {}
        }
    },
    ready: function(){
        document.title = '项目详情'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        // mui("#slider").slider()
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getProjectInfo, {
            pid: this.$route.params.id
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.projectInfo = data.data.list
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        review(action){
            let text = ''
            let me = this
            let aid
            if(action == 'pass'){
                text = '通过审核'
                aid = 2
            }else{
                text = '退回审核'
                aid = 4
            }
            mui.confirm('确定'+text+'吗？', '提醒', ['取消', '确定'], function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: '处理中...' })
                    me.$http.post(API.handleProject, {
                        pid: me.$route.params.id,
                        action: aid
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: text+'成功' })
                        location.reload()
                    })
                }
            })
        }
    }
}
    
</script>