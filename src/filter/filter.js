import Vue from 'vue'

Date.prototype.format = function(format) {
   var date = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S+": this.getMilliseconds()
   };
   if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
   }
   for (var k in date) {
          if (new RegExp("(" + k + ")").test(format)) {
                 format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
   }
   return format;
}

Vue.filter('format', function (value, key) {
    if(!value || value.length < 8) return value
    // yyyy年 MM月 dd日 hh:mm:ss
    return new Date(value*1000).format(key)
})
// 性别
Vue.filter('sex', function(value){
    if(value == 1) return '男'
    else return '女'
})
// 年龄
Vue.filter('years', function(value){
    if(value.length < 8) return value
    return new Date().format('yyyy') - new Date(value*1000).format('yyyy') + '岁'
})
