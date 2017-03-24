<template>
<div class="page consumer" style="padding-bottom: 0px;">
    <header id="header" class="mui-bar mui-bar-nav haed2 ">
        <h1 class="mui-title">发表评价</h1>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-scroll-wrapper" style="bottom: 0px;">
    <div class="mui-scroll">
    <div class="imgs">
        <img :src="commentHtml.massagist_photo">
        <img :src="$store.state.URL + commentHtml.item_image">
    </div>
    <div class="comment-btn">
        <a class="good {{level==1 ? 'active' : ''}}" @click="level=1">好评</a>
        <a class="so {{level==2 ? 'active' : ''}}" @click="level=2">中评</a>
        <a class="bad {{level==3 ? 'active' : ''}}" @click="level=3">差评</a>
    </div>
    
    <div class="title">店铺</div>
    <ul class="comment-li-container">
        <li><a @click="storePush(1, 5, 9)" class="{{storeLabel.contains(1) ? 'active' : ''}}">环境优雅</a></li>
        <li><a @click="storePush(2, 6, 10)" class="{{storeLabel.contains(2) ? 'active' : ''}}">设备完善</a></li>
        <li><a @click="storePush(3, 7, 11)" class="{{storeLabel.contains(3) ? 'active' : ''}}">价格合理</a></li>
        <li><a @click="storePush(4, 8, 12)" class="{{storeLabel.contains(4) ? 'active' : ''}}">下次还来</a></li>
        <li><a @click="storePush(5, 1, 9)" class="{{storeLabel.contains(5) ? 'active' : ''}}">环境一般</a></li>
        <li><a @click="storePush(6, 2, 10)" class="{{storeLabel.contains(6) ? 'active' : ''}}">设施一般</a></li>
        <li><a @click="storePush(7, 3, 11)" class="{{storeLabel.contains(7) ? 'active' : ''}}">性价比低</a></li>
        <li><a @click="storePush(8, 4, 12)" class="{{storeLabel.contains(8) ? 'active' : ''}}">有待提高</a></li>
        <li><a @click="storePush(9, 1, 5)" class="{{storeLabel.contains(9) ? 'active' : ''}}">环境恶劣</a></li>
        <li><a @click="storePush(10, 2, 6)" class="{{storeLabel.contains(10) ? 'active' : ''}}">设施陈旧</a></li>
        <li><a @click="storePush(11, 3, 7)" class="{{storeLabel.contains(11) ? 'active' : ''}}">价格坑爹</a></li>
        <li><a @click="storePush(12, 4, 8)" class="{{storeLabel.contains(12) ? 'active' : ''}}">绝不再来</a></li>
        <div class="clear"></div>
    </ul>

    <div class="title">技师</div>
    <ul class="comment-li-container">
        <li><a @click="tecPush(1, 5, 9)" class="{{tecLabel.contains(1) ? 'active' : ''}}">服务热情</a></li>
        <li><a @click="tecPush(2, 6, 10)" class="{{tecLabel.contains(2) ? 'active' : ''}}">手法专业</a></li>
        <li><a @click="tecPush(3, 7, 11)" class="{{tecLabel.contains(3) ? 'active' : ''}}">态度很好</a></li>
        <li><a @click="tecPush(4, 8, 12)" class="{{tecLabel.contains(4) ? 'active' : ''}}">颜值爆表</a></li>
        <li><a @click="tecPush(5, 1, 9)" class="{{tecLabel.contains(5) ? 'active' : ''}}">服务一般</a></li>
        <li><a @click="tecPush(6, 2, 10)" class="{{tecLabel.contains(6) ? 'active' : ''}}">手法一般</a></li>
        <li><a @click="tecPush(7, 3, 11)" class="{{tecLabel.contains(7) ? 'active' : ''}}">态度一般</a></li>
        <li><a @click="tecPush(8, 4, 12)" class="{{tecLabel.contains(8) ? 'active' : ''}}">看的过去</a></li>
        <li><a @click="tecPush(9, 1, 5)" class="{{tecLabel.contains(9) ? 'active' : ''}}">服务太差</a></li>
        <li><a @click="tecPush(10, 2, 6)" class="{{tecLabel.contains(10) ? 'active' : ''}}">手法太差</a></li>
        <li><a @click="tecPush(11, 3, 7)" class="{{tecLabel.contains(11) ? 'active' : ''}}">态度恶劣</a></li>
        <li><a @click="tecPush(12, 4, 8)" class="{{tecLabel.contains(12) ? 'active' : ''}}">惨不忍睹</a></li>
        <div class="clear"></div>
        <textarea placeholder="亲！可以再次输入对店铺及技师的服务评价" v-model="comment"></textarea>
        <p>{{comment.length}}/200</p>
    </ul>

    <div class="title">店铺及技师评分(满意给5星哦)</div>
    <div class="winslow-container">
        <p class="pingfen">店铺评分 <start :value.sync="scoreStore" :ischange='true' :big='true'></start></p>
        <p class="pingfen">技师评分 <start :value.sync="scoreMassagist" :ischange='true' :big='true'></start></p>
    </div>

    <button type="button" class="mui-btn mui-btn-warning mui-btn-block" style="width: 70%;margin: 20px auto;" @click="submit">发表评价</button>
    </div></div>
</div>
</template>

<script>
import Start from '../components/start.vue'
export default{
    name: 'consumerPostComment',
    data: function(){
        return{
            commentHtml: {},
            level: 1,
            comment: '',
            storeLabel: [],
            tecLabel: [],
            scoreStore: 5,
            scoreMassagist: 5
        }
    },
    watch: {
        'comment': function(newval, oldval){
            if(newval.length > 200) this.comment = oldval
        }
    },
    ready: function(){
        document.title = '发表评价'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        // Array
        Array.prototype.contains = function (obj) {
          var i = this.length;
          while (i--) {
            if (this[i] === obj) {
              return true;
            }
          }
          return false;
        }
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        }
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.$http.post(API.getCommentHtml, {
            sid: this.$route.params.storeid,
            oid: this.$route.params.id
        }).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.commentHtml = data.data.list
            if(this.commentHtml.massagist_photo.indexOf('http')<0){
                this.commentHtml.massagist_photo = this.$store.state.URL + this.commentHtml.massagist_photo
            }
        })
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        storePush(id, rid1, rid2){
            if(this.storeLabel.indexOf(id) > -1){
                this.storeLabel.remove(id)
            }else{
                this.storeLabel.push(id)
                this.storeLabel.remove(rid1)
                this.storeLabel.remove(rid2)
            }
        },
        tecPush(id, rid1, rid2){
            if(this.tecLabel.indexOf(id) > -1){
                this.tecLabel.remove(id)
            }else{
                this.tecLabel.push(id)
                this.tecLabel.remove(rid1)
                this.tecLabel.remove(rid2)
            }
        },
        submit(){
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.releaseComment, {
                sid: this.$route.params.storeid,
                oid: this.$route.params.id,
                comment: this.comment,
                comment_level: this.level,
                comment_store_label: this.storeLabel,
                comment_t_label: this.tecLabel,
                comment_score_store: this.scoreStore,
                comment_score_massagist: this.scoreMassagist
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.$store.state.showTip({type: 'success', content: '发布成功' })
                setTimeout(()=>{
                    window.history.go(-1)
                }, 1500)
            })
        }
    },
    components: {
        Start
    }
}
    
</script>