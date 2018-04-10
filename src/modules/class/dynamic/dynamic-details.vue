<!-- 
  动态
 -->
<template>
  <div class="dynamic-details">

      <div class="dynamic-header">
        <p class="dynamic-name">参加考察--0316普华商学院参观学习</p>
        <p class="release-time">发布时间：2018/03/15 10:28:33</p>
        <p class="dynamic-content">
          写山坡的诗很多，有的写着写着，诗就陡起来了，这首也是。
          如果不细读，却也看不出什么奇崛之处，无非就是晒太阳。
          可是你读到最后，发现这个时间对应了某个人生的节点。
          发现这个时间对应了某个人生的节点。
        </p>
        <div class="dynamic-center-img">
          <div class="dynamic-img-box" v-for="(item, index) in 6"  :key="index"><img src="~assets/img/audio.png" alt="图片"></div>
        </div>
      </div>

      <div class="dynamic-footer">

        <div class="footer-tips">
          <div class="footer-tips-btn sign-up " :class="{ 'sign-up-icon' : isShow==true, 'sign-up-icon-tow': isShow==false}" @click="signUp"> 报名 17</div>
          <div class="footer-tips-btn" :class="{ 'comment-icon' : isShow==false, 'comment-icon-tow': isShow==true}" @click="comment"> 193</div>
          <div class="footer-tips-btn thumbs-up"  :class="{ 'thumbsUp-icon' : isIcon, 'thumbsUp-icon-tow': !isIcon}" @click="thumbsUp"> 104</div>
        </div>

        <div class="sign-up-list">

          <div v-if="isShow==false" v-for="(item, index) in 2"  :key="index">
            <el-img-text-sign-up></el-img-text-sign-up>
          </div>

          <div v-if="isShow==true" v-for="(item, index) in 2"  :key="index">
            <el-img-text-comment></el-img-text-comment>
          </div>
          
        </div>
      </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import elImgTextSignUp from "components/class/dynamic/img-text-sign-up";
import elImgTextComment from "components/class/dynamic/img-text-comment";
export default {
  name: "dynamicDetails",
  components: {
    Tab, TabItem, Swiper, SwiperItem,
    elImgTextSignUp, elImgTextComment
  },
  data() {
    return {
      isShow: false,
      isIcon: false
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    // 获取班费
    fetchData() {
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/userAttribute",
          this.qs.stringify({
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;

            _this.money = res.walletAmount || 0;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    comment() {
      this.isShow = true;
    },
    signUp() {
      this.isShow = false;
    },
    thumbsUp() {
      this.isIcon = !this.isIcon;
      // let _this = this;
         // _this.$http
      //   .post(
      //     "/api/xxx/xxx",
      //     _this.qs.stringify({
      //       customerId: _this.$store.state.user.userId,
      //       Id: _this.$route.query.id
      //     })
      //   )
      //   .then(function(e) {
      //     if (e.data.code == 200) {
      //       _this.$vux.toast.show({
      //         text: e.data.msg
      //       });
      //       _this.isIcon = !_this.isIcon;
      //     } else {
      //       _this.$vux.alert.show({
      //         content: e.data.msg
      //       });
      //     }
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.dynamic-details {
  background-color: $bgGray;
}
.dynamic-header {
  background-color: #fff;
  padding: $padding;
  margin-bottom: 10px;

  .dynamic-name {
    font-size: $fontSizeH4;
    color: $fontColorBlack;
    @include ellipsisMore(1);
    line-height: 1.75;
  }
  .release-time {
    color: $fontColorGray;
    font-size: $fontSizeTips;
    margin-bottom: 10px;
    line-height: 1.75;
  }
  .dynamic-content {
    text-indent: 1em;
    line-height: 1.75;
    font-size: $fontSize;
  }
  .dynamic-center-img {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .dynamic-img-box {
      margin: 5px 0;
      width: 100px;
      height: 80px;
      background-color: $bgGray;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
}
.dynamic-footer {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .footer-tips {
    display: flex;
    flex-direction: row;
    border: 1px solid $borderColor;
    position: relative;
    .footer-tips-btn {
      padding: 5px 0;
      width: 100px;
      text-align: center;
      font-size: $fontSize;
    }
    .comment-icon {
      background: #fff url(~assets/img/class/comment2.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }
    .comment-icon-tow {
      background: #fff url(~assets/img/class/comment.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }

    .sign-up {
      text-align: right;
      padding-right: 15px; 
    }
    .sign-up-icon {
      background: #fff url(~assets/img/class/sign-up2.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }
    .sign-up-icon-tow {
      background: #fff url(~assets/img/class/sign-up.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }

    .thumbs-up {
      position: absolute;
      right: 0;
    }
    .thumbsUp-icon {
      background: #333 url(~assets/img/class/thumbs-up.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }
    .thumbsUp-icon-tow {
      background: #fff url(~assets/img/class/thumbs-up.png)no-repeat;
      background-size: 15%;
      background-position: 15px 7px;
    }
  }
  .sign-up-list {
  }
}
</style>
