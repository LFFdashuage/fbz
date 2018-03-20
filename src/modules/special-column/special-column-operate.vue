<!-- 
  专栏列表
 -->
<template>
  <div>
      <nav class="header">{{termTypeText}}</nav>
    	<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" :key="index">{{ item.title }}</tab-item>
	      </tab>

	      <div class="content">
          <!-- 最近更新 -->
	      	<template v-if="tabSelected == 0">
            <div>
               <el-operate-newest> </el-operate-newest>
            </div>
	      	</template>
	        
          <!-- 最多购买 -->
	        <template v-if="tabSelected == 1">
						<div>
                <el-operate-max-purchase></el-operate-max-purchase>
            </div>
	        </template>
	      </div>

	    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import elOperateNewest from "components/special-column/newest";
import elOperateMaxPurchase from "components/special-column/max-purchase";
export default {
  name: "specialColumnOperate",
  components: {
    Tab, TabItem, Swiper, SwiperItem,
    elOperateMaxPurchase, elOperateNewest,
  },
  data() {
    return {
      termType: this.$route.query.termType,
      termTypeText:this.$route.query.termTypeText,
      // sortType:0, //0最新更新 1购买最多
      tabSelected: 0,
      tabDatas: [
        {
          value: "update",
          title: "最近更新"
        },
        {
          value: "purchase",
          title: "最多购买"
        }
      ]
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
  .header{
    padding: $padding/2 $padding;
    border-bottom: 2px solid $bgGray;
    text-align: center;
    font-size: $fontSizeH4;
    color:$fontColorBlack;
  }

</style>
