<!-- 
	共赢
 -->
<template>
	<div class="win-win" v-cloak>
    <swiper loop auto :list="swiperImg" :index="index" @on-index-change="onIndexChange"></swiper>

    <div class="establish-class-headr">
     <p>资源类型</p>
     <div class="label">
        <checker v-model="checkerValue" default-item-class="label-default" radio-required selected-item-class="label-selected">
          <checker-item :value="item.id" v-for="(item, index) in checkerList" :key="index">{{item.name}}</checker-item>
        </checker>
      </div>
    </div>

    <div class="footer-box">
      <div class="textarea">
        <p>详细描述</p>
        <x-textarea :max="300" v-model="detailed" autosize placeholder="请输入详细描述！300个中文字以内！"></x-textarea>
      </div>
      
      <!-- <x-input title="联系方式" placeholder="请输入联系方式" type="tel" v-model="contactWay"></x-input> -->
      <x-input type="tel" title="联系方式" v-model="contactWay" placeholder="请输入联系方式" class="weui-vcode">
        <el-verification-code :tel="contactWay" code-type="bangding" slot="right"></el-verification-code>
      </x-input>

      <x-input title="验证码" placeholder="请输入验证码" type="tel" v-model="code"></x-input>
    </div>

    <div class="btn" @click="submit">
    	提交
		</div>

  </div>
</template>

<script type="text/babel">
import { Swiper, SwiperItem, Checker, CheckerItem, XInput, Cell, XTextarea, XButton } from "vux";
import elVerificationCode from "components/verification-code/verification-code";
export default {
  name: "winWin",
  components: {
    Swiper, SwiperItem, Checker, CheckerItem, XInput, Cell, XTextarea, XButton,
    elVerificationCode
  },
  data() {
    return {
      detailed: "",
      contactWay: "",
      code: "",
      // demo06_list: urlList,
      swiperImg: [],
      index: 0,
      checkerValue: "",
      checkerList: [
        // {
        //   id: "1",
        //   name: "哲学"
        // },
        // {
        //   id: "2",
        //   name: "商业"
        // },
      ]
    };
  },
  mounted() {
    this.getAdvertisement();
    this.fetchData();
  },
  methods: {
    // 获取top广告
    getAdvertisement() {
      let _this = this;
      _this.$http
        .post(
          "/api/index/new/advertisement",
          _this.qs.stringify({
            positionType: 3
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (e.data.data && e.data.data.length > 0) {
              list = e.data.data.map(function(item, ind) {
                return {
                  img: item.images,
                  id: item.termId,
                  // url: _this.routerUrl + "?id=" + item.termId,
                  title: item.termName
                };
              });
            }
            // console.log(list);
            _this.swiperImg = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    // 获取资源类型列表
    fetchData() {
      let _this = this;
      _this.$http
        .post("/api/index/resourseTypeList", _this.qs.stringify({}))
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (e.data.data && e.data.data.length > 0) {
              list = e.data.data.map(function(item, ind) {
                return {
                  id: item.id,
                  name: item.name
                };
              });
            }
            // console.log(list);
            _this.checkerList = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    //提交表单
    submit() {
      let _this = this;

      if (_this.checkerValue == "") {
        _this.$vux.toast.show({
          text: "请选择资源类型"
        });
      } else if (_this.detailed == "") {
        _this.$vux.toast.show({
          text: "请输入详细描述"
        });
      } else if (_this.contactWay.length != 11) {
        _this.$vux.alert.show({
          content: "请输入正确的手机号码"
        });
      } else if (_this.code == "") {
        _this.$vux.toast.show({
          text: "验证码不可为空！"
        });
      } else {
        _this.$store.commit("updateLoadingStatus", { isLoading: true });
        _this.$http
          .post(
            "/api/index/saveResourse",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              resourceTypeId: _this.checkerValue,
              otherResourceType: null,
              remark: _this.detailed,
              contactWay: _this.contactWay,
              verificationCode: _this.code
            })
          )
          .then(function(e) {
            _this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (e.data.code == 200) {
              _this.$vux.toast.text(e.data.msg, "middle");
              _this.$router.go(-1);
              // _this.$router.push({ name: _this.$route.query.url, query: { orderCode: _this.orderCode } });
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      }
    },

    onIndexChange(index) {
      this.index = index;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.establish-class-headr {
  // padding: $padding;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

  p {
    padding: $padding;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }

  .label {
    // background-color: #999;
    // height: 50px;
    width: 100%;
    padding: $padding;

    .label-default {
      margin: 5px;
      border: 1px solid $bgGray;
      padding: 2px 10px;
      border-radius: 15px;
      background-color: $bgGray;
    }

    .label-selected {
      border: 1px solid $colorYellowEasy;
    }
  }
}

.footer-box {
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  .textarea {
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }

  p {
    padding: $padding;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
}

.btn {
  width: 200px;
  margin: 40px auto 0;
  // margin-top: 40px;
  text-align: center;
  background-color: #5bafff;
  color: #fff;
  padding: $padding - 5;
  border-radius: 20px;
  font-size: $fontSizeH3;
}
</style>