import Vue from 'vue'
import commonFun from 'src/commons'
import store from 'src/store'
import Router from 'vue-router'
import routerLink from './router-link'
import hold from 'src/commons/hold'
import wordBook from 'src/commons/wordBook'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

Vue.use(Router)

const router = new Router({
  routes: routerLink
})

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0);

router.beforeEach((to, from, next) => {
  // 是否加载
  store.commit('updateLoadingStatus', {isLoading: true});

  // if(to.path != '/share') {
  if(!hold.storage.get('openId') && to.path != '/author'){
  // 第一次进入项目
    hold.localStorage.set('beforeLoginUrl', JSON.stringify(to)) // 保存用户进入的url
    next({
      path: '/author',
      query: to.query,
      params: to.params
    });
  } else if (to.path == '/author') {
    next();
  } else {
    store.commit("updateNavStatus", { status: Vue.prototype.arrContain(Vue.prototype.wordBook.nav, to.name) });

    if(to.name == 'msg') {
      store.commit("updateUserHasMsg", { hasMsg: '' });
    }
    // 切换效果
    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    if (toIndex) {
      if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
        store.commit('updateDirection', {direction: 'forward'})
      } else {
        store.commit('updateDirection', {direction: 'reverse'})
      }
    } else {
      ++historyCount
      history.setItem('count', historyCount)
      to.path !== '/' && history.setItem(to.path, historyCount)
      store.commit('updateDirection', {direction: 'forward'})
    }

    if (/\/http/.test(to.path)) {
      let url = to.path.split('http')[1]
      window.location.href = `http${url}`
      next();
    } else {
      let query = to.query;

      if(!to.query.uuid && store.state.user.openId) {
        query.uuid = store.state.user.openId;
        next({
          name: to.name,
          query: query,
          fullPath: to.fullPath + "?uuid=" + query.uuid,
          params: to.params
        })

        if(to.name == from.name) {
          store.commit('updateLoadingStatus', {isLoading: false});
        }
      } else {
        next()
      }
    }
  }
  // 切换效果结束
})

router.afterEach((to, from, next) => {
  let openId = store.state.user.openId || hold.storage.get('openId');
  // 微信签名
  // if(to.name == 'share') store.commit('updateUserShareImg', {shareImg: ''});

  if(to.name == 'index') {
    Vue.prototype.signUrl('http://fbz3.10-suns.com/#' + to.fullPath, false, { url: 'http://fbz3.10-suns.com/#/index?uuid=' + openId, imgUrl: '' });
  } else {
    // Vue.prototype.signUrl(location.href, true, { url: 'http://fbz3.10-suns.com/fbz/#/share?openId' + hold.storage.get('openId'), imgUrl: '' });
    Vue.prototype.signUrl('http://fbz3.10-suns.com/#' + to.fullPath, true, { url: 'http://fbz3.10-suns.com/#' + to.fullPath, imgUrl: '' });
  }

  store.commit('updateLoadingStatus', {isLoading: false})
  // 设置标题
  global.document.title = to.meta.title || '富班长'
  // Vue.nextTick().then(function () {
  //   // DOM 更新了
  //   Vue.prototype.overscroll(document.querySelector('.scroll-fix'));
  //   document.body.addEventListener('touchmove', function(evt) {
  //     //In this case, the default behavior is scrolling the body, which
  //     //would result in an overflow.  Since we don't want that, we preventDefault.
  //     if(!evt._isScroller) {
  //       evt.preventDefault();
  //     }
  //   })
  // })
  // 滚动条回到头部
  global.scrollTo(0, 0)
})

export default router
