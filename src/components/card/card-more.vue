<!-- 
	查看全部card
 -->

<template>
	<div class="card-more">
		<div class="card-more-header">
			<h5>{{ cardMoreData.title }}</h5>
			<div v-if="cardMoreData.text" class="link" @click="goPage(cardMoreData.url)">
				{{ cardMoreData.text }}
				<span class="fa fa-angle-right"></span>
			</div>
		</div>
		<div class="card-more-content">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script type="text/babel">
import { Panel, Group, Radio } from "vux";

import imgHeader from "assets/img/icon/icon.png";

export default {
  name: "cardMore",
  components: { Panel },
  props: ["cardMoreData"],
  data() {
    return {
      title: "卡片"
    };
  },
  methods: {
    // goPage () {
    // 	if(this.cardMoreData.url)
    // 		this.$router.push({name: this.cardMoreData.url, query: this.cardMoreData.query, params: this.cardMoreData.params });
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.card-more {
  @include uiBorderTop();
  overflow: auto;

  .card-more-header {
    position: relative;
    padding: 0 $padding;
    // @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
    line-height: 40px;

    h5 {
      font-size: $fontSizeH3;
      color: $fontColorBlack;
      font-weight: bolder;
      display: inline-block;
      padding: 0 6px;
			
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 10px;
        height: 16px;
        border-left: 3px solid $colorRedDeep;
        margin-top: 11px;
      }
    }

    .link {
      position: absolute;
      top: 0;
      right: $padding;
      font-size: $fontSizeH5;
      color: $fontColorGray;

      span {
        margin-left: 0.5em;
      }
    }
  }

  .card-more-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    padding: 0 $padding;
  }
}
</style>