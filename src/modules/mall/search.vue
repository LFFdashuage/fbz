<!-- 
	商城搜索
 -->
<template>
  <div class="search">
    <div class="top-search">
      <search
        v-model="value"
        @on-submit="submitCheck"
        @on-cancel="cancelSearch"
        placeholder="请输入要搜索资料名称"
        ref="search"></search>
    </div>

    <div v-show="isShow"> 
      <el-search-hint :search-hint-data="hintinfo.history" @hint="hotCheck"></el-search-hint>
      <el-search-hint :search-hint-data="hintinfo.hot" @hint="hotCheck"></el-search-hint>
    </div>

    <div class="commodity" v-show="!isShow">
      <scroller lock-x :height="-commodityList.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom">
        <div class="mall-list">
          <el-mall-product :mall-product-data="item" v-for="(item, index) in commodityList.list" :key="index"></el-mall-product>
          <el-load-more :load-all="commodityList.loadAll"></el-load-more>
        </div>
      </scroller> 
    </div>
  </div> 
</template>

<script type="text/babel">
  import { Scroller, Search, Group, Cell, XInput, XButton, TransferDom } from "vux";
  import elLoadMore from "components/load-more/load-more";
  import elMallProduct from "components/mall/product-like";
  import elSearchHint from "components/mall/search-hint";

  export default {
    name: "mallSearch",
    directives: {
      TransferDom
    },
    components: {
      Scroller, Search, Group, Cell, XInput, XButton,
      elLoadMore, elMallProduct, elSearchHint
    },
    props: ["searchShow"],
    data() {
      return {
        value: "",
        isShow: true,
        commodityList: {
          offsetBottom: 100,
          onFetching: false,
          loadAll: false,
          pageSize: 10,
          pageNum: 1,
          list: []
        },
        hintinfo:{
          history: {
            title: '历史搜索',
            list:[
              // {
              //   searchContent: "恶气狗肉馆"
              // }
            ]
          }, 
          hot: {
            title: "热门搜索",
            list: [
              // {
              //   searchContent: "恶气狗肉馆"
              // }
            ]
          }
        }
      }
    },
    mounted() {
      this.fetchData();
      this.$nextTick(() => {
        this.$refs.search.setFocus();
      })
    },
    methods: {
      fetchData() {
        let _this = this;
        _this.$http.post("/api/index/search",
            _this.qs.stringify({
              customerId: this.$store.state.user.userId,
              type: 1,
              pageNum: 15
            })
          ).then(function(e) {
            if (e.data.code == 200) {
              let res = e.data.data,
                  historyList = [],
                  hotList = [];
              if (res.historyList && res.historyList.length > 0) {
                historyList = res.historyList.map(function(item, index) {
                  return {
                    searchContent: item.searchContent
                  };
                });
              }
              if (res.hotList && res.hotList.length > 0) {
                hotList = res.hotList.map(function(item, index) {
                  return {
                    searchContent: item.searchContent
                  };
                });
              }
              _this.hintinfo.history.list = historyList;
              _this.hintinfo.hot.list = hotList;
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      getData () {
        let _this = this;
        
        if (this.commodityList.onFetching || this.commodityList.loadAll) return;
        this.commodityList.onFetching = true;
        
        _this.isShow = false;

        _this.$http.post("/api/goods/list",
            _this.qs.stringify({
              customerId: this.$store.state.user.userId,
              searchKeyword: _this.value,
              pageSize: _this.commodityList.pageSize,
              pageNum: _this.commodityList.pageNum
            })
          ).then(function(e) {
            if (e.data.code == 200) {
              let res = e.data.data,
                  list = [];

              if (e.data.data.result && e.data.data.result.length > 0) {
                list = res.result.map(function(item, index) {
                  return {
                    id: item.goodsId,
                    img: item.images,
                    name: item.goodsName,
                    price: item.price,
                    originalPrice: item.originalPrice
                  };
                });
              }

              if (_this.commodityList.pageNum == 1) {
                _this.commodityList.list = list;
              } else {
                _this.commodityList.list = _this.commodityList.list.concat(list);
              }

              if (_this.commodityList.pageNum >= res.pages) {
                _this.commodityList.loadAll = true;
              }

              _this.commodityList.pageNum++;
              _this.resetView(res.pageNum == 1);
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      resetView(status) {
        this.$nextTick(() => {
          this.commodityList.onFetching = false;

          if(status) {
            this.$refs.scrollerBottom.reset({
              top: 0
            });
          } else {
            this.$refs.scrollerBottom.reset();
          }
        });
      },
      loadMore() {
        if (this.commodityList.onFetching || this.commodityList.loadAll) {
          this.resetView();
        } else {
          this.getData();
        }
      },
      hotCheck(somedata) {
        this.value = somedata;
        this.submitCheck();
      },
      // 搜索
      submitCheck() {
        this.commodityList.loadAll = false;
        this.commodityList.onFetching = false;
        this.commodityList.pageNum = 1;
        this.getData();
      },
      cancelSearch () {
        this.isShow = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions", "~assets/css/core/mixins", "~assets/css/core/vars";

</style>