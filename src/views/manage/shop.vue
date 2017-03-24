<template>
<div class="page manage">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">店铺信息</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>

    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item mui-active" @click="local('manage-shop')" >店铺信息</a>
        <a class="winslow-control-item" @click="local('manage-project')">项目管理</a>
        <a class="winslow-control-item" @click="local('manage-tech')">技师管理</a>
    </div>

    <div id="slider" class="mui-slider" >
        <div class="mui-slider-group mui-slider-loop">
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + massagistInfo.imgs[massagistInfo.imgs.length - 1].image_address ">
                </a>
            </div>

            <div class="mui-slider-item" v-for="item in massagistInfo.imgs">
                <a>
                    <img :src="$store.state.URL + item.image_address">
                </a>
            </div>

            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + massagistInfo.imgs[0].image_address ">
                </a>
            </div>
        </div>
        <div class="mui-slider-indicator">
            <div class="mui-indicator {{$index == 0 ? 'mui-active' : ''}}" v-for="item in massagistInfo.imgs"></div>
        </div>
    </div>

    <div class="winslow-container">
        <h1>{{massagistInfo.info.store_name}}</h1>
        <p><i class="iconfont">&#xe603;</i>{{massagistInfo.info.store_address}}</p>
        <p><a href="tel:{{massagistInfo.info.store_tel}}"><i class="iconfont">&#xe608;</i>{{massagistInfo.info.store_tel}}</a></p>
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
    name: 'manageShop',
    data: function(){
        return{
            massagistInfo: {
                imgs: [],
                info: {}
            }
        }
    },
    ready: function(){
        document.title = '店铺信息'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        mui("#slider").slider()
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getStoreContents, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.massagistInfo = data.data.list
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        }
    }
}
    
</script>