<!-- 
  最近更新
 -->
 
<template>
	<div>
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" v-cloak>
			<div>
        <el-img-text-column v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"></el-img-text-column>
				<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
import { Scroller } from "vux";
import elLoadMore from "components/load-more/load-more";
import elImgTextColumn from "components/img-text/img-text-column";

export default {
  name: "elOperateMaxPurchase",
  components: {
    Scroller,
    elLoadMore, elImgTextColumn
  },
  data() {
    return {
      termType: this.$route.query.termType,
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 50,
        list: []
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      _this.scrollerInfo.onFetching = true;

      _this.$http
        .post(
          "/api/product/term/list",
          _this.qs.stringify({
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize,
            termType: this.termType,
            sortType: 0
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if ( e.data.data && e.data.data.result && e.data.data.result.length > 0 ) {
              list = e.data.data.result.map(function(item, ind) {
                return {
                  id: item.termId,
                  img: item.images,
                  price: item.price,
                  readCount: item.playCount,
                  desc: item.remark,
                  title: item.termName,
                  totalTerm: item.totalTerm,
                  upToDate: item.updateCount
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
</style>