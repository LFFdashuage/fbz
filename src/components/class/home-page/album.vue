<!-- 
	班级相册
 -->
<template>
	<div class="album" v-cloak>
    <div class="album-box">
      <p>2018-02-23星期二</p>
      <div class="dynamic-center-img">
        <div class="dynamic-img-box" v-for="(item, index) in 7"  :key="index">
          <img src="" alt="图片">
        </div>
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

.album-box {
  p {
    padding: $padding;
  }
  .dynamic-center-img {
    padding-left: 3px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    margin-bottom: $padding;

    .dynamic-img-box {
      margin: 2px 1px;
      width: 90px;
      height: 90px;
      background-color: $bgGray;
    }
  }
}
</style>