<!-- 
动态
 -->
 
<template>
	<div>
     <div class="dynamic-tip"><span>动态</span><span>（15条结果）</span></div>
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" v-cloak>
			<div>
				<!-- <el-dynamic v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"></el-dynamic> -->
        <el-dynamic v-for="(item, index) in 4" :img-text-data="item" :key="index"></el-dynamic>
        <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
			</div>
		</scroller>
    
	</div>
</template>

<script type="text/babel">
import { Scroller } from "vux";
import elLoadMore from "components/load-more/load-more";
import elDynamic from "components/class/home-page/dynamic";

export default {
  name: "elTabDynamic",
  components: {
    Scroller, 
    elLoadMore, elDynamic
  },
  data() {
    return {
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 50,
        list: [
        ]
      }
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      _this.scrollerInfo.onFetching = true;

      _this.$http
        .post(
          "/api/xxxx/xx/xxx",
          _this.qs.stringify({
            id:id
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if ( e.data.data && e.data.data.result && e.data.data.result.length > 0 ) {
              list = e.data.data.result.map(function(item, ind) {
                return {
                  id: item.termId,
                  int:int  
                };
              });
            }
            // console.log(list)

            if (list.length < _this.scrollerInfo.pageSize) {
              _this.scrollerInfo.loadAll = true;
            }

            if (_this.scrollerInfo.pageNum == 1) {
              _this.scrollerInfo.list = list;
            } else {
              _this.scrollerInfo.list = _this.scrollerInfo.concat(list);
            }

            _this.scrollerInfo.pageNum++;
            _this.resetView();
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    resetView() {
      let _this = this;
      this.$nextTick(() => {
        this.scrollerInfo.onFetching = false;
        this.$refs.scrollerBottom.reset();
      });
    },
    loadMore() {
      if (this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {
        this.$refs.scrollerBottom.reset();
      } else {
        this.fetchData();
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
  
  .dynamic-tip {
    padding: 7px $padding;
    font-size: $fontSizeTips;
    background-color: #fff;
    color: $fontColorGray;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
</style>