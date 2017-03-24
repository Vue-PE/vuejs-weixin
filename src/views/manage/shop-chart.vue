<template>
<div class="page manage">
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title">报表</h1>
        <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
    </header>
    
    <div class="mui-scroll-wrapper">
    <div class="mui-scroll">
    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="winslow-control-item {{activeChart == 'today' ? 'mui-active' : ''}}" @click="activeChart = 'today'">日报</a>
        <a class="winslow-control-item {{activeChart == 'week' ? 'mui-active' : ''}}" @click="activeChart = 'week'">周报</a>
        <a class="winslow-control-item {{activeChart == 'month' ? 'mui-active' : ''}}" @click="activeChart = 'month'">月报</a>
    </div>
    <div class="title">{{chartInfo[activeChart].title}}：{{sohru}}元</div>
    <div class="winslow-container">
        <div id="lineChart" style="width: 100%;height: 200px;" v-show="lineDate.key.length > 0"></div>
        <div class="no-data" v-if="lineDate.key.length<=0">
            <h6>还没有数据~</h6>
        </div>
    </div>
    <div class="title">项目营收比例</div>
    <div class="winslow-container">
        <div id="pieChart" style="width: 100%;height: 200px;" v-show="pieDate.key.length > 0"></div>
        <div class="no-data" v-if="pieDate.key.length<=0">
            <h6>还没有数据~</h6>
        </div>
    </div>
    </div></div>

    <nav class="mui-bar mui-bar-tab">
        <a class="winslow-tab-item" @click="local('manage-shop')">
            <span class="iconfont">&#xe67d;</span>
            <span class="mui-tab-label">管理</span>
        </a>
        <a class="winslow-tab-item mui-active">
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
import echarts from '../../vendor/echarts.min'
export default{
    name: 'manageShopChart',
    data: function(){
        return{
            activeChart: '',
            sohru: 0,
            chartInfo: {
                'today': {
                    title: '今日营业额'
                },
                'week': {
                    title: '一周营业额'
                },
                'month': {
                    title: '一月营业额'
                }
            },
            lineDate: {
                key: [],
                value: []
            },
            pieDate: {
                key: [],
                object: []
            }
        }
    },
    watch: {
        'activeChart': function(){
            this.lineDate = {
                key: [],
                value: []
            }
            this.pieDate = {
                key: [],
                object: []
            }
            this.$store.state.showTip({type: 'loading', content: '加载中...' })
            this.$http.post(API.getDataTable, {type: this.activeChart}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                let tips = ''
                if(this.activeChart == 'month') tips = '日'
                if(this.activeChart == 'today') tips = '点'
                for(let i=0; i<data.data.list.length; i++){
                    this.lineDate.key.push( data.data.list[i].key + tips )
                    this.lineDate.value.push( data.data.list[i].value )
                }
                setTimeout(() => {
                    if(this.lineDate.key.length > 0 ) this.showLine()
                }, 500)
            })
            this.$http.post(API.getProjectProportion, {type: this.activeChart}).then( (data) => {
                if(data.data.errorInfo) return
                this.$store.state.hideTip()
                this.sohru = data.data.object
                for(let i=0; i<data.data.list.length; i++){
                    this.pieDate.key.push( data.data.list[i].key )
                    this.pieDate.object.push( {
                        value: data.data.list[i].value,
                        name: data.data.list[i].key
                    } )
                }
                setTimeout(() => {
                    if(this.pieDate.key.length > 0 ) this.showPie()
                }, 500)
            })
        }
    },
    ready: function(){
        document.title = '报表'
        mui('.mui-scroll-wrapper').scroll({bounce: false})
        this.activeChart = 'today'
    },
    methods: {
        local: function(name){
            this.$router.go('/'+ name +'/' + this.$route.params.token)
        },
        showLine(){
            let me = this
            let myChart = echarts.init(document.getElementById('lineChart'));
            let option = {
                title: {
                    show: true,
                    text: '营\n业\n额',
                    subtext: '单\n位\n:\n元\n',
                    top: '30px'
                },
                legend: {
                    data:['价格']
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c}元",
                    axisPointer: {
                        lineStyle: {
                            color: '#6d3a3a',
                            width: 0
                        }
                    }
                },
                toolbox: {
                    show: true
                },
                // 相对位置
                grid: {
                    left: '45px',
                    right: '10px',
                    bottom: '10px',
                    top: '10px',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        // X轴
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        // X轴标签
                        axisLabel: {
                            textStyle: {
                                color: '#666',
                                fontStyle: 'normal',
                                fontFamily: 'sans-serif',
                                fontSize: 12
                            }
                        },
                        // X轴竖线
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        data : me.lineDate.key
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine: {
                            show: true
                        },
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666'
                            }
                        },
                        splitLine: {
                            show: false
                        },

                    }
                ],
                series : [
                    {
                        name:'营业额',
                        type:'line',
                        stack: '总量',
                        areaStyle: {normal: {
                            color: new echarts.graphic.LinearGradient(252, 235, 218, 1, [{
                                offset: 0, color: 'rgba(252, 235, 218, 1)'
                            }, {
                                offset: 1, color: 'rgba(252, 235, 218, .5)'
                            }], true)
                        }},
                        lineStyle: {normal: {color: 'rgb(255, 115, 2)', width: 1}},
                        itemStyle: {normal: {color: 'rgb(255, 115, 2)', opacity: 0.8}},
                        data: me.lineDate.value
                    }
                ]
            }
            myChart.setOption(option);
        },
        showPie(){
            let me = this
            let myPieChart = echarts.init(document.getElementById('pieChart'));
            let pieoption = {
                title: {
                    show: false
                },
                tooltip : {
                    trigger: 'item',
                    position: 'right',
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: "{b} : <br/>{c}元({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    right: '0%',
                    top: '10%',
                    itemWidth: 14,
                    formatter: function (name) {
                        return echarts.format.truncateText(name, 100, '…');
                    },
                    data: me.pieDate.key
                },
                series : [
                    {
                        name: '项目营收比例',
                        type: 'pie',
                        radius : '70%',
                        center: ['30%', '50%'],
                        data: me.pieDate.object,
                        labelLine:{
                            normal:{
                                show: false
                            }
                        },
                        label:{
                            normal:{
                                show: true,
                                position: 'inside',
                                formatter: '{d}%'
                            }
                        }
                    }
                ]
            };
            myPieChart.setOption(pieoption);
        }
    }
}
    
</script>