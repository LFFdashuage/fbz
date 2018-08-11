<!-- 
	专栏
 -->
<template>
	<div class="special-column" v-cloak>
    	<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="100" v-cloak>
		    <div class="content-cell">

          <!-- 轮播图 -->
          <div class="special-swiper-img">
            <swiper loop auto height="129px" :list="swiperImg" :index="swiperImgInt"></swiper>
          </div>

          <!-- 四个小图标 -->
          <div class="special-router">
            <div @click="specialGouPage('1','运营管理')"> <img src="~assets/img/icon/administration.png">运营管理</div>
            <div @click="specialGouPage('2','商业模式')"><img src="~assets/img/icon/business.png">商业模式</div>
            <div @click="specialGouPage('3','金融资本')"><img src="~assets/img/icon/finance.png">金融资本</div>
            <div @click="specialGouPage('4','心智修炼')"><img src="~assets/img/icon/mind.png">心智修炼</div>
          </div>

          <!-- 底部列表 -->
          <div>
            <div class="card-more-header"><h5>热门专栏</h5></div>
            <!-- <el-img-text-special v-for="(item, index) in scrollerInfo.specialList" :img-text-data="item" :key="index"> </el-img-text-special>  -->
           
            <div class="list-box">
              <el-img-text-column v-for="(item, index) in scrollerInfo.specialList" :img-text-data="item" :key="index"></el-img-text-column>
            </div>
            
            <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
          </div>

		    </div>
	    </scroller>
  </div>
</template>

<script type="text/babel">
import { Swiper, SwiperItem, Scroller } from "vux";
import elLoadMore from "components/load-more/load-more";
import elImgTextSpecial from "components/img-text/img-text-special";
import elImgTextColumn from "components/img-text/img-text-column";

export default {
  name: "specialColumn",
  components: {
    Swiper, SwiperItem, Scroller,
    elLoadMore, elImgTextSpecial,elImgTextColumn
  },
  data() {
    return {
      routerUrl: "/special-column-detail",
      swiperImg: [],
      swiperImgInt: 0,
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 1,
        specialList: []
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.swiperImgList();
      this.getListData();
    },

    // 专栏首页列表
    getListData() {
      let _this = this;

      if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      _this.scrollerInfo.onFetching = true;
      _this.$http
        .post(
          "/api/product/term/list",
          _this.qs.stringify({
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize,
            topTag: 1
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
                  // images: item.images,
                  // termId: item.termId,
                  // remark: item.remark,
                  // termName: item.termName,
                  // playCount: item.playCount,
                  // totalTerm: item.totalTerm

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
            // console.log(list);
            if (list.length < _this.scrollerInfo.pageSize) {
              _this.scrollerInfo.loadAll = true;
            }

            if (_this.scrollerInfo.pageNum == 1) {
              _this.scrollerInfo.specialList = list;
            } else {
              _this.scrollerInfo.specialList = _this.scrollerInfo.specialList.concat(
                list
              );
            }

            _this.scrollerInfo.pageNum++;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }

          _this.resetView();
        });
    },
    resetView() {
      let _this = this;
      _this.$nextTick(() => {
        _this.scrollerInfo.onFetching = false;
        _this.$refs.scrollerBottom.reset();
      });
    },
    loadMore() {
      if (this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {
        this.$refs.scrollerBottom.reset();
      } else {
        this.getListData(this.pageNum);
      }
    },

    // 顶部轮播图
    swiperImgList() {
      let _this = this;
      _this.$http
        .post(
          "/api/product/term/list",
          _this.qs.stringify({
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize,
            isRecommend: 1
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
                  img: item.images,
                  id: item.termId,
                  url: _this.routerUrl + "?id=" + item.termId,
                  title: item.termName
                };
              });
            }
            // console.log(list);
            _this.swiperImg = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    // 四个小图标跳转
    specialGouPage(data,text) {
      this.$router.push({
        name: "specialColumnOperate",
        query: { termType: data,termTypeText: text }
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
@import "~assets/css/course-index";
@import "~assets/css/course";

.special-column {
   background-color: #fff;

  .special-swiper-img {
    padding: $padding;
    background-color: #fff;
  }

  .special-router {
    width: 100%;
    display: flex;
    justify-content: space-around;
    border-bottom: $padding solid $bgGray;

    div {
      height: 90px;
      width: 100%;
      background-color: #fff;
      text-align: center;
      font-size: $fontSizeTips;

      img {
        height: 42px;
        width: 42px;
        padding: 5px;
        margin: $padding auto 5px;
      }
    }
  }
  .list-box{
    padding: 0 $padding;
  }
  .card-more-header {
    position: relative;
    padding: 0 $padding;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
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
  }

}
</style>