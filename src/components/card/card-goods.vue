<!-- 
	订单内商城产品展现卡
 -->

<template>
	<div class="product mall-product" v-cloak>

		<div v-if="cardMallData.img" class="img">
			<img :src="cardMallData.img" alt="">
		</div>

		<div class="product-content">
			<div class="product-info">
				<p class="productName">{{ cardMallData.productName }}</p>
				<p :class="{'price': !cardMallData.productCount}">
          <span>¥{{ cardMallData.productPrice | numToCash }}</span>
        </p>
				<x-number :min="1" class="num-data" v-model="numData"></x-number>
			</div>
		</div>

	</div>
</template>

<script type="text/babel">
import { XNumber } from "vux";

export default {
  name: "cardGoods",
  components: {
    XNumber
  },
  props: ["cardMallData", "cartNum"],
  data() {
    return {
      title: "产片卡片",
      info: {
        img: "",
        productName: "",
        productPrice: "",
        productCount: ""
      },
      numData: this.cartNum
    };
  },
  watch: {
    numData(newValue, oldValue) {
      this.$emit("on-num-change", newValue);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

@import "~assets/css/card-order";

.img {
  padding-left: 10px;
  width: 130px;
  height: 90px;
  margin: auto 0;

  img {
    width: 100%;
    height: 100%;
  }
}

.product-content {
  .product-info {
    position: relative;

    .productName {
      padding-right: $padding;
    }

    .price {
      text-align: left;
      position: absolute;
      left: 0;
      bottom: 5px;
      span {
        color: $colorRedDeep;
      }
    }
    .num-data {
      padding-right: 0;
      padding-left: 0;
    }
  }
}
</style>