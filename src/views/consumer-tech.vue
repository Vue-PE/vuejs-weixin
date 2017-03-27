<template>
<div class="page consumer" style="padding-bottom: 10px;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">技师详情</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div id="slider" class="mui-slider" >
        <div class="mui-slider-group mui-slider-loop">
            <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + techInfo.massagist_image[techInfo.massagist_image.length - 1].img_url ">
                </a>
            </div>

            <div class="mui-slider-item" v-for="item in techInfo.massagist_image">
                <a>
                    <img :src=" $store.state.URL + item.img_url ">
                </a>
            </div>
            <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a>
                    <img :src=" $store.state.URL + techInfo.massagist_image[0].img_url ">
                </a>
            </div>
        </div>
        <div class="mui-slider-indicator">
            <div class="mui-indicator {{$index == 0 ? 'mui-active' : ''}}" v-for="item in techInfo.massagist_image"></div>
        </div>
    </div>

    <div class="my-info-container">
        <div class="my-info">
            <img :src="techInfo.massagist_photo" class="head">
            <div class="info mui-ellipsis">
                <h1>工号：{{techInfo.massagist_no}}</h1>
                <h2>年龄：{{techInfo.massagist_birth || '未设置' | years}}</h2>
                <h3>
                    <start :value='techInfo.massagist_store'></start>{{techInfo.massagist_store}}分
                </h3>
            </div>
            <div class="info">
                <h1>昵称：{{techInfo.massagist_name}}</h1>
                <h2>籍贯：{{techInfo.c_name}}</h2>
                <h3><a class="pj" v-link="{path: '/consumer-tech-comment/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + techInfo.massagist_id}">评价 ({{techInfo.comment_total}})</a></h3>
            </div>
        </div>
    </div>

    <ul class="mui-table-view item-container">
        <li class="mui-table-view-cell mui-media" v-for="item in proList">
            <a v-link="{path: '/consumer-pro/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.item_id}">
                <div class="mui-media-object mui-pull-left image-size" style="background-image: url({{$store.state.URL + item.item_image}});"></div>
                <!-- <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image"> -->
                <div class="mui-media-body">
                    {{item.item_name}}
                    <p class="mui-ellipsis">套餐详情：{{item.item_intro}}</p>
                    <p>项目时长：{{item.item_time}}分钟</p>
                    <p><em class="price">￥{{item.item_vipprice}}</em> <em class="disguise">非会员：￥{{item.item_price}}</em></p>
                </div>
            </a>
            <a class="xuanze" v-if="techInfo.massagist_status == '2'" v-link="{path: '/consumer-order-sub/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.item_id + '/' + this.$route.params.id}">选择</a>
            <a class="xuanze sleep" v-if="techInfo.massagist_status != '2'" @click="$store.state.showTip({type: 'error', content: '选择的技师休息或正在工作中' })">选择</a>
        </li>
        <div class="no-data" v-if="techList.proList<=0">
            <h1>技师还没有相关项目</h1>
        </div>
    </ul>
    </div></div>
    <!-- <div class="footer">
        <a>生成订单</a>
    </div> -->
    
    
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerTech',
    data: function(){
        return{
            proList: [],
            techInfo: {},
        }
    },
    ready: function(){
        document.title = '技师详情'
        mui("#slider").slider()
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.resload()
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        resload(){
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getMassagistInfo, {
                store_id: this.$route.params.storeid,
                tid: this.$route.params.id
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.proList = data.data.list
                this.techInfo = data.data.object
                this.techInfo.massagist_store = parseInt(this.techInfo.massagist_store)
                if(this.techInfo.massagist_photo.indexOf('http')<0){
                    this.techInfo.massagist_photo = this.$store.state.URL + this.techInfo.massagist_photo
                }
            })
        }
    },
    components: {
        Start
    }
}
    
</script>