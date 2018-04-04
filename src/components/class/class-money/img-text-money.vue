<!-- 
	专收支明细
 -->
<template>
	<div class="img-text-box" v-cloak>
		<div class="content">
			<div>
				<p>{{imgTextData.name}}</p>
				<p>{{imgTextData.time}}</p>
			</div>
		</div>
		<div class="money">
			<span v-if="typeData==1">+</span>
			<span v-else>-</span>
			{{imgTextData.money | numToCash }}
		</div>
	</div>
</template>

<script type="text/babel">
export default {
  name: "elImgTextMoney",
  props: ["imgTextData", "typeData"],
  data() {
    return {
      // list: {
      // 	money:455,
      // 	name:"的孙而非",
      // 	time:"2018/02/12  22:32",
      // 	type:1
      // }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.img-text-box {
  height: 80px;
  width: 100%;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  display: flex;
  color: $fontColorBlack;

  .content {
    flex: 1;
    display: flex;
    align-items: center;

    p {
      @include ellipsisMore(1);
      font-size: $fontSize;
    }
  }

  .money {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: $fontSizeH4;
  }
}
</style>