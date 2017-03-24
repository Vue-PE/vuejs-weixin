<template>
<div class="page tech">
    <header class="index">
        <div id="segmentedControl" class="mui-segmented-control">
            <a class="mui-control-item mui-active" href="#item1">当前</a>
            <a class="mui-control-item" href="#item2">项目</a>
        </div>
    </header>

    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <div id="item1" class="mui-control-content fade-in-left mui-active" v-if="Ordering">
        <ul class="customers-container">
            <li>
                <img :src="Ordering.wechat_headimgurl"> 
                {{Ordering.wechat_nickname}}
                <i class="lv lv{{Ordering.wechat_userlevel}}"></i>
            </li>
            <li>项目：<em>{{Ordering.item_name}}</em></li>
            <li>消费类型：{{Ordering.order_address == 0 ? '在店消费' : '技师上门'}}</li>
            <li>房间号：<span>{{Ordering.room_num}}</span></li>
            <li>备注：{{Ordering.order_info}}</li>
        </ul>
        <form class="mui-input-group select-working">
            <div class="mui-input-row mui-radio mui-left" v-if="!Ordering.order_addtime">
                <label>上钟（开始计时）</label>
                <input name="radio1" type="radio" checked>
            </div>
            <div class="mui-input-row mui-radio mui-left" v-if="Ordering.order_addtime">
                <label>下钟（结束计时）</label>
                <input name="radio1" type="radio" @click="workType = 'end'">
            </div>
            <div class="mui-input-row mui-radio mui-left" v-if="Ordering.order_addtime && Ordering.order_addtime==1">
                <label>加钟（增加计时）</label>
                <input name="radio1" type="radio" @click="workType = 'add'">
            </div>
        </form>
        <div class="timer" v-if="Ordering.order_addtime">{{jishi}}</div>
        <button type="button" class="mui-btn mui-btn-warning mui-btn-block" v-if="!Ordering.order_addtime || workType!='start'" @click="updateOrderStae()">确定</button>
    </div>

    <div id="item1" class="mui-control-content fade-in-left mui-active" v-if="!Ordering">
        <ul class="customers-container">
            <li class="nothing" v-show="massagist_status == 2">^_^ 订单马上来哟~</li>
            <li class="nothing" v-show="massagist_status == 3">^_^ 您目前正在休假~</li>
        </ul>
        <form class="mui-input-group select-working">
            <div class="mui-input-row mui-radio mui-left {{massagist_status==2 ? 'show-color' : ''}}">
                <label>空闲（正在排班）</label>
                <input name="radio1" type="radio" :checked="massagist_status == 2" value="2" v-model="massagist_status">
            </div>
            <div class="mui-input-row mui-radio mui-left {{massagist_status==3 ? 'show-color' : ''}}">
                <label>休假（没有上班）</label>
                <input name="radio1" type="radio" :checked="massagist_status == 3" value="3" v-model="massagist_status">
            </div>
        </form>
    </div>

    <div id="item2" class="mui-control-content fade-in-right">
        <div class="title" @click="showHandlePro=!showHandlePro"><i class="ico-down {{!showHandlePro?'up':''}}"></i>项目调整申请（{{getHandleProject.length}}）</div>
        <ul class="mui-table-view item-container" v-show="showHandlePro">
            <li class="mui-table-view-cell mui-media" v-for="item in getHandleProject">
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body">
                        {{item.item_name}}
                        <p class="mui-ellipsis">申请时间：{{(item.apply_time || '前台添加') | format 'yyyy-MM-dd hh:mm'}}</p>
                    </div>
                    <i class="status-text">申请{{item.handle == 'add' ? '添加' : '移除'}}</i>
                    <i class="status wait" v-if="item.apply_state == 0">等待审核</i>
                    <i class="status true" v-if="item.apply_state == 1">已同意</i>
                    <i class="status false" v-if="item.apply_state == 2">已拒绝</i>
                </a>
            </li>
            <div class="no-data" v-if="getHandleProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>

        <div class="title" @click="showHavePro=!showHavePro"><i class="ico-down {{!showHavePro?'up':''}}"></i>已添加项目（{{getHaveProject.length}}）</div>
        <ul class="mui-table-view item-container" v-show="showHavePro">
            <li class="mui-table-view-cell mui-media" v-for="item in getHaveProject">
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body center">
                        {{item.item_name}}
                    </div>
                    <i class="status center remove" v-if="item.apply_state!=0" @click="apply(item.item_id, 'delete')">移除</i>
                    <i class="status center fail" v-if="item.apply_state==0">已申请</i>
                </a>
            </li>
            <div class="no-data" v-if="getHaveProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>

        <div class="title" @click="showAddPro=!showAddPro"><i class="ico-down {{!showAddPro?'up':''}}"></i>可申请项目（{{getAddProject.length}}）</div>
        <ul class="mui-table-view item-container" v-show="showAddPro">
            <li class="mui-table-view-cell mui-media" v-for="item in getAddProject">
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left" :src="$store.state.URL + item.item_image">
                    <div class="mui-media-body center">
                        {{item.item_name}}
                    </div>
                    <i class="status center add" v-if="item.apply_state!=0" @click="apply(item.item_id, 'add')">申请添加</i>
                    <i class="status center fail" v-if="item.apply_state==0">已申请</i>
                </a>
            </li>
            <div class="no-data" v-if="getAddProject.length<=0">
                <h6>还没有该项目~</h6>
            </div>
        </ul>
    </div>
    </div>
    </div>
    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item mui-active">
            <span class="iconfont">&#xe67d;</span>
            <span class="mui-tab-label">首页</span>
        </a>
        <a class="winslow-tab-item" @click="local('tech-my')">
            <span class="iconfont">&#xe61e;</span>
            <span class="mui-tab-label">我的</span>
        </a>
    </nav>
</div>
</template>

<script>
export default{
    name: 'tech',
    data: function(){
        return{
            massagist_status: -1,
            getHaveProject: [],
            getHandleProject: [],
            getAddProject: [],
            showHavePro: true,
            showHandlePro: true,
            showAddPro: true,
            Ordering: null,
            workType: 'start',
            jishi: '',
            isChangeStatu: 0
        }
    },
    ready: function(){
        document.title = '技师'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.$store.state.showTip({type: 'loading', content: '加载中...' })
        this.getOrderWork()
        this.$http.post(API.getMassagistInfo, {}).then( (data) => {
            if(data.data.errorInfo) return
            this.$store.state.hideTip()
            this.massagist_status = data.data.object.massagist_status
        })
        this.getProject()
    },
    watch: {
        'massagist_status': function(val){
            if(this.isChangeStatu == 0){
                this.isChangeStatu++;
                return;
            }
            this.$http.post(API.updateTechnicianState, {
                action: val
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
            })
        }
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        updateOrderStae(){
            this.$store.state.showTip({type: 'loading', content: '处理中...' })
            this.$http.post(API.updateOrderStae, {
                action: this.workType
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.$store.state.showTip({type: 'success', content: '处理成功' })
                setTimeout(()=>{
                    location.reload()
                }, 1500)
            })
        },
        getOrderWork(){
            // 获取工单
            this.$http.post(API.getWorkOrder, {
                working: 'w'
            }).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                if(data.data.object){
                    this.Ordering = data.data.object
                    if(this.Ordering.wechat_headimgurl.indexOf('http')<0){
                        this.Ordering.wechat_headimgurl = this.$store.state.URL + this.Ordering.wechat_headimgurl
                    }
                    if(this.Ordering.order_addtime){
                        if(this.Ordering.order_addtime == 1){
                            let miao = this.Ordering.order_item_starttime - Date.parse(new Date())/1000
                            this.showTime(miao)
                        }
                        if(this.Ordering.order_addtime == 2){
                            this.showTime(this.Ordering.order_item_starttime)
                        }
                    }
                    if(!this.Ordering.wechat_user_viptime){
                        this.Ordering.wechat_userlevel = 0
                    }else if(this.Ordering.wechat_user_viptime == '1'){
                        this.Ordering.wechat_userlevel = 7
                    }else if( this.Ordering.wechat_user_viptime - Date.parse(new Date())/1000 <= 0 ){
                        this.Ordering.wechat_userlevel = 0
                    }else{
                        this.Ordering.wechat_userlevel = 1
                    }
                }
            })
        },
        showTime(val){
            let h = Math.floor(val / 60 / 60);
            let m = Math.floor((val - h * 60 * 60) / 60);
            let s = Math.floor((val - h * 60 * 60 - m * 60));
            // document.getElementById("DD").innerHTML = parseInt(h/24);
            this.jishi = h + ':' + m + ':' + s
            if(this.Ordering.order_addtime == 1) val--;
            else if(this.Ordering.order_addtime == 2) val++;
            if (val < 0){
                this.jishi = '00:00:00'
            }else{
                setTimeout(() => {
                    this.showTime(val)
                }, 1000)
            }
        },
        apply: function(id, type){
            let me = this
            let text = ''
            type == 'add' ? text = '确定申请该项目吗？' : text = '确定移除该项目吗？'
            mui.confirm(text, '提醒', ['取消', '确定'], function(e) {
                if (e.index == 1) {
                    me.$store.state.showTip({type: 'loading', content: '请稍等...' })
                    me.$http.post(API.applyProject, {
                        pid: id,
                        action: 'add'
                    }).then( (data) => {
                        if(data.data.errorInfo) return
                        me.$store.state.hideTip()
                        me.$store.state.showTip({type: 'success', content: '处理成功' })
                        me.getProject()
                    })
                }
            })
        },
        getProject: function(){
            // 获取已有项目
            this.$http.post(API.getHaveProject, {}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getHaveProject = data.data.list
            })
            // 获取已申请项目
            this.$http.post(API.getHandleProject, {}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getHandleProject = data.data.list
            })
            // 获取可申请项目
            this.$http.post(API.getAddProject, {}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.getAddProject = data.data.list
            })
        }

    }
}
    
</script>