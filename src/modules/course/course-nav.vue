<!-- 
	课程列表
 -->
<template>
	<div class="detail-type" v-cloak>
    <div v-transfer-dom>
      <div class="header-nav">
        <div class="header-nav-box nav-left" @click="showFilter('all')">全部课程</div>
        <div class="header-nav-box" @click="showFilter('hot')">热门课程</div>
        <div class="header-nav-box nav-right" @click="showFilter('other')">筛选</div>
      </div>
    </div>

    <div v-transfer-dom>
      <popup v-model="courseFilter.all.status" position="top">
        <div class="header-whole">
          <group>
            <radio v-model="sortType" :options="courseFilter.all.list"></radio>
          </group>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup class="filter-other" v-model="courseFilter.other.status" position="right">
        <div  class="header-choice">
          <div class="header-choice-content scroll-fix">
            <div class="header-choice-box" v-for="(item, index) in courseFilter.other.list" :key="index">
              <p>{{item.name}}</p>
              <checker
                v-model="item.dataId"
                default-item-class="checker-item"
                selected-item-class="checker-item-selected"
                >
                <checker-item v-for="it in item.list" :key="it.name" :value="it.id" >{{it.name}}</checker-item>
              </checker>
            </div>
          </div>
          <div class="choice-bottom-btn">
            <div class="choice-bottom-clean" @click="clearFilterOtherSelected">重置</div>
            <div class="choice-bottom-submit" @click="submitFilter">完成</div>
          </div>
        </div>
      </popup>
    </div>

		<div class="container">
    	<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200" v-cloak>
		    <div class="all-course">
			    <el-img-text-relate v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"></el-img-text-relate>
			    <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
		    </div>
	    </scroller>
		</div>
  </div>
</template>

<script type="text/babel">
  import { TransferDom, Popup, XButton, Scroller, Radio, Group, Checker, CheckerItem } from "vux";
  import elLoadMore from "components/load-more/load-more";
  import elImgTextRelate from "components/img-text/img-text-relate";
  import elCard from "components/card/card";
  import elImgText from "components/img-text/img-text";
  import elCourseAll from "components/course/all";

  export default {
    name: "courseTypeDetail",
    directives: {
      TransferDom
    },
    components: {
      Popup, XButton, Scroller, Radio, Group, Checker, CheckerItem, 
      elLoadMore, elImgTextRelate, elCard, elImgText, elCourseAll
    },
    data() {
      return {
        title: "课程列表",
        scrollerInfo: {
          onFetching: false,
          loadAll: false,
          pageNum: 1,
          pageSize: this.wordBook.pageSize,
          offsetBottom: 100,
          list: []
        },
        sortType: "",
        hotStatus: false,
        courseFilter: this.wordBook.courseFilter
      }
    },
    watch: {
      sortType (newValue, oldValue) {
        this.hotStatus = false;
        this.submitFilter();
      }
    },
    mounted() {
      this.fetchData();
    },
    destroyed () {
      this.wordBook.courseFilter.all.status = false;
      this.wordBook.courseFilter.other.status = false;
      this.wordBook.courseFilter.other.list.map(function(item, index) {
        item.dataId = ""
      })
    },
    methods: {
      fetchData() {
        this.getListData();
        this.selectorList();
      },
      selectorList() {
        let _this = this;
        _this.$http.post("/api/curriculum/selectorList")
          .then(function(e) {
            if (e.data.code == 200) {
              let res = e.data.data;
              let authors = [],
                companys = [],
                courseTypes = [],
                industrys = [];

              if (res.authors && res.authors.length > 0) {
                authors = res.authors.map(function(item, index) {
                  return {
                    name: item.name,
                    id: item.id
                  };
                });
              }
              if (res.companys && res.companys.length > 0) {
                companys = res.companys.map(function(item, index) {
                  return {
                    name: item.name,
                    id: item.id
                  };
                });
              }
              if (res.courseTypes && res.courseTypes.length > 0) {
                courseTypes = res.courseTypes.map(function(item, index) {
                  return {
                    name: item.name,
                    id: item.id
                  };
                });
              }

              if (res.industrys && res.industrys.length > 0) {
                industrys = res.industrys.map(function(item, index) {
                  return {
                    name: item.name,
                    id: item.id
                  };
                });
              }
              _this.courseFilter.other.list[0].list = authors;
              _this.courseFilter.other.list[1].list = companys;
              _this.courseFilter.other.list[2].list = courseTypes;
              _this.courseFilter.other.list[3].list = industrys;
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      getListData() {
        let _this = this;

        if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
        _this.scrollerInfo.onFetching = true;

        _this.$http.post("/api/curriculum/all/curriculumList",
            _this.qs.stringify({
              pageNum: this.scrollerInfo.pageNum,
              pageSize: this.scrollerInfo.pageSize,
              sortType: this.hotStatus ? '3' : this.sortType,
              authorId: this.courseFilter.other.list[0].dataId,
              courseTypeId: this.courseFilter.other.list[2].dataId,
              companyId: this.courseFilter.other.list[1].dataId,
              industryId: this.courseFilter.other.list[3].dataId,
              turnoverNum: this.courseFilter.other.list[4].dataId,
              peopleNum: this.courseFilter.other.list[5].dataId
            })
          ).then(function(e) {
            if (e.data.code == 200) {
              let list = [];
              if (e.data.data && e.data.data.result && e.data.data.result.length > 0) {
                list = e.data.data.result.map(function(item, ind) {
                  return {
                    img: item.images,
                    id: item.periodsId,
                    remark: item.remark,
                    name: item.name,
                    status: "",
                    price: item.price,
                    originalPrice: item.originalPrice,
                    address: item.address || "",
                    endDate: item.endDate,
                    startDate: item.startDate,
                    url: "courseDetail",
                    seller: item.disMaxCount || 0,
                    isClick: true
                  };
                });
              }

              if (list.length < _this.scrollerInfo.pageSize) {
                _this.scrollerInfo.loadAll = true;
              }

              if (_this.scrollerInfo.pageNum == 1) {
                _this.scrollerInfo.list = list;
              } else {
                _this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
              }

              _this.scrollerInfo.pageNum++;
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }

            _this.resetView(e.data.data.pageNum == 1);
          });
      },
      resetView(status) {
        let _this = this;
        this.$nextTick(() => {
          this.scrollerInfo.onFetching = false;
          if(status) {
            this.$refs.scrollerBottom.reset({top: 0});
          } else {
            this.$refs.scrollerBottom.reset();
          }
        });
      },
      loadMore() {
        if (this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {
          this.$refs.scrollerBottom.reset();
        } else {
          this.getListData();
        }
      },
      goPage(obj) {
        if (!this.isLogin()) return false;
        // this.$router.push({
        //   name: "courseOrder",
        //   query: { id: obj.id, type: "course" }
        // });
         this.$router.push({
          name: "curriculumOrder",
          query: { id: obj.id, type: "course" }
        });
      },
      submitFilter() {
        this.courseFilter.other.status = false;
        this.courseFilter.all.status = false;

        this.scrollerInfo.pageNum = 1;
        this.scrollerInfo.loadAll = false;
        this.scrollerInfo.onFetching = false;
        this.getListData();
      },
      clearFilterOtherSelected() {
        this.courseFilter.other.list[0].dataId = "";
        this.courseFilter.other.list[1].dataId = "";
        this.courseFilter.other.list[2].dataId = "";
        this.courseFilter.other.list[3].dataId = "";
        this.courseFilter.other.list[4].dataId = "";
        this.courseFilter.other.list[5].dataId = "";
      },
      showFilter(data) {
        if(data == 'other') {
          this.courseFilter.all.status = false;
          this.courseFilter.other.status = true;
        } else if (data == 'all') {
          this.courseFilter.all.status = true;
          this.courseFilter.other.status = false;
        } else {
          this.hotStatus = true;
          this.submitFilter();
          this.courseFilter.other.status = false;
          this.courseFilter.all.status = false;
        }
      }
    }
  };
</script>

<style lang="scss">
  .tab .vux-slider {
    height: 100%;
  }
</style>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions",
    "~assets/css/core/mixins",
    "~assets/css/core/vars";
  @import "~assets/css/course-index";
  @import "~assets/css/course";

  $choicePadding: 15px;
  $choiceBlockH: 40px;
  $choiceBlockMargin: 6px;

  .container {
    // padding-bottom: 100px;
    margin-top: 50px;
  }

  .all-course {
    // padding-bottom: 240px;
  }

  .header-nav {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 555;
    height: 45px;
    width: 100%;
    border-bottom: 1px solid $borderColor;
    display: flex;

    .header-nav-box {
      position: relative;
      flex-grow: 1;
      line-height: 45px;
      text-align: center;
      background: #fff;
      font-size: $fontSizeH4;
    }

    .nav-left:before, .nav-right:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      margin-left: 2em;
      background: url(~assets/img/nav/nav-bottom.png) no-repeat;
      background-size: 60%;
      background-position: center;
    }

    .nav-right:before {
      margin-left: 1em;
      background-image: url(~assets/img/nav/course-nav.png);
    }
  }

  .header-whole {
    padding-top: 35px;
    width: 100%;
    border-bottom: 1px solid #dadada;
  }
  
  .filter-other {
    top: 45px !important;
    left: 10% !important;
    bottom: 0 !important;
    height: auto !important;
  }

  .header-choice {
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: $colorBg;
    overflow: hidden;
  }

  .header-choice-box {
    p {
      line-height: $choiceBlockH;
      padding: 0 $choicePadding;
      font-size: $fontSizeH4;
    }
  }
 
  .vux-checker-box {
    padding: 0 $choicePadding;
  }

  .checker-item {
    position: relative;
    width: 100px;
    height: $choiceBlockH;
    line-height: $choiceBlockH;
    margin: $choiceBlockMargin;
    border: 1px solid transparent;
    border-radius: $borderRadius;
    text-align: center;
    background-color: $bgGray;

    &.checker-item-selected {
      color: $colorYellowEasy;
      border-color: $colorYellowEasy;
      background: #fff url(~assets/img/checker.png) no-repeat;
      background-size: auto 50%;
      box-shadow: 3px 0px 4px $colorYellowEasy inset;
    }
  }

  .header-choice-content {
    width: 100%;
    height: 100%;
    padding-bottom: 70px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .choice-bottom-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;

    & > div {
      flex: 1;
      height: 50px;
      border-radius: 0;
      text-align: center;
      font-size: $fontSizeH2;
    }

    .choice-bottom-clean {
      background-color: #fff;
    }

    .choice-bottom-submit {
      color: #fff;
      background-color: $colorRedDeep;
    }
  }
</style>