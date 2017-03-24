<template>
<div class="page consumer" style="background: #fff; padding-bottom: 10px;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">项目详情</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="banner-main" style="background-image: url({{$store.state.URL + proInfo.item_image}})"></div>

    <div class="shop-title-container" style="padding-right: 95px;">
        <h1>{{proInfo.item_name}}</h1>
        <h5>套餐详情：{{proInfo.item_intro}}</h5>
        <h4>项目时长：{{proInfo.item_time}}分钟</h4>
        <div class="price">
            <em>￥{{proInfo.item_vipprice}}</em>
            <span>非会员:￥{{proInfo.item_price}}</span>
        </div>
    </div>
    <div class="title">为保护技师隐私，真实图片仅VIP可见 <a v-link="{path: '/consumer-vip/' + this.$route.params.token + '/' + this.$route.params.storeid}" class="no">加入VIP</a></div>
    <ul class="mui-table-view item-container">
        <li class="mui-table-view-cell mui-media jishi" v-for="item in techList">
            <a v-link="{path: '/consumer-tech/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + item.massagist_id}">
                <img class="mui-media-object mui-pull-left" :src="item.massagist_photo">
                <div class="mui-media-body">
                    <div class="info mui-ellipsis">
                        <h1>工号：{{item.massagist_no}}</h1>
                        <h2>年龄：{{item.massagist_birth || '未设置' | years}}</h2>
                        <h3><start :value='parseInt(item.massagist_store)'></start> {{parseInt(item.massagist_store)}}分</h3>
                    </div>
                    <div class="info">
                        <h1>昵称：{{item.massagist_name}}</h1>
                        <h2>籍贯：{{item.c_name}}</h2>
                    </div>
                </div>
            </a>
            <a class="xuanze" v-if="item.massagist_status=='2'" v-link="{path: '/consumer-order-sub/' + this.$route.params.token + '/' + this.$route.params.storeid + '/' + this.$route.params.id + '/' + item.massagist_id}">选择</a>
            <a class="xuanze sleep" v-if="item.massagist_status!='2'" @click="$store.state.showTip({type: 'error', content: '选择的技师休息或正在工作中' })">选择</a>
        </li>
        <div class="no-data" v-if="techList.length<=0">
            <h1>项目还没有相关技师</h1>
        </div>
    </ul>

    <!-- <div class="footer">
        <a>生成订单</a>
    </div> -->
    </div></div>
    
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerPro',
    data: function(){
        return{
            techList: [],
            proInfo: {},
        }
    },
    ready: function(){
        document.title = '项目详情'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.resload()
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        resload(){
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getProjectTechnician, {
                sid: this.$route.params.storeid,
                pid: this.$route.params.id
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip();
                this.techList = (data.data.list);
                this.proInfo = data.data.object
                for(let i=0; i<this.techList.length; i++){
                    this.techList[i].massagist_store = parseInt(this.techList[i].massagist_store)
                    if(this.techList[i].massagist_photo.indexOf('http')<0){
                        this.techList[i].massagist_photo = this.$store.state.URL + this.techList[i].massagist_photo
                    }
                }
            })
        }
    },
    components: {
        Start
    }
}
    
</script>