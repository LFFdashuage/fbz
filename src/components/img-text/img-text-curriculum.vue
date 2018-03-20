<!-- 
	课程下单图文混排
 -->
<template>
	<div class="img-text-curriculum" v-cloak>
    
    <div class="header">
      <img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
      <h5 v-if="imgTextData.name" class="title">{{ imgTextData.name }}</h5>
      <p  v-if="imgTextData.price" class="price">¥：{{ imgTextData.price | numToCash}}元</p>
    </div>

    <div class="text">
				<p v-if="imgTextData.date" class="address fa fa-calendar">{{ imgTextData.date }}</p>
				<p v-if="imgTextData.address" class="address fa fa-map-marker">{{ imgTextData.address }}</p>
		</div>

	</div>
</template>

<script type="text/babel">
export default {
  name: "elImgText",
  props: ["imgTextData"],
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

.img-text-curriculum {
  .header {
    background-color: #fff;
    padding: $padding $padding 5px;
    margin-bottom: 5px;
    .title {
      font-size: $fontSize;
      margin: 5px 0;
      @include ellipsisMore(1);
    }
    .img {
      width: 100%;
      height: 200px;
    }
    .price {
      color: $colorRedDeep;
    }
  }

  .text {
    line-height: 1.75;
    background-color: #fff;
    .title {
      font-size: $fontSize;
      margin-bottom: 10px;
      @include ellipsisMore(1);
    }
    p {
      float: inherit;
      display: block;
      padding: $padding 20px;
      @include halfpxline(0, $borderColor, 1px , 0, 0, 0);
    }
    .address {
      @include ellipsisOne();
      &:before {
        width: 1.4em;
        padding-right: 2em;
        text-align: center;
        display: inline-block;
        color: $fontColorGray;
      }
    }
  }
}
</style>