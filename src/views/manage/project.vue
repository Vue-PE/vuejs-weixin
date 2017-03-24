<template>
<div class="page manage">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">项目管理</h1>
        <a class="mui-icon mui-icon-gear mui-pull-right" style="color: #fff;" @click="showSet=!showSet"></a>
    </header>
    
    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item" @click="local('manage-shop')" >店铺信息</a>
        <a class="winslow-control-item mui-active" @click="local('manage-project')">项目管理</a>
        <a class="winslow-control-item" @click="local('manage-tech')">技师管理</a>
    </div>

    <div class="set" v-show="showSet" transition>
        <h1>项目审核</h1>
        <p>
            开启项目审核后，店铺每发布一个项目都需经理对该项目进行审核后才可发布；<br>
            关闭项目审核后，店铺每发布一个项目无需经理审核，可直接发布。<br>
            请根据店铺实际需求设置该项功能使用与否。</p>
        <a class="{{storeCheck==1 ? 'on' : 'off'}}" @click="proSwitch('on')">开启</a>
        <a class="{{storeCheck==0 ? 'on' : 'off'}}" @click="proSwitch('off')">关闭</a>
    </div>
    <div class="mask-bg" v-show="showSet" @click="showSet=!showSet"></div>

    <ul class="mui-table-view item-container project">
        <li class="mui-table-view-cell mui-media" v-for="item in projectList">
            <a href="javascript:;" v-link="{path: '/manage-project-info/' + $route.params.token + '/' + item.item_id + '/' + storeCheck}">
                <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                <div class="mui-media-body">
                    {{item.item_name}}
                    <p class="mui-ellipsis">套餐详情:{{item.item_intro}}</p>
                    <p><em class="price">￥{{item.item_vipprice}}</em> <em class="disguise">非会员：￥{{item.item_price}}</em></p>
                </div>
            </a>
            <div class="prostatus" v-if="item.item_status == 1 || item.item_status == 2">
                {{item.item_date_verify | format 'yyyy-MM-dd'}}
                <a class="btn true" v-if="storeCheck==1">已审核</a>
            </div>
            <div class="prostatus" v-if="item.item_status == 3">
                {{item.item_date_sub | format 'yyyy-MM-dd'}}
                <a class="btn" v-if="storeCheck==1">未审核</a>
            </div>
            <div class="prostatus" v-if="item.item_status == 4">
                {{item.item_date_verify | format 'yyyy-MM-dd'}}
                <a class="btn false" v-if="storeCheck==1">已退回</a>
            </div>
        </li>
        
    </ul>
    <div class="no-data" v-if="projectList.length<=0">
        <h6>还没有项目~</h6>
    </div>
    </div>
    </div>

    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item mui-active">
            <span class="iconfont">&#xe67d;</span>
            <span class="mui-tab-label">管理</span>
        </a>
        <a class="winslow-tab-item" @click="local('manage-shop-chart')">
            <span class="iconfont">&#xe671;</span>
            <span class="mui-tab-label">报表</span>
        </a>
        <a class="winslow-tab-item" @click="local('manage-shop-comment')">
            <span class="iconfont">&#xe706;</span>
            <span class="mui-tab-label">店铺评价</span>
        </a>
    </nav>
    
    
</div>
</template>

<script>
export default{
    name: 'manageProject',
    data: function(){
        return{
            showSet: false,
            projectList: [],
            storeCheck: 0
        }
    },
    ready: function(){
        document.title = '项目管理'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getProjectList, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.projectList = data.data.list
            this.storeCheck = data.data.object
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        proSwitch(val){
            let action = ''
            if(val=='on'){
                if(this.storeCheck == 1){
                    this.$store.state.showTip({type: 'error', content: '您已经是开启状态了' })
                    return
                }
                action = '开启'
            }else{
                if(this.storeCheck == 0){
                    this.$store.state.showTip({type: 'error', content: '您已经是关闭状态了' })
                    return
                }
                action = '关闭'
            }
            this.$store.state.showTip({type: 'loading', content: action + '中...' })
            this.$http.post(API.projectSwitch, {
                action: val
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.$store.state.showTip({type: 'success', content: action + '成功!' })
                this.showSet = false
                location.reload()
            })
        }
    }
}
    
</script>