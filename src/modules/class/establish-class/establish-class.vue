<!-- 
  创建班级 
 -->
<template>
  <div class="establish-class" v-cloak>
   <div class="establish-class-headr">
     <p>标签</p>
     <div class="label">
        <checker v-model="label" type="checkbox" default-item-class="label-default" selected-item-class="label-selected">
          <checker-item :value="item" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
        </checker>
		    <div><span>{{label}}</span></div>
      </div>
    </div>
    
		<group>
      <x-input title="班级姓名" placeholder="最多十个中文字" v-model="name"></x-input>
       <selector title="省" placeholder="请选择省份" :options="province.list" v-model="province.value" @on-change="provinceChange"></selector>
      <selector title="市" placeholder="请选择城市" :options="city.list" v-model="city.value" @on-change="cityChange"></selector>
      <selector title="区" placeholder="请选择区县" :options="county.list" v-model="county.value"></selector>
      <x-input title="简单介绍" placeholder="请输入简单介绍" v-model="simple"></x-input>
      <cell title='详细介绍'></cell>
      <x-textarea :max="200" v-model="detailed" autosize placeholder="请输入详细介绍"></x-textarea>
    </group>

		<div class="btn">
    	<x-button type="primary" @click.native="submit">确定</x-button>
		</div>
  
  </div>
</template>

<script>
import { Group, Cell, Selector, XTextarea, XInput, XButton, XAddress, ChinaAddressV3Data, Checker, CheckerItem } from "vux";
export default {
  name: "establishClass",
  components: {
    Group, Cell, Selector, XTextarea, XInput, XButton, XAddress, ChinaAddressV3Data, Checker, CheckerItem
  },
  data() {
    return {
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
      ],
      label: "",
      // orderCode: this.$route.query.orderCode || "",
      addressData: ChinaAddressV3Data,
      address: [],
      province: {
        value: "",
        list: []
      },
      city: {
        value: "",
        list: []
      },
      county: {
        value: "",
        list: []
      },
      detailed: "",
      name: "",
      simple: "",
      value: ""
    };
  },
  mounted() {
    // 获取省信息列表
    this.getAddressInfo("", 1, "province");
  },
  methods: {
    getAddressInfo(areaId, type, obj) {
      // type： 1为省，2为市，3为区
      // areaId: 父节点值
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/areaInfo",
          _this.qs.stringify({
            areaId: areaId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;

            if (res.length > 0) {
              _this[obj].list = res.map(function(item, index) {
                return {
                  key: item.areaId,
                  value: item.name
                };
              });
            } else {
              _this[obj].list = [];
            }

            if (type == 1) {
              _this.city.value = 0;
              _this.city.list = [];
              _this.county.value = 0;
              _this.county.list = [];
            }

            if (type == 2) {
              _this.county.value = 0;
              _this.county.list = [];
            }
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    provinceChange(val) {
      this.getAddressInfo(val, 2, "city");
    },
    cityChange(val) {
      this.getAddressInfo(val, 3, "county");
    },
    //提交表单
    submit() {
      let _this = this;

      // if (_this.county.value == "") {
      //   _this.$vux.toast.show({
      //     text: "请选择区县"
      //   });
      // } else

      if (_this.name == "") {
        _this.$vux.toast.text("请输入班级名！", "middle");
      } else if (_this.name.length > 10) {
        _this.$vux.toast.text("班级名过长！", "middle");
      } else if (_this.detailed == "") {
        _this.$vux.toast.text("请输入详细介绍！", "middle");
      } else if (_this.simple == "") {
        _this.$vux.toast.text("请输入简单介绍！", "middle");
      }else if (_this.label == "") {
        _this.$vux.toast.text("请选择标签！", "middle");
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.btn {
  margin-top: 40px;
  padding: $padding;
}
.establish-class-headr {
  p {
    padding: $padding;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
  .label {
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
</style>