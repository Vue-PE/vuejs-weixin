<template>
<div class="page tech" style="padding-top: 0px;">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">我的评价</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="top: 44px;">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item " @click="local('tech-my')">工单</a>
        <a class="winslow-control-item mui-active" @click="local('tech-comment')">评价</a>
        <a class="winslow-control-item" @click="local('tech-info')">资料</a>
    </div>

    <div class="my-info-container fade-in-left">
        <div class="my-info">
            <img :src="massagistInfo.massagist_photo" class="head">
            <div class="info mui-ellipsis">
                <h1>工号：{{massagistInfo.massagist_no}}</h1>
                <h2>年龄：{{massagistInfo.massagist_birth || '未设置' | years}}</h2>
                <h3><start :value='parseInt(massagistInfo.massagist_store)'></start> {{parseInt(massagistInfo.massagist_store)}}分</h3>
            </div>
            <div class="info">
                <h1>昵称：{{massagistInfo.massagist_name}}</h1>
                <h2>籍贯：{{massagistInfo.c_name}}</h2>
            </div>
        </div>
    </div>
    
    <div id="item1mobile" class="mui-control-content fade-in-left mui-active">
        <div id="sliderSegmentedControl" class="mui-segmented-control title comment sfiowhio">
            <a class="mui-control-item mui-active" href="#item1">全部({{info ? info.all : '0'}})</a>
            <a class="mui-control-item" href="#item2">好评({{info ? info.good : '0'}})</a>
            <a class="mui-control-item" href="#item3">中评({{info ? info.middle : '0'}})</a>
            <a class="mui-control-item" href="#item4">差评({{info ? info.bad : '0'}})</a>
        </div>
        <div id="item1" class="mui-control-content fade-in-left mui-active">
            <ul class="comment-item">
                <li v-for="item in all.list">
                    <div class="item">
                        <img :src="item.wechat_headimgurl" class="head">
                        {{item.wechat_nickname}} <i class="lv lv{{item.wechat_userlevel}}"></i><br>
                        <div class="starts-container"><start :value="parseInt(item.comment_score_store)"><start></div>
                        <h6>
                            {{item.comment_time | format 'yyyy-MM-dd'}}
                        </h6>
                        <div class="tag">
                            <a v-for="tag in item.comment_store_label" v-if="tag!=''">{{$store.state.storeLabel[parseInt(tag)-1]}}</a>
                        </div>
                        <p>{{item.comment}}</p>
                        <small v-for="reply in item.reply">
                            <span>{{reply.comment_userid ? '用户回复' : '店铺回复'}}: </span>
                            {{reply.comment}}
                            <br>
                        </small>
                    </div>
                </li>
                <div class="no-data" v-if="all.list.length<=0">
                    <h1>没有相关评论</h1>
                </div>
                <a class="btn-more" v-if="all.btn" @click="getAll">查看更多</a>
            </ul>
        </div>

        <div id="item2" class="mui-control-content fade-in-left">
            <ul class="comment-item">
                <li v-for="item in good.list" v-if="item.comment_level == '1'">
                    <div class="item">
                        <img :src="item.wechat_headimgurl" class="head">
                        {{item.wechat_nickname}} <i class="lv lv{{item.wechat_userlevel}}"></i><br>
                        <div class="starts-container"><start :value="parseInt(item.comment_score_store)"><start></div>
                        <h6>{{item.comment_time | format 'yyyy-MM-dd'}}</h6>
                        <div class="tag">
                            <a v-for="tag in item.comment_store_label" v-if="tag!=''">{{$store.state.storeLabel[parseInt(tag)-1]}}</a>
                        </div>
                        <p>{{item.comment}}</p>
                        <small v-for="reply in item.reply">
                            <span>{{reply.comment_userid ? '用户回复' : '店铺回复'}}: </span>
                            {{reply.comment}}
                            <br>
                        </small>
                    </div>
                </li>
                <div class="no-data" v-if="good.list.length<=0">
                    <h1>没有相关评论</h1>
                </div>
                <a class="btn-more" v-if="good.btn" @click="getGood">查看更多</a>
            </ul>
        </div>

        <div id="item3" class="mui-control-content fade-in-left">
            <ul class="comment-item">
                <li v-for="item in midd.list" v-if="item.comment_level == '2'">
                    <div class="item">
                        <img :src="item.wechat_headimgurl" class="head">
                        {{item.wechat_nickname}} <i class="lv lv{{item.wechat_userlevel}}"></i><br>
                        <div class="starts-container"><start :value="parseInt(item.comment_score_store)"><start></div>
                        <h6>{{item.comment_time | format 'yyyy-MM-dd'}}</h6>
                        <div class="tag">
                            <a v-for="tag in item.comment_store_label" v-if="tag!=''">{{$store.state.storeLabel[parseInt(tag)-1]}}</a>
                        </div>
                        <p>{{item.comment}}</p>
                        <small v-for="reply in item.reply">
                            <span>{{reply.comment_userid ? '用户回复' : '店铺回复'}}: </span>
                            {{reply.comment}}
                            <br>
                        </small>
                    </div>
                </li>
                <div class="no-data" v-if="midd.list.length<=0">
                    <h1>没有相关评论</h1>
                </div>
                <a class="btn-more" v-if="midd.btn" @click="getMidd">查看更多</a>
            </ul>
        </div>

        <div id="item4" class="mui-control-content fade-in-left">
            <ul class="comment-item">
                <li v-for="item in bad.list" v-if="item.comment_level == '3'">
                    <div class="item">
                        <img :src="item.wechat_headimgurl" class="head">
                        {{item.wechat_nickname}} <i class="lv lv{{item.wechat_userlevel}}"></i><br>
                        <div class="starts-container"><start :value="parseInt(item.comment_score_store)"><start></div>
                        <h6>{{item.comment_time | format 'yyyy-MM-dd'}}</h6>
                        <div class="tag">
                            <a v-for="tag in item.comment_store_label" v-if="tag!=''">{{$store.state.storeLabel[parseInt(tag)-1]}}</a>
                        </div>
                        <p>{{item.comment}}</p>
                        <small v-for="reply in item.reply">
                            <span>{{reply.comment_userid ? '用户回复' : '店铺回复'}}: </span>
                            {{reply.comment}}
                            <br>
                        </small>
                    </div>
                </li>
                <div class="no-data" v-if="bad.list.length<=0">
                    <h1>没有相关评论</h1>
                </div>
                <a class="btn-more" v-if="bad.btn" @click="getBad">查看更多</a>
            </ul>
        </div>
    </div>
    </div>
    </div>
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
import Start from '../components/start.vue'
export default{
    name: 'techComment',
    data: function(){
        return{
            active: 'all',
            massagistInfo: {
                massagist_image: []
            },
            info: {},
            all: {
                list: [],
                page: 0,
                btn: false
            },
            bad: {
                list: [],
                page: 0,
                btn: false
            },
            good: {
                list: [],
                page: 0,
                btn: false
            },
            midd: {
                list: [],
                page: 0,
                btn: false
            }
        }
    },
    ready: function(){
        document.title = '我的评价'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$http.post(API.getMassagistInfo, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.massagistInfo = data.data.object
            if(this.massagistInfo.massagist_photo.indexOf('http')<0){
                this.massagistInfo.massagist_photo = this.$store.state.URL + this.massagistInfo.massagist_photo
            }
        })
        this.getAll()
        this.getGood()
        this.getMidd()
        this.getBad()
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        getAll(){
            this.all.page++;
            this.$store.state.showTip({type: 'loading', content: '加载中...' });
            this.$http.post(API.getTechnicianEvaluate, {
                page: this.all.page
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                if(!data.data.list){
                    this.all.btn = false;
                    return;
                }else if(data.data.list.length < this.$store.state.pageSize){
                    this.all.btn = false;
                }else{
                    this.all.btn = true;
                };
                this.all.list = this.all.list.concat(data.data.list);
                this.info = data.data.object;
                for(let i=0; i<this.all.list.length; i++){
                    if(!this.all.list[i].wechat_user_viptime){
                        this.all.list[i].wechat_userlevel = 0
                    }else if(this.all.list[i].wechat_user_viptime == '1'){
                        this.all.list[i].wechat_userlevel = 7
                    }else if( this.all.list[i].wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                        this.all.list[i].wechat_userlevel = 0
                    }else{
                        this.all.list[i].wechat_userlevel = 1
                    }
                    if(this.all.list[i].wechat_headimgurl.indexOf('http')<0){
                        this.all.list[i].wechat_headimgurl = this.$store.state.URL + this.all.list[i].wechat_headimgurl
                    }
                }
            })
        },
        getGood(){
            this.good.page++;
            this.$store.state.showTip({type: 'loading', content: '加载中...' });
            this.$http.post(API.getTechnicianEvaluate, {
                page: this.good.page,
                type: 1
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                if(!data.data.list){
                    this.good.btn = false;
                    return;
                }else if(data.data.list.length < this.$store.state.pageSize){
                    this.good.btn = false;
                }else{
                    this.good.btn = true;
                };
                this.good.list = this.good.list.concat(data.data.list);
                this.info = data.data.object;
                for(let i=0; i<this.good.list.length; i++){
                    if(!this.good.list[i].wechat_user_viptime){
                        this.good.list[i].wechat_userlevel = 0
                    }else if(this.good.list[i].wechat_user_viptime == '1'){
                        this.good.list[i].wechat_userlevel = 7
                    }else if( this.good.list[i].wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                        this.good.list[i].wechat_userlevel = 0
                    }else{
                        this.good.list[i].wechat_userlevel = 1
                    }
                    if(this.good.list[i].wechat_headimgurl.indexOf('http')<0){
                        this.good.list[i].wechat_headimgurl = this.$store.state.URL + this.good.list[i].wechat_headimgurl
                    }
                }
            })
        },
        getMidd(){
            this.midd.page++;
            this.$store.state.showTip({type: 'loading', content: '加载中...' });
            this.$http.post(API.getTechnicianEvaluate, {
                page: this.midd.page,
                type: 2
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                if(!data.data.list){
                    this.midd.btn = false;
                    return;
                }else if(data.data.list.length < this.$store.state.pageSize){
                    this.midd.btn = false;
                }else{
                    this.midd.btn = true;
                };
                this.midd.list = this.midd.list.concat(data.data.list);
                this.info = data.data.object;
                for(let i=0; i<this.midd.list.length; i++){
                    if(!this.midd.list[i].wechat_user_viptime){
                        this.midd.list[i].wechat_userlevel = 0
                    }else if(this.midd.list[i].wechat_user_viptime == '1'){
                        this.midd.list[i].wechat_userlevel = 7
                    }else if( this.midd.list[i].wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                        this.midd.list[i].wechat_userlevel = 0
                    }else{
                        this.midd.list[i].wechat_userlevel = 1
                    }
                    if(this.midd.list[i].wechat_headimgurl.indexOf('http')<0){
                        this.midd.list[i].wechat_headimgurl = this.$store.state.URL + this.midd.list[i].wechat_headimgurl
                    }
                }
            })
        },
        getBad(){
            this.bad.page++;
            this.$store.state.showTip({type: 'loading', content: '加载中...' });
            this.$http.post(API.getTechnicianEvaluate, {
                page: this.bad.page,
                type: 3
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                if(!data.data.list){
                    this.bad.btn = false;
                    return;
                }else if(data.data.list.length < this.$store.state.pageSize){
                    this.bad.btn = false;
                }else{
                    this.bad.btn = true;
                };
                this.bad.list = this.bad.list.concat(data.data.list);
                this.info = data.data.object;
                for(let i=0; i<this.bad.list.length; i++){
                    if(!this.bad.list[i].wechat_user_viptime){
                        this.bad.list[i].wechat_userlevel = 0
                    }else if(this.bad.list[i].wechat_user_viptime == '1'){
                        this.bad.list[i].wechat_userlevel = 7
                    }else if( this.bad.list[i].wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                        this.bad.list[i].wechat_userlevel = 0
                    }else{
                        this.bad.list[i].wechat_userlevel = 1
                    }
                    if(this.bad.list[i].wechat_headimgurl.indexOf('http')<0){
                        this.bad.list[i].wechat_headimgurl = this.$store.state.URL + this.bad.list[i].wechat_headimgurl
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