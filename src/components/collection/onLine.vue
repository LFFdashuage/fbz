<!-- 
  线上收藏
 -->
 
<template>
	<div v-cloak>
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom">

        <swipeout>
          <swipeout-item transition-mode="reveal" v-for="(item, index) in scrollerInfo.list" :key="index">
            
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick(index,item.goodsType,item.goodsId)" type="warn">删除</swipeout-button>
            </div>

            <div slot="content" class="vux-1px-t">
              <el-img-text :img-text-data="item"></el-img-text>
            </div>

          </swipeout-item>
        </swipeout>

				<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
		</scroller>
	</div>
</template>

<script type="text/babel">
import { Scroller, Swipeout, SwipeoutItem, SwipeoutButton } from "vux";
import elLoadMore from "components/load-more/load-more";
import elImgText from "components/collection/img-text";

export default {
  name: "elOnLine",
  components: {
    Scroller, Swipeout, SwipeoutItem, SwipeoutButton,
    elLoadMore, elImgText
  },
  data() {
    return {
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 80,
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
          "/api/customer/collection/list",
          _this.qs.stringify({
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize,
            goodsType: 1,
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (
              e.data.data &&
              e.data.data.result &&
              e.data.data.result.length > 0
            ) {
              list = e.data.data.result.map(function(item, ind) {
                return {
                  images: item.images,
                  goodsId: item.goodsId,
                  rank: item.rank || 5,
                  name: item.name,
                  viewCount: item.viewCount || 0,
                  goodsTypeText: item.goodsTypeText,
                  authorName: item.authorName,
                  goodsType: item.goodsType
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
              _this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
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
    },
    onButtonClick(value, type, data) {
      // console.log(value, type, data);
      let _this = this;
      _this.$http
        .post(
          "/api/customer/collection",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            goodsType: type,
            goodsId: data
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            _this.$vux.toast.show({
              text: e.data.msg
            });
            
            _this.scrollerInfo.list.splice(value, 1);
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
</style>