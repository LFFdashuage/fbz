<!-- 
	班级动态
 -->
<template>
	<div class="dynamic" v-cloak>
    <div class="dynamic-title">
        <p class="title-name">题目题目题目题目</p><span class="title-when-long">30分钟前</span>
    </div>
    <div class="dynamic-center" @click="goPage('dynamicDetails')">
      <p>
        写山坡的诗很多，有的写着写着，诗就陡起来了，这首也是。
        如果不细读，却也看不出什么奇崛之处，无非就是晒太阳。
       可是你读到最后，发现这个时间对应了某个人生的节点。
      </p>
      <div class="dynamic-center-img">
        <div class="dynamic-img-box" v-for="(item, index) in 6"  :key="index"><img src="" alt="图片"></div>
      </div>
    </div>
    <div class="dynamic-footer">
      <div class="comment dynamic-footer-btn" @click="goPage('classMoney')">543</div>
      <div class="sign-up dynamic-footer-btn" @click="signUp">报名</div>
      <div class="thumbs-up dynamic-footer-btn" @click="thumbsUp">123</div>
    </div>
	</div>
</template>

<script type="text/babel">
export default {
  name: "elDynamic",
  // props: ["infoData"],
  data() {
    return {};
  },
  methods: {
    	goPage (url) {
				// this.$router.push({ name: url, query: query })
        this.$router.push({ name: url })
			},
    comment(){
      this.$vux.alert.show({
        content: "评论"
      });
    },
    signUp() {
      this.$vux.alert.show({
        content: "报名"
      });
    },
    //点赞
    thumbsUp() {
      this.$vux.alert.show({
        content: "点赞"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.dynamic {
  // padding: $padding $padding 0 $padding;
  background-color: #fff;
  @include halfpxline(0, $borderColor, 1px , 0, 1px, 0);
  margin-bottom: 10px;

  .dynamic-title {
    padding: 5px $padding;
    color: $fontColorBlack;
    display: flex;
    @include halfpxline(0, $borderColor, 0, 0, 1px, 0);

    .title-name {
      flex: 1;
      padding-right: 5px;
      font-size: $fontSizeH4;
      @include ellipsisMore(1);
      // @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
      // text-indent: 0.5em;
    }

    .title-when-long {
      color: $fontColorGray;
      float: right;
      font-size: $fontSize;
    }
  }
  .dynamic-center {
    padding: 0 $padding;
    width: 100%;
    background-color: #fff;
    //  @include halfpxline(0, $borderColor, 0 , 0, 0, 0);
    p {
      text-indent: 1.5em;
      font-size: $fontSize;
      line-height: 1.75;
    }
    .dynamic-center-img {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-bottom: $padding;

      .dynamic-img-box {
        margin: 5px 0;
        width: 100px;
        height: 80px;
        background-color: $bgGray;
      }
    }
  }
  .dynamic-footer {
    //  @include halfpxline(0, #333, 5px, 0, 0, 0);
    border-top: $borderColor solid 1px;
    display: flex;
    // background-color: #333;
    .dynamic-footer-btn {
      flex-grow: 1;
      padding: 10px 0;
      text-align: center;
      font-size: $fontSizeTips;
      line-height: 1.75;
    }

    .comment {
      background: #fff url(~assets/img/class/comment2.png)no-repeat;
      background-size: 15%;
      background-position: 29px 9px;
    }

    .sign-up {
      background: #fff url(~assets/img/class/sign-up2.png)no-repeat;
      background-size: 15%;
      background-position: 29px 9px;
    }

    .thumbs-up {
      background: #fff url(~assets/img/class/thumbs-up.png)no-repeat;
      background-size: 15%;
      background-position: 29px 9px;
    }
  }
}
</style>