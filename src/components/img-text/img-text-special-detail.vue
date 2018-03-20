<template>
	<div class="special-detail" v-cloak>
    <!-- <el-audio :audio-data="imgTextData" :has-buy="imgTextData.isBuy"></el-audio>   -->
    <el-video :video-data="imgTextData" :has-buy="imgTextData.isBuy"></el-video>
		<!-- <img :src="imgTextData.images" alt=""> -->
		<h5>{{ imgTextData.termName }} <b> (共{{imgTextData.totalTerm}}期)</b> <span>{{imgTextData.termTypeName}}</span></h5>
    <div class="special-detail-rater"><rater v-model="imgTextData.termRank" disabled></rater>  {{imgTextData.termRank}}</div>
     <div class="price"> 现价：<span>¥{{ imgTextData.price }}</span> </div>
      <div class="original-price" >原价：¥{{ imgTextData.originalPrice }}</div>
      <p class="fiery">已播放{{ imgTextData.playCount }}次</p>
	</div>
</template>

<script type="text/babel">
import { Rater } from "vux";
import elAudio from "components/video/audio";
import elVideo from "components/video/video";
export default {
  name: "elImgTextSpecialDetail",
  components: {
    Rater,
    elAudio,
    elVideo
  },
  props: ["imgTextData","videoData"],
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.imgTextData)
      },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$border: 3px;

.special-detail {
  padding-top: 10px;
  width: 100%;
  border-bottom: $border solid $bgGray;
  line-height: 1;
  text-align: left;
  background: #fff;
  display: inline-block;

  img {
    width: 100%;
    height: 200px;
    margin: 0 auto;
  }
  .fiery {
    position: relative;
    bottom: 120px;
    left: 300px;
    color: #fff;
  }

  h5 {
    font-size: $fontSize;
    margin: 0;
    padding: 5px $padding 0;
    text-align: justify;
    @extend %clearfix;
    b {
      font-size: $fontSizeTips;
    }
    span {
      display: block;
      float: right;
      font-size: $fontSizeTips;
      // background-color:#666666;
      border: 1px solid $borderColor;
      color: $fontColorBlack;
      padding: 5px;
    }
  }
  .special-detail-rater {
    padding-left: $padding;
    @extend %clearfix;
    span {
      float: right;
      display: inline-block;
      font-size: $fontSizeTips;
      color: $fontColorBlack;
      padding: 5px $padding;
    }
  }
  .price {
    font-size: $fontSize;
    color: $fontColorBlack;
    padding: $padding/2 $padding;
    span {
      color: $colorRed;
      font-size: $fontSizeH4;
    }
  }
  .original-price {
    font-size: $fontSizeTips;
    color: $fontColorGray;
    padding-left: $padding;
  }
}
</style>