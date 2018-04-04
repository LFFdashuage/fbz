<!-- 
	班级相册
 -->
<template>
	<div class="album" v-cloak>
    <div class="sign-up-box">
      
      <div class="sign-up-img">
        <img src="~assets/img/audio.png" alt="">
      </div>

      <div class="sign-up-info">
        <p class="name">王者荣耀</p>
        <p class="time">03/16 10:35</p>
      </div>

    </div>
	</div>
</template>

<script type="text/babel">
export default {
  // props: ["infoData"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.sign-up-box {
  padding: $padding;
  display: flex;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

  .sign-up-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;
    // margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .sign-up-info {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .name {
      flex: 1;
      padding-left: $padding;
      font-size: $fontSizeH4;
      @include ellipsisMore(1);
    }
    .time {
      position: relative;
      right: 0;
      font-size: $fontSizeTips;
      line-height: 1.75;
      color: $fontColorGray;
    }
  }
}
</style>