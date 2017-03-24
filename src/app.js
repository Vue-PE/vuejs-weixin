// 系统文件
import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import routerConfig from './router'
import App from './App.vue'
import './filter/filter.js';

// 公共组件
import LS from './vendor/local.js'
import mui from './vendor/mui.min.js'
import FastClick from './vendor/fastclick.js'
import api from './service/api.js'
window['LS'] = LS
window['API'] = api
window['mui'] = mui
FastClick.attach(document.body)

Vue.use(Router)
Vue.use(Resource)
Vue.config.silent = false
Vue.config.devtools = false


// 路由器配置
var router = new Router({
    hashbang: false
});
routerConfig(router)

//vue-resource设置
// Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true
Vue.http.interceptors.push({
    request(request) {
        request.data['token'] = this.$route.params.token;
        return request
    },
    response(response) {
        if(response.data.errorInfo){
            this.$store.state.showTip({type: 'error', content: response.data.errorInfo })
        }
        return response
    },
})

// 启动路由
router.start(App, 'app')