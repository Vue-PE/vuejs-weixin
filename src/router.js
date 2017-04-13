// 项目组件
import index from './views/index.vue'
import login from './views/login.vue'
import tech from './views/tech.vue'
import techMy from './views/tech-my.vue'
import techComment from './views/tech-comment.vue'
import techInfo from './views/tech-info.vue'
import techMyHead from './views/tech-my-head.vue'

import consumer from './views/consumer.vue'
import consumerPro from './views/consumer-pro.vue'
import consumerTech from './views/consumer-tech.vue'
import consumerOrderSub from './views/consumer-order-sub.vue'
import consumerTechCom from './views/consumer-tech-comment.vue'
import consumerShopCom from './views/consumer-shop-comment.vue'
import consumerVip from './views/consumer-vip.vue'
import consumerMember from './views/consumer-member.vue'
import consumerOrderInfo from './views/consumer-order-info.vue'
import consumerOrderList from './views/consumer-order-list.vue'
import consumerMy from './views/consumer-my.vue'
import consumerPostComment from './views/consumer-post-comment.vue'
import consumerPay from './views/consumer-pay.vue'
import consumerImages from './views/consumer-images.vue'

import manageShop from './views/manage/shop'
import manageShopComment from './views/manage/shop-comment'
import manageShopChart from './views/manage/shop-chart'
import manageTech from './views/manage/tech'
import manageTechInfo from './views/manage/tech-info'
import manageProject from './views/manage/project'
import manageProjectInfo from './views/manage/project-info'

export default function(router){
    // 路由配置
    router.map({

        '/login/:token/:storeid': { name: 'login', component: login },

        '/tech/:token': { name: 'tech', component: tech },

        '/tech-my/:token': { name: 'techMy', component: techMy },

        '/tech-my-head/:token': { name: 'techMyHead', component: techMyHead },

        '/tech-comment/:token': { name: 'techComment', component: techComment },

        '/tech-info/:token': { name: 'techInfo', component: techInfo },

        '/index/:token/:storeid': { name: 'index', component: index },

        '/consumer/:token/:storeid': { name: 'consumer', component: consumer },

        '/consumer-pro/:token/:storeid/:id': { name: 'consumerPro', component: consumerPro },

        '/consumer-tech/:token/:storeid/:id': { name: 'consumerTech', component: consumerTech },

        '/consumer-order-sub/:token/:storeid/:pid/:tid': { name: 'consumerOrderSub', component: consumerOrderSub },

        '/consumer-tech-comment/:token/:storeid/:id': { name: 'consumerTechCom', component: consumerTechCom },

        '/consumer-shop-comment/:token/:storeid': { name: 'consumerShopCom', component: consumerShopCom },

        '/consumer-vip/:token/:storeid': { name: 'consumerVip', component: consumerVip },

        '/consumer-order-info/:token/:storeid/:id': { name: 'consumerOrderInfo', component: consumerOrderInfo },
        
        '/consumer-order-list/:token/:storeid': { name: 'consumerOrderList', component: consumerOrderList },
        
        '/consumer-my/:token/:storeid': { name: 'consumerMy', component: consumerMy },

        '/consumer-post-comment/:token/:storeid/:id': { name: 'consumerPostComment', component: consumerPostComment },
        
        '/consumer-pay/:token/:storeid/:id': { name: 'consumerPay', component: consumerPay },
        
        '/manage-shop/:token': { name: 'manageShop', component: manageShop },

        '/manage-shop-comment/:token': { name: 'manageShopComment', component: manageShopComment },
        
        '/manage-shop-chart/:token': { name: 'manageShopChart', component: manageShopChart },
        
        '/manage-tech/:token': { name: 'manageTech', component: manageTech },
        
        '/manage-tech-info/:token/:id': { name: 'manageTechInfo', component: manageTechInfo },

        '/manage-project/:token': { name: 'manageProject', component: manageProject },
        
        '/manage-project-info/:token/:id/:switch': { name: 'manageProjectInfo', component: manageProjectInfo },
        
        '/consumer-images/:token': { name: 'consumerImages', component: consumerImages },

        '/consumer-member/:token/:storeid': { name: 'consumerMember', component: consumerMember },
        
    })



    // router.beforeEach(function ({ to, next }) {
    //     if (to.path === '/user') {
    //         console.log('Winslow');
    //     }
    //     next();
    // });

    router.redirect({
        '*': '/login/:token'
    })
}