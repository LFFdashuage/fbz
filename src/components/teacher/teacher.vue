<!-- 
	讲师和机构
 -->

<template>
  <div class="content-box">
    <div class="table-content-title-tacher">
      <p class="title-name">讲师介绍<span class="title-when-long">{{authorData.companyName}}</span></p>
	  </div>

    <div ref="teacher" :class="['showauthor', {'active': showMore}]">
      <div class="teacher">
        <div class="author-img">
          <img :src="authorData.img" alt="头像">          

          <div>
            <span>{{ authorData.name }}</span>
            <label>{{ authorData.label }}</label>
          </div>
        </div>
        <div class="rich-html" v-html="authorData.content"></div>
      </div>

      <!--机构介绍-->
      <div class="content-company-box" v-if="authorData.companyContent">
        <div>
          <img class="company-img" :src="authorData.companyImg" alt="">
          <div class="rich-html" v-html="authorData.companyContent"></div>
        </div>
      </div>
    </div>

    <div v-show="showMore" class="mui-text-center imgbtn" @click="showMore = !showMore">
      <div><divider class="open-color">展开更多</divider></div>
    </div>
  </div>
</template>

<script type="text/babel">
import { Divider } from "vux";

export default {
  name: "teacher",
  props: ["authorData"],
  components: {
    Divider
  },
  data() {
    return {
      showMore: false
    };
  },
  watch: {
    authorData() {
      this.show();
    }
  },
  mounted() {
    let heightTeacher = this.$refs.teacher.offsetHeight;
    if (heightTeacher > 100) {
      this.showMore = true;
    }
  },
  methods: {
    show() {
      let _this = this;
      this.$nextTick(function() {
        let heightTeacher = this.$refs.teacher.offsetHeight;
        if (heightTeacher < 100) {
          _this.showMore = false;
        } else {
          _this.showMore = true;
        }
        // console.log(heightTeacher, this.$refs.teacher, 111);
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

.content-box {
  @include uiBorderTop();
  padding: $padding $padding 0;
  background: #fff;

  .teacher {
    @include halfpxline(0, $borderColor, 0, 0, 1px, 0);
    .author-img {
      @extend %clearfix;
      margin-bottom: $padding;
      display: flex;
  
      img {
        width: $headerH;
        height: $headerH;
        border-radius: 50%;
      }

      div {
        flex: 1;
        padding-top: 10px;
        padding-left: 1em;
        line-height: 1.75;
      }
      span {
        color: $fontColorBlack;
        display: block;
      }
    }
  }
  .company-img {
    height: 70px;
  }

  .table-content-title-tacher {
    padding: $padding 0;
    line-height: 1;
    font-size: $fontSizeH4;
    color: $fontColorBlack;

    .title-name {
      display: block;
      @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
      text-indent: 0.5em;
    }
    .title-when-long {
      color: $fontColorGray;
      float: right;
    }
  }

  .showauthor {
    background: #fff;
    margin-top: 5px;
    height: auto;

    &.active {
      height: 100px;
      overflow: hidden;
    }
  }

  .imgbtn {
    text-align: center;
    div {
      width: 150px;
      margin: 0 auto;
      // border: 1px solid $colorYellowEasyDeep;
      display: inline-block;
    }
  }
}

.open-color {
  color: $colorYellowEasy;
}
</style>