<!-- 
	老师列表
 -->

<template>

	<div class="teacher-info" @click="goPage(index,teacherInfoData.authorId,teacherInfoData.images,teacherInfoData.price,1)" v-cloak>
    <div class="teacher-img">
      <img :src="teacherInfoData.images" alt="">
    </div>
    <div class="teacher-info-text">
      <div class="teacher-name">{{ teacherInfoData.name }}</div>
      <div class="teacher-remark">{{teacherInfoData.remark}}</div>
		  <div class="teacher-already-bought" v-if="this.status == true " >已购买</div>
      <div class="teacher-price" v-else>￥{{ teacherInfoData.price }}</div>
    </div>
	</div>
</template>

<script type="text/babel">
export default {
  name: "teacherInfo",
  props: ["teacherInfoData", "index"],
  components: {},
  data() {
    return {
      // teacherInfoData: {
      // 	images: 'http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/bsc_box/bscImage37.png',
      // 	name: '霍山鹰',
      // 	price: '12',
      // }
      status:false
    };
  },
  mounted() {
    this.status  = this.arrContain( this.$store.state.user.authorIds,  this.teacherInfoData.authorId.toString() )
  },
  methods: {
    goPage(index, data, images, price, teachertype) {
      if (  this.status == true ) {
           this.$vux.toast.text('已购买过该老师', 'middle')
      } else {
        // console.log("老师Id" + "[" + data + "]");
        this.$emit("teacherinfo", index, data, images, price, teachertype);
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

.teacher-info {
  float: left;
  width: 100%;
  height: 80px;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  padding-left: 30px;
  background: #fff url(../../assets/img/icon/Selected02.png) no-repeat;
  background-position: 10px center;
  background-size: auto 30%;
  display: flex;

  &.teacher-info-selected {
    background-image: url(~assets/img/icon/Selected01.png);
  }

  .teacher-img {
    width: 80px;
    height: 80px;
    padding: $padding;
    img{
      height: 100%;
      border-radius: 50%;
    }
    
  }

  .teacher-info-text {
    flex: 1;
    display: flex;
    align-items: center;
    .teacher-name {
      width: 60px;
      font-size: $fontSize;
      @include ellipsisOne();
    }
    .teacher-remark {
      width: 140px;
      font-size: $fontSizeTips;
      @include ellipsisOne();
    }
    .teacher-price {
      width: 80px;
      text-align: center;
      font-size: $fontSizeTips;
      color: #970021;
    }
    .teacher-already-bought{
      width: 80px;
      text-align: center;
      font-size: $fontSizeTips;
      color: #888;
    }
  }
}
</style>