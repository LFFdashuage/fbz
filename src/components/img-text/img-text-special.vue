<template>
	<div @click="goPage(imgTextData.termId)" class="special" v-cloak>
    <div>
      <div class="imges">
        <img :src="imgTextData.images" alt="">
        <div class="flames">{{ imgTextData.playCount }}</div>
        <div class="hat">{{ imgTextData.totalTerm }}节</div>
      </div>
	  	<h5>{{ imgTextData.termName }}</h5>
	  	<div class="title">{{ imgTextData.remark }}</div>
    </div>
	</div>
</template>

<script type="text/babel">
export default {
  name: "elImgTextSpecial",
  props: ["imgTextData"],
  data() {
    return {};
  },
  methods: {
    goPage(data) {
      this.$router.push({ name: "specialColumnDetail", query: { id: data } });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$border: 3px;

.special {
  // padding-top: 10px;
  width: 50%;
  line-height: 1;
  text-align: left;
  background: #fff;
  display: inline-block;
  .imges {
    width: 100%;
    height: 200px;
    padding: $padding;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      border-radius: 10px;
      // background-color: #666;
    }

    .flames {
      // height: 50px;
      display: inline-block;
      position: absolute;
      right: 25px;
      bottom: 20px;
      color: #fff;
      padding-left: 20px;
      background: url(../../assets/img/icon/flames.png)no-repeat;
      background-position: 0 -3px;
      background-size: auto 110%;
    }
    .hat {
      display: inline-block;
      position: absolute;
      left: 20px;
      top: 20px;
      color: #fff;
      padding-left: 20px;
      background: url(../../assets/img/icon/hat.png)no-repeat;
      background-position:0 -2px;
      background-size: auto 110%;
    }
  }

  h5,
  .title {
    padding: 5px $padding;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h5 {
    font-size: $fontSize;
    margin: 0;
    
  }

  .title {
    font-size: $fontSizeTips;
    color: $fontColorGray;
  }
}
</style>