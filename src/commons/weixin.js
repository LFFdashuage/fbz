import Vue from 'vue'
import store from '../store'
import wordBook from './wordBook'
import hold from './hold'
import qs from 'qs'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

// 微信分享
Vue.prototype.openShare = () => {
  let openId = store.state.user.openId || hold.storage.get("openId");
    Vue.http.post("/api/wechat/createQRcode",
        qs.stringify({
            openId: openId
        })).then(function(e) {
        store.commit("updateUserShareImg", { 'shareImg': e.data.data.qrCodeUrl + "?x-oss-process=image/resize,w_750,h_1184/quality,q_50" + "&time=" + Date.parse(new Date()) })
    });
}

Vue.prototype.autoPlay = () => {
	console.log(Vue.wechat)
	// Vue.wechat
}


// 分享到微信朋友圈
let weChatMoments = (title, desc, promoteUrl, imgUrl) => {
    Vue.wechat.onMenuShareTimeline({
        title : title,
        desc : desc,
        link : promoteUrl,
        imgUrl : imgUrl,
        success : function() {},
        cancel : function() {}
    });
}

// 分享到微信好友
let weChatFriend = (title, desc, promoteUrl, imgUrl) => {
    Vue.wechat.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: promoteUrl, // 分享链接
        imgUrl: imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}

// 分享到qq好友
let tencentQFriend = (title, desc, promoteUrl, imgUrl) => {
    Vue.wechat.onMenuShareQQ({
        title : title,
        desc : desc,
        link : promoteUrl,
        imgUrl : imgUrl,
        success : function() {},
        cancel : function() {}
    });
}

// 分享到腾讯微博
let tencentWeiBo = (title, desc, promoteUrl, imgUrl) => {
    Vue.wechat.onMenuShareWeibo({
        title : title,
        desc : desc,
        link : promoteUrl,
        imgUrl : imgUrl,
        success : function() {},
        cancel : function() {}
    });
}

let setShareProductUrl = (title, desc, promoteUrl, imgUrl) => {
    // Vue.wechat.hideAllNonBaseMenuItem();
    // showTopMenu(true);
    weChatMoments(title, desc, promoteUrl, imgUrl);
    weChatFriend(title, desc, promoteUrl, imgUrl);
    // tencentQFriend(title, desc, promoteUrl, imgUrl);
    // tencentWeiBo(title, desc, promoteUrl, imgUrl);
}

let showTopMenu = (status) => {
    if(status){
        Vue.wechat.hideAllNonBaseMenuItem();
        Vue.wechat.showMenuItems({
            menuList: ['menuItem:refresh','menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:favorite']
        });
        Vue.wechat.showOptionMenu();
    } else{
        Vue.wechat.hideOptionMenu();
    }
}

// 微信签名
Vue.prototype.signUrl = (url, status = false, obj = {}) => {
    store.commit("updateUserPay", { 'pay': true })

    // Vue.wechat.hideOptionMenu();
    // Vue.wechat.hideAllNonBaseMenuItem();

    // Vue.wechat.showMenuItems({
    //     menuList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 要显示的菜单项，所有menu项见附录3
    // });
    // setShareProductUrl("富班长", '网络学习中心', location.href, '');


    // Vue.wechat.hideMenuItems({
    //   menuList: [
    //     'menuItem:readMode', // 阅读模式
    //     'menuItem:share:timeline', // 分享到朋友圈
    //     'menuItem:copyUrl' // 复制链接
    //   ],
    //   success: function (res) {
    //     alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
    //   },
    //   fail: function (res) {
    //     alert(JSON.stringify(res));
    //   }
    // });


    Vue.http.post("/api/wechat/sign", qs.stringify({ url: url })).then(function(e) {
        let data = e.data.data.signature;

        if (data.status != 0) {
            return false;
        }

    //     store.commit("updateUserPay", { 'pay': true });

        Vue.wechat.config({
            debug: false,
            appId: data.signature.appId,
            timestamp: data.signature.timestamp,
            nonceStr: data.signature.nonceStr,
            signature: data.signature.signature,
            jsApiList: ['checkJsApi',  
              'onMenuShareTimeline',  
              'onMenuShareAppMessage',  
              'onMenuShareQQ',  
              'onMenuShareWeibo',  
              'onMenuShareQZone',  
              'hideMenuItems',  
              'showMenuItems',  
              'hideAllNonBaseMenuItem',  
              'showAllNonBaseMenuItem',  
              'translateVoice',  
              'startRecord',  
              'stopRecord',  
              'onVoiceRecordEnd',  
              'playVoice',  
              'onVoicePlayEnd',  
              'pauseVoice',  
              'stopVoice',  
              'uploadVoice',  
              'downloadVoice',  
              'chooseImage',  
              'previewImage',  
              'uploadImage',  
              'downloadImage',  
              'getNetworkType',  
              'openLocation',  
              'getLocation',  
              'hideOptionMenu',  
              'showOptionMenu',  
              'closeWindow',  
              'scanQRCode',  
              'chooseWXPay',  
              'openProductSpecificView',  
              'addCard',  
              'chooseCard',  
              'openCard'
            ]
        });

        
        Vue.wechat.ready(function() {
            // Vue.wechat.checkJsApi({
            //     jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu', 'hideAllNonBaseMenuItem', 'closeWindow' ]
            // });

            Vue.wechat.hideMenuItems({
              menuList: [
                'menuItem:share:qq', //分享到QQ  
                'menuItem:share:weiboApp', // 分享到Weibo  
                'menuItem:favorite', // 收藏  
                'menuItem:share:QZone', // 分享到 QQ 空间  
                'menuItem:copyUrl', // 复制链接  
                'menuItem:openWithQQBrowser', // 在QQ浏览器中打开  
                'menuItem:openWithSafari', // 在Safari中打开  
                'menuItem:share:email', // 邮件  
                'menuItem:readMode', // 阅读模式  
                'menuItem:originPage' // 原网页 
              ],
              success: function (res) {
                // alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
              },
              fail: function (res) {
                // alert(JSON.stringify(res));
              }
            });


            setShareProductUrl("富班长平台", '网络学习中心', obj.url || url, '');
        });

    //     Vue.wechat.ready(function() {
    //         Vue.wechat.checkJsApi({
    //             // jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu', 'hideAllNonBaseMenuItem', 'closeWindow' ]
    //         });
    //     });

    //     Vue.wechat.error(function(res) {
    //         if (res.err_msg) {
    //             alert(res.err_msg);
    //         }
    //     });

    //     if (!status) {
    //         Vue.prototype.openShare()
    //     }
    });
}