<style lang='sass' scoped>
.tips{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100000;
    left: 0px;
    top: 0px;
    &.slide-transition{
        transition: all .3s ease;
        opacity: 1;
    }
    &.slide-enter,&.slide-leave{opacity: 0;}
    .container{
        min-width: 120px;
        min-height: 120px;
        padding: 10px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%)!important;
        border-radius: 4px;
        opacity: 1;
        color: #FFF;
        i{
            font-size: 80px;
            display: block;
            margin: 0px auto 0px auto;
            height: 70px;
        }
        b{
            font-weight: 300;
            font-size: 16px;
        }
    }
    &.loading{
        .container{
            background: #333;
        }
    }
    &.error{
        .container{
            background: #a50d0d;
        }
    }
    &.success{
        .container{
            background: #0da514;
        }
    }
}
</style>
<template>
    <div class="tips" v-show="show" :class="options.type">
        <div class="container">
            <i v-if="options.type=='loading'" class="mui-spinner" style="width: 50px;"></i>
            <i v-if="options.type=='error'" class="mui-icon mui-icon-closeempty"></i>
            <i v-if="options.type=='success'" class="mui-icon mui-icon-checkmarkempty"></i>
            <b>{{ options.content }}</b>
        </div>
    </div>
</template>
<script>
    export default{
        props: {
            options: {
                type: Object,
                default: {}
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            options(val){
                if(this.options.type!='loading'){
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout( () => {
                        this.show = false;
                    }, 2000);
                }
            }
        }
    }
</script>