<template>
<div class="page consumer">

    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">店铺首页</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>

    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
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

    <div class="shop-title-container">
        <h1>{{massagistInfo.info.store_name}}</h1>
        <h5>
            <span class="start"><start :value='massagistInfo.score'></start>{{parseInt(massagistInfo.score)}}分</span>
            <a class="pj" v-link="{path: '/consumer-shop-comment/' + this.$route.params.token + '/' + this.$route.params.storeid}">店铺评价 ({{massagistInfo.comment_total}}) </a>
        </h5>
    </div>
    <div class="position-container mui-ellipsis">
        <i class="iconfont">&#xe603;</i>{{massagistInfo.info.store_address}}
        <a class="iconfont tel" href="tel:{{massagistInfo.info.store_tel}}">&#xe604;</a>
    </div>

    <ul class="mui-table-view item-container">
        <li class="mui-table-view-cell mui-media" v-for="item in projectList">
            <a v-link="{path: '/consumer-pro/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.item_id}">
                <div class="mui-media-object mui-pull-left image-size" style="background-image: url({{$store.state.URL + item.item_image}});"></div>
                <!-- <img class="" :src="$store.state.URL + item.item_image"> -->
                <div class="mui-media-body">
                    {{item.item_name}}
                    <p class="mui-ellipsis">套餐详情：{{item.item_intro}}</p>
                    <p>项目时长：{{item.item_time}}分钟</p>
                    <p><em class="price">￥{{item.item_vipprice}}</em> <em class="disguise">非会员：￥{{item.item_price}}</em></p>
                </div>
            </a>
            <a class="xuanze" v-link="{path: '/consumer-pro/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.item_id}">选择</a>
        </li>
        <div class="no-data" v-if="projectList.length<=0">
            <h1>店铺还没有相关项目</h1>
        </div>
    </ul>
    </div>
    </div>

    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item mui-active">
            <span class="iconfont">&#xe67d;</span>
            <span class="mui-tab-label">首页</span>
        </a>
        <a class="winslow-tab-item" v-link="{path: '/consumer-order-list/' + this.$route.params.token + '/' + this.$route.params.storeid}">
            <span class="iconfont">&#xe61e;</span>
            <span class="mui-tab-label">我的</span>
        </a>
    </nav>
    

</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumer',
    data: function(){
        return{
            projectList: [],
            massagistInfo: {
                imgs: [],
                info: {}
            }
        }
    },
    ready: function(){
        document.title = '店铺首页'
        mui("#slider").slider()
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getStoreContents, {store_id: this.$route.params.storeid}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.massagistInfo = data.data.list
        })
        this.$http.post(API.getOnlineProject, {sid: this.$route.params.storeid}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.projectList = data.data.object
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        }
    },
    components: {
        Start
    }
}
    
</script>