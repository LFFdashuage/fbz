<!-- 
	同学图文混排
 -->
<template>
    <div class="img-text-box" v-cloak>
      <div class="class-img">
        <img src="~assets/img/audio.png" alt="">
      </div>

      <div class="class-box">
        <p class="name">{{imgTextData.name}}</p>
        <p class="position">{{imgTextData.position}}</p>
        <p class="remark">{{imgTextData.remark}}</p>
      </div>

      <div class="class-btn">
        <div class="btn follow"  :class="{ 'follow' : isIcon, 'follow-tow': !isIcon}" @click="follow(imgTextData.id)">{{text}}</div>
        
        <div @click="deletebtn(imgTextData.id,indexData)" class="btn delete">
          移除
        </div>
      </div>

	</div>
</template>

<script type="text/babel">
export default {
  name: "elImgTextClassMate",
  props: ["imgTextData", "indexData"],
  data() {
    return {
      text: "关注",
      isIcon: false
    };
  },
   mounted() {
     let _this = this;
    if(_this.imgTextData.follow == 1){
      _this.isIcon=false;
      _this.text = "关注";
    }else{
      _this.isIcon=true;
      _this.text = "已关注";
    }
  },
  methods: {
    goPage(url) {
      // this.$router.push({ name: url, query: query })
      this.$router.push({ name: url });
    },
    //关注
    follow(id) {
      let _this = this;
      // _this.$http
      //   .post(
      //     "/api/xxxx/xxxx",
      //     _this.qs.stringify({
      //       customerId: _this.$store.state.user.userId,
      //        id:id
      //     })
      //   )
      //   .then(function(e) {
      //     if (e.data.code == 200) {
      //       _this.$vux.toast.show({
      //         text: e.data.msg
      //       });
      //       _this.isIcon = !_this.isIcon;
      //     } else {
      //       _this.$vux.alert.show({
      //         content: e.data.msg
      //       });
      //     }
      //   });
      // _this.isIcon = !_this.isIcon;
      if (_this.isIcon == false) {
        _this.isIcon = true;
        _this.text = "已关注";
      } else if (_this.isIcon == true) {
        _this.isIcon = false;
        _this.text = "关注";
      }
    },
    //删除
    deletebtn(id, ind) {
      let _this = this;
      _this.$emit("deletebtn", ind);
      // _this.$http
      //   .post(
      //     "/api/xxx/xxx/xxx",
      //     _this.qs.stringify({
      //       id: id
      //     })
      //   )
      //   .then(function(e) {
      //     if (e.data.code == 200) {
      //       _this.$emit("deletebtn", ind);
      //     } else {
      //       _this.$vux.alert.show({
      //         content: e.data.msg
      //       });
      //     }
      //   });
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
  padding: 8px 0;
  display: flex;
  align-items: center;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

  .class-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .class-box {
    padding-left: $padding;
    flex: 1;
    flex-direction: row;
    align-items: center;
    position: relative;
    color: $fontColorGray;

    .name {
      font-size: $fontSizeH4;
      @include ellipsisMore(1);
      color: #333;
    }

    .position {
      font-size: $fontSizeTips;
      line-height: 1.75;
      @include ellipsisMore(1);
    }

    .remark {
      @include ellipsisMore(1);
      font-size: $fontSize;
      line-height: 1.75;
    }
  }

  .class-btn {
    width: 100px;
    flex-direction: column;
    // align-items: center;

    .text-tisp {
      width: 100%;
      color: #333;
      text-align: center;
      background: #fff url(~assets/img/class/fire.png)no-repeat;
      background-size: 15%;
      background-position: 85% 2px;
    }

    .btn {
      width: 80px;
      margin: 5px auto 0;
      padding: 2px 0;
      color: #fff;
      border-radius: 15px;
      text-align: center;
      font-size: $fontSize;
    }

    .follow {
      background-color: #A88A68;
    }

    .follow-tow {
      background-color: #5d8cfc;
    }

    .delete {
      background-color: #ff685c;
    }
  }
}
</style>