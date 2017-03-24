import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    URL: 'http://www.yangshenghui.net/',
    tip: {
        show: false,
        options: {}
    },
    showTip: function(opt){
        this.tip.show = true
        this.tip.options = opt
    },
    hideTip: function(){
        this.tip.show = false
    },
    storeLabel: [
        '环境优雅',
        '设备完善',
        '价格合理',
        '下次还来',
        '环境一般',
        '设施一般',
        '性价比低',
        '有待提高',
        '环境恶劣',
        '设施陈旧',
        '价格坑爹',
        '绝不再来'
    ],
    tecLabel: [
        '服务热情',
        '手法专业',
        '态度很好',
        '颜值爆表',
        '服务一般',
        '手法一般',
        '态度一般',
        '看的过去',
        '服务太差',
        '手法太差',
        '态度恶劣',
        '惨不忍睹'
    ],
    __getImgData: function(img, dir, next) {
        let image = new Image();
        image.onload = function(){
            let degree = 0,drawWidth,drawHeight,width,height;
            drawWidth = this.naturalWidth;
            drawHeight = this.naturalHeight;
            if(drawWidth > 2000 || drawHeight > 2000){
                drawWidth = drawWidth / 3;
                drawHeight = drawHeight / 3;
            }
            let canvas = document.createElement('canvas');
            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight; 
            let context = canvas.getContext('2d');
            let isRouter = true;
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch(dir){
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width = height;
                    canvas.height = width; 
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width = height;
                    canvas.height = width; 
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
            }
            //使用canvas旋转校正
            context.rotate(degree * Math.PI / 180);
            context.drawImage(this, 0 , 0, drawWidth, drawHeight);
            next(canvas.toDataURL(0.7));
        }
        image.src = img;
    },
    locationReload: function(){ location.reload() },
    pageSize: 10,
}

export default new Vuex.Store({ state })