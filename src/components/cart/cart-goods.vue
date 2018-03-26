<!-- 
	新商城提交订单
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div class="cart cart-pay">
			<p>实际支付:<span><i>￥</i>{{ cartData.money | numToCash }}</span></p>
			<div @click="goBalance" class="pay-order">去支付</div>
		</div>
	</div>
</template>

<script type="text/babel">
import { TransferDom } from "vux";
import { mapState } from "vuex";

export default {
  name: "cartGoods",
  directives: {
    TransferDom
  },
  props: ["cartData"],
  data() {
    return {
      title: "购物车按钮",
      orderInfo: {
        orderId: "",
        orderType: "",
        type: ""
      },
      cartPay: {
        num: 1,
        money: "60",
        orderCode: ""
      }
    };
  },
  computed: {
    ...mapState({
      cart: state => state.cart
    })
  },
  mounted() {
    // console.log(this.cartData, "讲学进");
  },
  methods: {
    goBalance() {
      if (this.cartData.addressId) {
        if (!this.isLogin()) return false;
        let _this = this;
        this.$http
          .post(
            "/api/goods/order/confirm",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              goodsId: _this.cartData.id,
              num: _this.cartData.num,
              addressId: _this.cartData.addressId,
              voucherStatus: 0,
              remark: "",
              walletStatus: _this.cartData.walletStatus
            })
          )
          .then(function(e) {
            if (e.data.code == 200) {
              _this.orderInfo = {
                orderId: e.data.data.orderId,
                orderType: e.data.data.orderType,
                type: e.data.data.type
              };
              // 如果不使用奖学金和抵用券就直接调起微信支付。
              if (_this.cartData.walletStatus == 1) {
                // 金额大于奖学金，调微信支付
                if (_this.cartData.money > _this.cartData.wallet) {
                  _this.payPrepar();
                } else {
                  _this.enterPassword();
                }
              } else {
                if (_this.cartData.money == 0) {
                  _this.enterPassword();
                } else {
                  _this.payPrepar();
                }
              }
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      } else {
        this.$vux.alert.show({
          content: "请选择收货地址！"
        });
      }
    },

    enterPassword() {
      let _this = this;
      if (!_this.isPassword()) {
        return;
      }
      this.$vux.confirm.prompt("请输入支付密码", {
        show: _this.cartPay.password,
        title: "支付密码",
        inputAttrs: {
          type: "password",
          value: ""
        },

        // 组件除show外的属性
        onCancel() {},
        onConfirm(val) {
          if (val) {
            _this.getPublicKey(val);
          } else {
            _this.$vux.alert.show({
              content: "密码不能为空",
              onHide() {
                _this.enterPassword();
              }
            });
          }
        }
      });
    },
    pay(pwd) {
      let _this = this;

      if (pwd) {
        _this.$store.commit("updateLoadingStatus", { isLoading: true });
        _this.$http
          .post(
            "/api/pay/wallet",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              payPwd: pwd,
              orderId: _this.orderInfo.orderId,
              type: _this.orderInfo.type
            })
          )
          .then(function(e) {
            _this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (e.data.code == 200) {
              // _this.payPrepar();
              _this.$router.push({
                name: "orderDoneMall",
                query: {
                  orderId: _this.orderInfo.orderId,
                  orderType: _this.orderInfo.orderType
                }
              });
            } else {
              if (e.data.code == 401) {
                _this.$vux.alert.show({
                  content: e.data.msg,
                  onHide() {
                    _this.goBalance();
                  }
                });
              } else {
                _this.$vux.alert.show({
                  content: e.data.msg
                });
              }
            }
          });
      } else {
        _this.payPrepar();
      }
    },

    getPublicKey(data) {
      let _this = this;
      let jse = new this.$jsEncrypt.JSEncrypt();

      _this.$store.commit("updateLoadingStatus", { isLoading: true });
      _this.$http
        .post(
          "/api/pay/publickey",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          _this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (e.data.code == 200) {
            jse.setPublicKey(e.data.data);
            let encrypted = jse.encrypt(data);
            _this.pay(encrypted);
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    payPrepar() {
      let _this = this;
      this.payWeixinOrder(
        _this.orderInfo,
        {
          name: "orderDoneMall",
          query: { orderType: _this.orderInfo.orderType }
        },
        1
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.cart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: $cartH;
  background: $cartBg;
  z-index: 10;
  display: flex;
  color: $cartColor;
  font-size: $cartBtnFontSize;

  div {
    width: 100%;
    line-height: $cartH;
    text-align: center;
  }
}

.add-cart {
  background-color: #fff;
  text-align: center;
}

.go-balance {
  text-align: center;
  color: #fff;
  background: $colorRedDeep;
}

.balance {
  position: relative;
  padding: 5px;
  line-height: 1;

  &:before {
    height: auto;
    line-height: 1;
    display: block;
  }

  span {
    height: auto;
    line-height: 1.35;
    font-size: $fontSize;
    display: block;
  }

  i {
    position: absolute;
    font-style: normal;
    left: 50%;
    top: 0;
    margin-left: 1em;
    line-height: 1;
    font-size: $fontSize;
    color: #fff;
  }
}

@import "~assets/css/cart";

.cart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: $cartH;
  background: $cartBg;
  z-index: 10;
  display: flex;
  font-size: $cartBtnFontSize;
  border-top: 1px solid $borderColor;
  color: $cartColor;

  div {
    width: 50%;
    line-height: $cartH;
    text-align: center;
  }
}

.cart-pay {
  p {
    padding-right: $padding;
    flex: 1;
    line-height: $cartH;
    text-align: center;
    background-color: #fff;
    color: #333;

    span {
      color: $colorRedDeep;

      i {
        font-style: normal;
      }
    }
  }

  .pay-order {
    width: 140px;
    background: $colorRedDeep;

    &.disabled {
      background: $disabledPay;
    }
  }
}
</style>
