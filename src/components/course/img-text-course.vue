<!-- 
	新课程图文混排
 -->
<template>
	<div class="img-text img-text-column" @click="goPage({name: 'courseNewDetail', query: {periodsId: imgTextData.id}})" v-cloak>

		<div class="img-text-img">
			<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="图片">
		</div>

		<div class="text">
			<h5 class="title">{{ imgTextData.title }}</h5>
      <div class="time">{{imgTextData.time}}</div>

			<p>{{ imgTextData.address }} 
        <span v-if="typeData==1">剩余{{ imgTextData.surplus }}名</span>
      </p>

			<div class="text-info">
				<p class="text-info-term">
					<!-- <i>￥</i> -->
					<span class="price">￥{{ imgTextData.price | numToCash }}</span>
					<span class="original-price">¥{{ imgTextData.originalPrice | numToCash }}</span>
				</p>

          <span v-if="typeData==1" class="foot-btn">立即报名</span>  
			</div>

		</div>

	</div>
</template>

<script type="text/babel">
export default {
  name: "elImgTextCourse",
  props: ["imgTextData", "typeData"],
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

// @import '~assets/css/img-text';

.img-text-column {
  padding: $padding;
  .img-text-img{
    background-color: $colorGray;
    img{
      height:100%;
       width: 100%;

    }
  }
  .title {
    @include ellipsisMore(1);
    font-size: $fontSize;
    color: $fontColorBlack;
    margin: 0;
  }
  .time {
    font-size: $fontSizeTips;
  }
  .text {
    // position: relative;
    line-height: 1.75;

    & > p {
      color: $fontColorGray;
      font-size: $fontSizeTips;
      // margin-top: 18px;
      span {
        float: right;
      }
    }
  }
  .text-info {
    padding: 10px $padding 0 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 1.75;

    span {
      float: right;
      // padding-top: 10px;
      // padding-right: $padding;
      color: $fontColorGray;
    }

    .price,
    i {
      float: left;
      font-style: normal;
      color: $colorRedDeep;
    }

    .price {
      margin: 0 0.5em 0 0;
      font-size: $fontSizeH4;
    }
    .original-price {
      text-decoration: line-through;
      margin-top: 5px;
      font-size: $fontSizeTips;
    }

    .text-info-term {
      float: left;
    }
    .foot-btn {
      font-size: $fontSizeTips;
      border-radius: 15px;
      padding: 1px 20px;
      background-color: $colorRedDeep;
      color: #fff;
    }
  }
}
</style>