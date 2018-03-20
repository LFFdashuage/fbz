<!--收藏图文混排-->
<template>
	<div v-cloak>
    <div @click="goPage(imgTextData.goodsId,imgTextData.goodsType)">
      <div class="img-text-box">
        <div class="header">

          <div class="header-img">
            <img :src="imgTextData.images" alt="">
            <p class="type">{{imgTextData.goodsTypeText}}</p>
          </div>

          <div class="content">
            <p class="name">{{imgTextData.name}}</p>
            <div class="rater" v-if="imgTextData.goodsType==1||imgTextData.goodsType==2||imgTextData.goodsType==3">
              <rater :active-color="wordBook.raterConfig.activeColor" :font-size="wordBook.raterConfig.fontSize" v-model="imgTextData.rank" disabled></rater>
              {{imgTextData.rank.toFixed(1)}}
            </div>
            <div class="empty" v-else>
              
            </div>

            <p v-if="imgTextData.goodsType==3||imgTextData.goodsType==7" class="footer">
              <span></span>
              <span>{{imgTextData.viewCount}}人浏览</span>
            </p>
            <p v-else-if="imgTextData.goodsType==4||imgTextData.goodsType==5||imgTextData.goodsType==6" class="footer">
              <span>主讲人：{{imgTextData.authorName}}</span>
              <span>剩余人数:{{imgTextData.remainingNumber}}</span>
            </p>
            <p v-else class="footer">
              <span>主讲人：{{imgTextData.authorName}}</span>
              <span>{{imgTextData.viewCount}}人浏览</span>
            </p>
          </div>

        </div>
      </div>
    </div>
</div>
</template>

<script type="text/babel">
import { Rater } from "vux";
export default {
  name: "elImgText",
  props: ["imgTextData"],
  components: { Rater },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    goPage(data, type) {
      if (type == 1) {
        if(this.imgTextData.goodsTypeText=="音频"){
          this.$router.push({ name: "courseTypeDetail", query: { id: data ,type:"audio"}}); //音频
        }else{
          this.$router.push({ name: "courseTypeDetail", query: { id: data ,type:"video"}}); //视频
        }
      } else if (type == 2) {
        this.$router.push({ name: "specialColumnDetail", query: { id: data } }); //专栏
      } else if (type == 3) {
        this.$router.push({ name: "mallDetail", query: { id: data } }); //商品
      } else if (type == 4) {
        this.$router.push({ name: "courseDetail", query: { periodsId: data } }); //课程
      } else if (type == 5) {
        this.$router.push({
          name: "courseDetail",
          query: { courseCode: data }
        }); //套餐
      } else if (type == 6) {
        this.$router.push({
          name: "activityDetail",
          query: { activityId: data }
        }); //活动
      } else if (type == 7) {
        this.$router.push({ name: "newsDetail", query: { id: data } }); //头条
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.img-text-box {
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  width: 100%;
  .header {
    padding: $padding;
    display: flex;
    justify-content: space-between;
    .header-img {
      background-color: #666;
      position: relative;
      img {
        width: $collectionImgW;
        height: $collectionImgH;
      }
      .type {
        position: absolute;
        left: 5px;
        top: 5px;
        color: #fff;
        display: inline-block;
        padding: 1px 5px;
        background-color: #fff;
        border-radius: 5px;
        font-size: $fontSizeTips;
        color: $colorRedDeep;
      }
    }
    .content {
      flex: 1;
      width: 100%;
      // background-color: #888;
    }
  }
}
.content {
  padding: 5px $padding;
  .name {
    @include ellipsisMore(1);
    font-size: $fontSize;
    color: $fontColorBlack;
  }
  .rater {
    margin-bottom: $padding;
    color: $fontColor;
  }
  .empty{
    
    height: 30px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    color: $fontColorGray;
  }
}
</style>