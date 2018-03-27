<template>
  <div id="app">
    <loading v-model="loadbar.isLoading"></loading>
    <div v-show="user.userId" :class="['container', {'active': nav.status}]">
      <!-- <transition :name="'vux-pop-' + (direction.direction === 'forward' ? 'in' : 'out')"> -->
          <router-view class="router-view" :key="key"></router-view>
        <!-- </transition> -->
      <!-- <router-view></router-view>     -->
    </div>
    <el-nav v-show="nav.status"></el-nav>
  </div>
</template>

<script type="text/babel">
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  import hold from 'src/commons/hold'
  import elNav from 'components/nav/nav'

  export default {
    name: 'app',
    components: {
      Loading, elNav
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        nav: state => state.nav,
        loadbar: state => state.loadbar,
        direction: state => state.direction
      }),
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date(): this.$route + +new Date()
      }
    },
    watch: {
      '$route' (to, from) {
        if(to.name == from.name) {
          if(!this.isObjectValueEqual(to.params, from.params) || !this.isObjectValueEqual(to.query, from.query)) {
            this.$router.go(0);
          }
        }
      }
    },
    mounted () {
      let userCode = this.$store.state.user.userCode || hold.storage.get("userCode"),
          storageOpenId = hold.storage.get("openId"),
          storeOpenId = this.$store.state.user.openId,
          openId = storageOpenId || storeOpenId;
      let _this = this;
      
      if(openId) {
        this.$store.commit("updateUserOpenId", { openId: openId });
        this.getUserInfo(openId);
      }

      // this.signUrl(location.href);

      // this.$nextTick(function(argument) {
      //   this.overscroll(document.querySelector('#app, .container, .filter-file.rank-filter'));
      //   document.querySelector('.v-transfer-dom, .vue-alert, .vux-toast, .rank-list .container, .rank-list .top-search').addEventListener('touchmove', function(evt) {
      //     //In this case, the default behavior is scrolling the body, which
      //     //would result in an overflow.  Since we don't want that, we preventDefault.
      //     if(!evt._isScroller) {
      //       evt.preventDefault();
      //     }
      //   })
      // })
    },
    methods: {
      // overscroll (el) {
      //   console.log(el)
      //   if(!el) return;
      //   el.addEventListener('touchstart', function() {
      //     var top = el.scrollTop
      //       , totalScroll = el.scrollHeight
      //       , currentScroll = top + el.offsetHeight;
      //     //If we're at the top or the bottom of the containers
      //     //scroll, push up or down one pixel.
      //     //
      //     //this prevents the scroll from "passing through" to
      //     //the body.
      //     if(top === 0) {
      //       el.scrollTop = 1;
      //     } else if(currentScroll === totalScroll) {
      //       el.scrollTop = top - 1;
      //     }
      //   });
      //   el.addEventListener('touchmove', function(evt) {
      //     //if the content is actually scrollable, i.e. the content is long enough
      //     //that scrolling can occur
      //     if(el.offsetHeight < el.scrollHeight)
      //       evt._isScroller = true;
      //   });
      // }
    }
  }
</script>

<style lang="scss">
  @import "~assets/css/common.scss";
</style>

<style lang="scss" scoped>
  @import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
  #app {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    // padding-bottom: $containerBottom;
    overflow: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    &.active {
      padding-bottom: $containerBottom;
    }
  }

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  width: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
