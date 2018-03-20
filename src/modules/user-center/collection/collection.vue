<!-- 
  收藏列表
 -->
<template>
  <div>
    	<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <div class="content">
	      	<template v-if="tabSelected == 0">
            <!-- 线上课程 -->
            <div>
                <el-on-line></el-on-line>
            </div>
	      	</template>
	        
	        <template v-if="tabSelected == 1">
            <!-- 线下课程 -->
						<div>
               <el-line></el-line>
            </div>
	        </template>

          <template v-if="tabSelected == 2">
            <!-- 头条 -->
						<div>         
              <el-headlines></el-headlines>
            </div>
	        </template>

          <template v-if="tabSelected == 3">
            <!-- 商城 -->
						<div>
              <el-shopping></el-shopping>
            </div>
	        </template>
          
	      </div>
	    </div>
  </div>
</template>

<script>
import { TransferDom, Tab, TabItem, Swiper, SwiperItem } from "vux";
import elHeadlines from "components/collection/headlines";
import elShopping from "components/collection/shopping";
import elLine from "components/collection/line";
import elOnLine from "components/collection/onLine";
export default {
  name: "collection",

  directives: {
    TransferDom
  },
  components: {
    Tab, TabItem, Swiper, SwiperItem,
    elHeadlines, elShopping, elLine, elOnLine
  },
  data() {
    return {
      // termType: this.$route.query.termType,
      tabSelected: 0,
      tabDatas: [
        {
          value: "onLine",
          title: "线上课程"
        },
        {
          value: "Line",
          title: "线下课程"
        },{
          value: "headlines",
          title: "头条"
        },
        {
          value: "Shopping",
          title: " 商城"
        }
      ]
    };
  },

  methods: {}
};
</script>

<style>

</style>
