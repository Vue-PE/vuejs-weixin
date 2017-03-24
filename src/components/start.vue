<template>
    <a class="start-container" v-if="!big">
        <i class=" {{value>=1 ? 'active' : ''}} ">&#xe688;</i>
        <i class=" {{value>=2 ? 'active' : ''}} ">&#xe688;</i>
        <i class=" {{value>=3 ? 'active' : ''}} ">&#xe688;</i>
        <i class=" {{value>=4 ? 'active' : ''}} ">&#xe688;</i>
        <i class=" {{value>=5 ? 'active' : ''}} ">&#xe688;</i>
    </a>
    <a class="start-container-b" v-if="big">
        <i class=" {{value>=1 ? 'active' : ''}} " @click = "click(1)">&#xe688;</i>
        <i class=" {{value>=2 ? 'active' : ''}} " @click = "click(2)">&#xe688;</i>
        <i class=" {{value>=3 ? 'active' : ''}} " @click = "click(3)">&#xe688;</i>
        <i class=" {{value>=4 ? 'active' : ''}} " @click = "click(4)">&#xe688;</i>
        <i class=" {{value>=5 ? 'active' : ''}} " @click = "click(5)">&#xe688;</i>
    </a>
</template>
<script>
    export default{
        props: {
            value: {
                type: Number,
                default: 5
            },
            ischange: {
                type: Boolean,
                default: false
            },
            big: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            click: function(val){
                if(this.ischange) this.value = val
            }
        }
    }
</script>