<!-- 
	地址新增
 -->

<template>
	<div class="address-add" v-cloak>
		<group>
			<x-address :title="addressTitle" v-model="addressValue" :list="addressData" placeholder="请选择地址"></x-address>
      <x-input title="具体地址" placeholder="请输入具体地址" v-model="addressDetail"></x-input>
      <x-input title="姓名" placeholder="请输入姓名" v-model="name"></x-input>
      <x-input title="联系电话" placeholder="请输入联系电话" type="tel" v-model="tel"></x-input>
    	<div class="check">
    		<check-icon :value.sync="checkAddress">是否默认</check-icon>
    	</div>
		
    </group>
		<div class="btn">
    	<x-button type="primary" @click.native="submit">确定</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
import { Group, Cell, Selector, CheckIcon, XInput, XButton, XAddress, ChinaAddressV3Data } from "vux";

export default {
  name: "address-add",
  components: {
    Group, Cell, Selector, CheckIcon, XInput, XButton, XAddress, ChinaAddressV3Data
  },
  data() {
    return {
      addressTitle: "地址",
      addressValue: [],
      // addressData: ChinaAddressV3Data,
      // orderCode: this.$route.query.orderCode || "",
      addressData: [],
      addressDetail: "",
      name: "",
      tel: "",
      checkAddress: true
    };
  },
  mounted() {
    // 获取省信息列表
    this.getAddressData();
  },
  methods: {
    getAddressData() {
      let _this = this;
      _this.$http.post("/api/index/allAddress").then(function(e) {
        let data = e.data.data.map(function(item, index) {
          let transData = item;
          transData["value"] = item.id + "";
          if (item.pid != 100000) transData["parent"] = item.pid + "";
          return transData;
        });
        _this.addressData = data;
        console.log(data);
      });
    },
    submit() {
      let _this = this;
      if (_this.addressValue == "") {
        _this.$vux.toast.show({
          text: "请选择省市区"
        });
      } else if (_this.addressDetail == "") {
        _this.$vux.toast.show({
          text: "请输入具体地址"
        });
      } else if (_this.name == "") {
        _this.$vux.toast.show({
          text: "请输入姓名"
        });
      } else if (_this.tel.length != 11) {
        _this.$vux.alert.show({
          content: "请输入正确的手机号码"
        });
      } else {
        _this.$store.commit("updateLoadingStatus", { isLoading: true });
        _this.$http
          .post(
            "/api/userInfo/addCustomerAddress",
            _this.qs.stringify({
              addressId: "",
              customerId: _this.$store.state.user.userId,
              receiverName: _this.name,
              receiverPhone: _this.tel,
              receiverProvince: this.addressValue[0],
              receiverCity: this.addressValue[1],
              receiverArea: this.addressValue[2],
              receiverAddress: _this.addressDetail,
              defaultAddress: _this.checkAddress ? 1 : 0
            })
          )
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

.check {
  @include halfpxline(0, $borderColor, 1px, 0, 0, 0);
  padding: $padding;
}

.btn {
  margin-top: 40px;
  padding: $padding;
}
</style>
