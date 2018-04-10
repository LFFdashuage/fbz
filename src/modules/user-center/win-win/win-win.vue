<!-- 
	共赢
 -->
<template>
	<div class="win-win" v-cloak>
    <swiper loop auto :list="demo06_list" :index="index" @on-index-change="onIndexChange"></swiper>

    <div class="establish-class-headr">
     <p>资源类型</p>
     <div class="label">
        <checker v-model="checkerValue" type="checkbox" default-item-class="label-default" selected-item-class="label-selected">
          <checker-item :value="item" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
        </checker>
		    <div><span>{{checkerValue}}</span></div>
      </div>
    </div>

    <div class="footer-box">
      <p>详细描述</p>
      <x-textarea :max="200" v-model="detailed" autosize placeholder="请输入详细描述"></x-textarea>
      <x-input title="联系方式" placeholder="请输入联系方式" type="tel" v-model="tel"></x-input>
    </div>

    <div class="btn" @click="submit">
    	提交
		</div>

  </div>
</template>

<script type="text/babel">
import {
  Swiper,
  SwiperItem,
  Checker,
  CheckerItem,
  XInput,
  Cell,
  XTextarea
} from "vux";
const baseList = [
  {
    url: "javascript:",
    img: "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg",
    title: "送你一朵fua"
  },
  {
    url: "javascript:",
    img: "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg",
    title: "送你一辆车"
  },
  {
    url: "javascript:",
    img: "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg",
    title: "送你一次旅行"
  }
];
const urlList = baseList.map((item, index) => ({
  url: "/class",
  img: item.img,
  title: `(可点击)${item.title}`
}));

export default {
  name: "winWin",
  components: {
    Swiper,
    SwiperItem,
    Checker,
    CheckerItem,
    XInput,
    Cell,
    XTextarea
  },
  data() {
    return {
      detailed: "",
      tel: "",
      demo06_list: urlList,
      index: 0,
      checkerValue: "",
      items1: [
        {
          key: "1",
          value: "哲学"
        },
        {
          key: "2",
          value: "商业"
        },
        {
          key: "3",
          value: "金融"
        },
        {
          key: "4",
          value: "金融资本"
        },
        {
          key: "5",
          value: "富班长"
        },
        {
          key: "6",
          value: "商业之道"
        }
      ]
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    // 获取资源类型列表
    fetchData() {
      let _this = this;

      _this.$http
        .post(
          "/api/xxx/xxx/xxx",
          _this.qs.stringify({
            customerId: this.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (
              e.data.data &&
              e.data.data.result &&
              e.data.data.result.length > 0
            ) {
              list = e.data.data.result.map(function(item, ind) {
                return {
                  id: item.id,
                  text: item.text
                };
              });
            }
            // console.log(list)
            _this.items1 = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    submit() {
      let _this = this;

      if (_this.detailed == "") {
        _this.$vux.toast.show({
          text: "请输入详细描述"
        });
      } else if (_this.tel == "") {
        _this.$vux.toast.show({
          text: "请输入联系方式"
        });
      } else if (_this.checkerValue == "") {
        _this.$vux.toast.show({
          text: "请选择标签"
        });
      } else {
        _this.$store.commit("updateLoadingStatus", { isLoading: true });
        _this.$http
          .post("/api/xxxx/xxxxx", _this.qs.stringify({}))
          .then(function(e) {
            _this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (e.data.code == 200) {
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