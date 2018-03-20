<!-- 
	新商城创建订单页面
 -->

<template>
	<div class="goods-order">
    <!-- 收货地址 -->
		<template v-if="address.address">
			<div class="address" @click="addressChoose">
				<div class="address-msg">
					<span class="address-man">{{ address.name }}</span>
					<span class="address-tel">{{ address.phone | centerToStar(3, 4)}}</span>
				</div>
				<div class="address-detail">
					<i class="address-icon"></i>
					 {{ address.address }}
					<i class="angle-icon fa fa-angle-right"></i>
				</div>
			</div>
		</template>
 
		<template v-else>
			<div class="btns">
				<x-button class="order-add-address fa fa-plus" @click.native="addressAdd">添加收货地址</x-button>
			</div>
		</template>

		<div class="card-product-list">
			<el-card-goods class="card-mall-padding" :card-mall-data="goodsInfo" :cart-num="goodsInfo.num" @on-num-change="onNumChange"></el-card-goods>
    </div>

    <div class="footer-box">
      <div :class="{ 'footer-icon' : walletIcon, 'footer-icon-tow': !walletIcon}" @click="walletAmount" class="footer-name">奖学金</div>
	     <div class="discount-number">¥{{ cartData.wallet | numToCash}}</div>
    </div>
	
		<el-cart-goods :cart-data="cartData"></el-cart-goods>
	</div>
</template>

<script type="text/babel">
import { XButton } from "vux";
import elCardGoods from "components/card/card-goods";
import elCartGoods from "components/cart/cart-goods";

export default {
  name: "goodsOrder",
  components: {
    XButton,
    elCardGoods, elCartGoods
  },
  data() {
    return {
      walletIcon: false,
      goodsInfo: {
        id: this.$route.query.id,
        num: 1,
        description: "",
        productCode: "",
        productCount: "",
        productName: "",
        productPrice: "",
        addressId: "",
        img: ""
      },
      address: {
        address: "",
        name: "",
        phone: "",
        id: ""
      },
      cartData: {
        wallet: 0,
        money: 0,
        num: 1,
        addressId: "",
        id: this.$route.query.id,
        walletStatus: 0
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;

      this.getAddress();
      this.getDetail();
    },
    getDetail() {
      let _this = this;

      _this.$http
        .post(
          "/api/goods/detail",
          _this.qs.stringify({
            id: _this.goodsInfo.id
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;

            _this.goodsInfo.description = res.remark;
            _this.goodsInfo.productName = res.name;
            _this.goodsInfo.productPrice = res.price;
            _this.goodsInfo.img = res.images;

            _this.cartData.money =
              _this.goodsInfo.num * _this.goodsInfo.productPrice;
            _this.getScholarship();
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    addressChoose() {
      this.$router.push({
        name: "address",
        query: { goodsId: this.goodsInfo.id, url: "mallOrder" }
      });
    },
    addressAdd() {
      this.$router.push({
        name: "addressAdd",
        query: { goodsId: this.goodsInfo.id, url: "mallOrder" }
      });
    },
    getAddress() {
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/getDefaultAddressInfo",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;

            _this.address = {
              address: res.receiverAddress,
              name: res.receiverName,
              phone: res.receiverPhone,
              id: res.id
            };

            _this.cartData.addressId = res.id;
          }
        });
    },
    onNumChange(val) {
      let _this = this;
      _this.cartData.money = val * _this.goodsInfo.productPrice;
      _this.cartData.num = val;
    },

    walletAmount() {
      let _this = this;
      if (this.walletIcon == false) {

        this.walletIcon = true;
        _this.cartData.walletStatus = 1;
        if (_this.cartData.wallet > _this.cartData.money) {
          _this.cartData.money = 0;
        } else {
          _this.cartData.money = _this.cartData.money - _this.cartData.wallet;
        }

      } else {
        _this.onNumChange(_this.cartData.num);
        _this.cartData.walletStatus = 0;
        this.walletIcon = false;
      }
    },

    // 拉取奖学金，抵用券
    getScholarship() {
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/userAttribute",
          this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            lessonId: _this.goodsInfo.id
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;
            _this.cartData.wallet = res.walletAmount || 0;
            // console.log(res);
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
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

  body{
     background-color: $bgGray;
  }

.address {
  padding: $paddingTop $padding $paddingTop;
  padding-left: $padding + 30px;
  padding-right: $padding + 20px;
  line-height: 1.75;
  background: #fff url("~assets/img/shop-cart/location-bg.png") repeat-x;
  background-position: bottom;

  &.active {
  }

  .address-msg {
    font-size: $fontSizeH4;
    display: flex;
    color: $fontColorBlack;

    .address-man {
      flex: 1;
      @include ellipsisOne();
    }

    .address-tel {
      width: 15em;
      text-align: left;
      display: block;
    }
  }

  .address-detail {
    position: relative;
    text-align: justify;
    font-size: $fontSizeH4;

    .fa {
      position: absolute;
      top: 50%;
      margin-top: -0.75em;
      line-height: 1.5;
      font-size: $fontSizeH3;
    }

    .address-icon {
      position: absolute;
      top: 50%;
      left: -20px;
      width: 15px;
      height: 20px;
      margin-top: -10px;
      margin-left: -10px;
      background: url("~assets/img/shop-cart/location.png") center no-repeat;
      background-size: 80%;
      display: block;
    }

    .angle-icon {
      right: -20px;
    }
  }
}

.goods-order{
  height: 100%;
  background-color: $bgGray;
}

.order-add-address {
  background: $colorOrange;
  color: #fff;

  &:not(.weui-btn_disabled):active {
    color: #fff;
    background: $colorOrange;
  }
}

.card-product-list{
  margin-top: $padding;
}
.footer-box {
  margin-top: $padding;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  @include halfpxline(0, $bgGray, 1px, 0, 1px, 0);

  .footer-name {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    width: 93px;
    font-size: 12px;
  }
  .footer-icon {
    background: #fff url(~assets/img/icon/Selected01.png) no-repeat;
    background-position: 13px center;
    background-size: auto 60%;
  }

  .footer-icon-tow {
    background: #fff url(~assets/img/icon/Selected02.png) no-repeat;
    background-position: 13px center;
    background-size: auto 60%;
  }
  .discount-number {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 30px;
    color: $colorRedDeep;
    font-size: $fontSizeH4;
  }
}
</style>