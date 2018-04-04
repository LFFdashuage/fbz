<!-- 
	班级
 -->
<template>
	<div class="class-info" v-cloak @click="goPage('class')">
      <div class="class-img">
        <img src="~assets/img/audio.png" alt="">
      </div>

      <div class="class-box">
        <p class="name">上海六年六班</p>
        <p class="classmate"><span>同学：89</span><span>班费：8888</span></p>
        <p class="remark">共同学习，共同进步，共同发展！</p>
      </div>

      <div class="class-btn">
        <div class="text-tisp">
          99分
        </div>
        <div v-if="typeData>0" class="btn">
          申请
        </div>
      </div>
    </div>
</template>

<script type="text/babel">
export default {
  name: "elImgTextClassList",
  props: ["imgTextData", "typeData"],
  data() {
    return {
      
    };
  },
  methods: {
    goPage(url) {
      // this.$router.push({ name: url, query: query })
      this.$router.push({ name: url });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.class-info {
  padding: 8px $padding;
  display: flex;
  align-items: center;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

  .class-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .class-box {
    padding-left: $padding;
    flex: 1;
    flex-direction: row;
    align-items: center;
    position: relative;
    color: $fontColorGray;

    .name {
      font-size: $fontSizeH4;
      @include ellipsisMore(1);
      color: #333;
    }

    .classmate {
      font-size: $fontSize;
      line-height: 1.75;

      span {
        margin-right: 20px;
      }
    }

    .remark {
      @include ellipsisMore(1);
      font-size: $fontSizeTips;
      line-height: 1.75;
    }
  }

  .class-btn {
    width: 100px;
    flex-direction: column;
    // align-items: center;
    .text-tisp {
      width: 100%;
      color: #333;
      text-align: center;
      background: #fff url(~assets/img/class/fire.png)no-repeat;
      background-size: 15%;
      background-position: 85% 2px;
    }
    .btn {
      width: 80px;
      background-color: #907351;
      margin: 5px auto 0;
      padding: 2px 0;
      color: #fff;
      border-radius: 15px;
      text-align: center;
      font-size: $fontSize;
    }
  }
}
</style>