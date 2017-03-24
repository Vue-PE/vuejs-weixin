<template>
<div class="page manage">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">技师管理</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>

    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item" @click="local('manage-shop')" >店铺信息</a>
        <a class="winslow-control-item" @click="local('manage-project')">项目管理</a>
        <a class="winslow-control-item mui-active" @click="local('manage-tech')">技师管理</a>
    </div>

    <div class="title" @click="showCheck=!showCheck"><i class="ico-down {{!showCheck?'up':''}}"></i>待审核({{wait}})</div>
    <ul class="mui-table-view item-container" v-show="showCheck">
        <li class="mui-table-view-cell mui-media" v-show="showHave" v-for="item in techList" v-if="item.Unread">
            <a v-link="{path: '/manage-tech-info/'+$route.params.token+'/'+item.massagist_id}">
                <img class="mui-media-object mui-pull-left" :src="item.massagist_photo">
                <div class="mui-media-body">
                    工号:{{item.massagist_no}}&nbsp;&nbsp;&nbsp;&nbsp;昵称:{{item.massagist_name}}
                    <p class="mui-ellipsis">申请类别: 项目调整</p>
                </div>
                <i class="status-text">{{item.Unread | format 'yyyy-MM-dd'}}</i>
                <i class="status wait">未审核</i>
            </a>
        </li>
    </ul>

    <div class="title" @click="showHave=!showHave"><i class="ico-down {{!showHave?'up':''}}"></i>技师列表({{techList.length}})</div>
    <ul class="mui-table-view item-container" v-show="showHave">
        <li class="mui-table-view-cell mui-media" v-for="item in techList">
            <a v-link="{path: '/manage-tech-info/'+$route.params.token+'/'+item.massagist_id}">
                <img class="mui-media-object mui-pull-left" :src="item.massagist_photo">
                <div class="mui-media-body center">
                    工号:{{item.massagist_no}}&nbsp;&nbsp;&nbsp;&nbsp;昵称:{{item.massagist_name}}
                </div>
            </a>
        </li>
    </ul>

    </div></div>

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
    name: 'manageTech',
    data: function(){
        return{
            showCheck: true,
            showHave: true,
            techList: [],
            wait: 0
        }
    },
    ready: function(){
        document.title = '技师管理'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getTList, { }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.techList = data.data.list
            for(let i=0; i<this.techList.length; i++){
                if(this.techList[i].Unread) this.wait++
                if(this.techList[i].massagist_photo.indexOf('http')<0){
                    this.techList[i].massagist_photo = this.$store.state.URL + this.techList[i].massagist_photo
                }
            }
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        }
    }
}
    
</script>