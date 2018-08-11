<!-- 
	班级相册
 -->
<template>
	<div class="album" v-cloak>
    <div class="comment-box" >

      <div class="comment-img">
        <img src="~assets/img/audio.png" alt="">
      </div>

      <div class="comment-info">
        <p class="name">王者荣耀</p>
        <p class="comment">  可是你读到最后，发现这个时间对应了某个人生的节点。
        发现这个时间对应了某个人生的节点。</p>
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
.comment-box {
  padding: $padding;
  display: flex;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

  .comment-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;
    // margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .comment-info {
    padding-left: $padding;
    flex: 1;
    flex-direction: row;
    align-items: center;
    position: relative;

    .name {
      font-size: $fontSizeH4;
      @include ellipsisMore(1);
    }

    .comment {
      font-size: $fontSize;
      line-height: 1.75;
      @include ellipsisMore(1);
    }
    
    .time {
      text-align: right;
      font-size: $fontSizeTips;
      line-height: 1.75;
      color: $fontColorGray;
    }
  }
}
</style>