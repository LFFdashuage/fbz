<!-- 
	课程列表
 -->

<template>
	<div class="detail-type" v-cloak>


    <div class="toppp">
      <div class="detail-type-search">
        <search
            @on-change="getResult"
            v-model="searchValue"
            position="relative"
            auto-scroll-to-top top="0px"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search"
            placeholder="请输入关键字！"
          >
        </search>
      </div>

      <div class="first-level-filter-box">  
        <div class="first-level-filter" :class="{ 'whole-filter' : wholeIcon, 'whole-filter-tow': !wholeIcon}" @click="filter('whole')">全部</div>
        <div class="first-level-filter" :class="{ 'filter-icon' : timeIcon, 'filter-icon-tow': !timeIcon}" @click="filter('time')">时间</div>
        <div class="first-level-filter" :class="{ 'filter-icon' : hotIcon, 'filter-icon-tow': !hotIcon}" @click="filter('hot')" > 热门</div>
        <div class="first-level-filter" :class="{ 'filter-icon' : priceIcon, 'filter-icon-tow': !priceIcon}" @click="filter('price')" >价格</div>
        <div class="first-level-filter" @click="showFilter('screen')">筛选</div>
      </div>

      <div class="second-filter-box"> 
        <div class="second-filter" :class="{ 'second-icon' : curriculumShow, 'second-icon-tow': !curriculumShow}"  @click="showFilter('curriculum')"> 课程</div>
        <div class="second-filter" :class="{ 'second-icon' : mechanismShow, 'second-icon-tow': !mechanismShow}"  @click="showFilter('mechanism')"> 机构</div>
        <div class="second-filter" :class="{ 'second-icon' : lecturerShow, 'second-icon-tow': !lecturerShow}"  @click="showFilter('lecturer')">讲师</div>
        <div class="second-filter" :class="{ 'second-icon' : cityShow, 'second-icon-tow': !cityShow}"  @click="showFilter('city')">城市</div>
      </div>
    </div>
<!--      
    <div class="centre">
      <el-course-tuijian></el-course-tuijian>
    </div> -->
    <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" v-cloak class="centre">

      <div class="package-box" @click="goPage('packageDetail', { periodsId: packageData.periodsId})">
        <div class="package-title">
          <h4>{{packageData.name}}</h4>
          <p>{{packageData.ramk}}</p>
        </div>

        <scroller lock-y  height="160px" ref="scrollerBottomCourse" v-cloak :scrollbar-x="false">
          <div  class="card-more-content-slot screen-preview clearfix" >
            <!-- <div @click="goPage({name: 'courseTypeDetail', query: { type: item.type, id: item.id} })" class="screen-preview-block" v-for="(item, index) in packageData.taoCanDatas" :key="index"> -->
              <div class="screen-preview-block" v-for="(item, index) in packageData.taoCanDatas" :key="index">
              <div class="screen-preview-header">
                <img :src="item.src" alt="头像">
                <!-- <div class="icon">
                  <img src="~assets/img/icon/icon-video.png" alt="">
                </div> -->
              </div>
              <p>{{ item.name }}</p>
              <p class="package-address">
                <span>{{item.address}}</span>
                <span>{{item.time}}</span>
              </p>
            </div>
          </div>
        </scroller>
        <p class="original-price">¥{{ packageData.originalPrice | numToCash }}</p>
        <div class="package-btn">
          <div> 组合套餐{{ packageData.price | numToCash }}元</div>
        </div> 
      </div>
    
			<div class="centre-list">
        <el-img-text-course v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"  :type-data="1"></el-img-text-course>
        <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
      </div>

		</scroller>
    
    <div >
      <popup v-model="show" position="right">
        <div class="filter-left-show">
          筛选
        </div>
      </popup>
    </div>

     <div>
      <popup v-model="curriculumShow" position="left">
        <div class="filter-right-show">
            课程
        </div>
      </popup>
    </div>

    <div>
      <popup v-model="mechanismShow" position="left">
        <div class="filter-right-show">
          机构
        </div>
      </popup>
    </div>

    <div >
      <popup  v-model="lecturerShow" position="right">
        <div class="filter-left-show">
          讲师
        </div>
      </popup>
    </div>

     <div>
       <popup v-model="cityShow" position="top" :show-mask="false">
        <div class="city-show">
          选<br>择</br>城</br>市</br>
        </div>
      </popup>
    </div>
	</div>
</template>

<script type="text/babel">
import { Search, TransferDom, Popup, Group, Scroller } from "vux";
import elLoadMore from "components/load-more/load-more";
import elImgTextCourse from "components/course/img-text-course";
import elCourseTuijian from "components/course/tuijian";

export default {
  name: "naw-course",
  components: {
    Search,
    TransferDom,
    Popup,
    Group,
    Scroller,
    elLoadMore,
    elImgTextCourse,
    elCourseTuijian
  },
  data() {
    return {
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 10,
        isRequired:0, //是否为必修课程 0否 1是
        cityId:'',   //开课城市 
        companyId:'',//机构id
        authorId:'', //	讲师id
        courseTypeId:'',//课程类型id
        sort:'',  //排序
        list: [
          {
            id: 28,
            img:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            title: "大方是是大V是",
            time: "2018-02-122018-05-01",
            address: "杭州",
            surplus: 33,
            price: 455636,
            originalPrice: 345345
          },
          {
            id: 19,
            img:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            title: "截图你随便巴尔查",
            time: "2018-02-122018-05-01",
            address: "杭州",
            surplus: 33,
            price: 455636,
            originalPrice: 345345
          }
        ]
      },
      packageData: {
        periodsId:14,
        name: "从零到亿，影响以上的财富课",
        ramk: "逆向盈利+你想融资+逆向招商，三大课程首次打包",
        originalPrice: 30000,
        price: 20000,
        taoCanDatas: [
          {
            type: 1,
            id: 23,
            src:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            name: "如果人人份儿饭",
            address: "杭州",
            time: "2018-03-04-11:34"
          },
          {
            type: 1,
            id: 23,
            src:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            name: "如果人人份儿饭",
            address: "苏州",
            time: "2018-03-04-11:34"
          },
          {
            type: 1,
            id: 23,
            src:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            name: "如果人人份儿饭",
            address: "苏州",
            time: "2018-03-04-11:34"
          },
          {
            type: 1,
            id: 23,
            src:
              "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
            name: "如果人人份儿饭",
            address: "杭州",
            time: "2018-03-04-11:34"
          }
        ]
      },
      secondIcon: false,
      wholeIcon: false,
      priceIcon: false,
      hotIcon: false,
      timeIcon: false,
      searchValue: "",
      tabData: [
        {
          value: "whole",
          name: "全部"
        },
        {
          value: "tuijian",
          name: "推课程"
        },
        {
          value: "activity",
          name: "活课程"
        },
        {
          value: "package",
          name: "优套餐"
        },
        {
          value: "price",
          name: "价格"
        }
      ],
      show: false,
      curriculumShow: false,
      mechanismShow: false,
      lecturerShow: false,
      cityShow: false
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      console.log(this.scrollerInfo.sort)
      // if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      // _this.scrollerInfo.onFetching = true;

      // _this.$http
      //   .post(
      //     "/api/curriculum/allCourses",
      //     _this.qs.stringify({
      //       pageNum: this.scrollerInfo.pageNum,   //第几页
      //       pageSize: this.scrollerInfo.pageSize, //每页显示条数
      //       isRequired:0, //是否为必修课程 0否 1是
      //       cityId:'',   //开课城市 
      //       companyId:'',//机构id
      //       authorId:'', //	讲师id
      //       courseTypeId:'',//课程类型id
      //       sort:''
      //       //排序，时间升序：startDate 降序：startDate_DESC 
      //       //热门课程升序：salesCount 降序：salesCount_DESC 
      //       //价格升序：price 降序：price_DESC
      //     })
      //   )
        // .then(function(e) {
        //   console.log(e)
          // if (e.data.code == 200) {
          //   let list = [];
          //   if (
          //     e.data.data &&
          //     e.data.data.result &&
          //     e.data.data.result.length > 0
          //   ) {
          //     list = e.data.data.result.map(function(item, ind) {
          //       return {
          //         id: item.termId,
          //         img: item.images,
          //         price: item.price,
          //         readCount: item.playCount,
          //         desc: item.remark,
          //         title: item.termName,
          //         totalTerm: item.totalTerm,
          //         upToDate: item.updateCount
          //       };
          //     });
          //   }
          //   // console.log(list)

          //   if (list.length < _this.scrollerInfo.pageSize) {
          //     _this.scrollerInfo.loadAll = true;
          //   }

          //   if (_this.scrollerInfo.pageNum == 1) {
          //     // _this.scrollerInfo.list = list;
          //   } else {
          //     // _this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
          //   }

          //   _this.scrollerInfo.pageNum++;
          //   _this.resetView();
          // } else {
          //   _this.$vux.alert.show({
          //     content: e.data.msg
          //   });
          // }
        // });
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
    filter(val) {
       let _this = this;
      // console.log(_this.scrollerInfo.sort)
            //       isRequired:0, //是否为必修课程 0否 1是
      //       cityId:'',   //开课城市 
      //       companyId:'',//机构id
      //       authorId:'', //	讲师id
      //       courseTypeId:'',//课程类型id
      //       sort:''
      //       //排序，时间升序：startDate 降序：startDate_DESC 
      //       //热门课程升序：salesCount 降序：salesCount_DESC 
      //       //价格升序：price 降序：price_DESC
      if (val == 'price') {
        if (_this.priceIcon == false) {
          _this.priceIcon = true;
          _this.wholeIcon = false;

          _this.scrollerInfo.sort= 'price';
          _this.fetchData();
        } else {
          _this.priceIcon = false;

          _this.scrollerInfo.sort= 'price_DESC';
          _this.fetchData();
        }
      } else if (val == 'hot') {
        if (_this.hotIcon == false) {
          // this.type=1; //热门
          _this.hotIcon = true;
          _this.wholeIcon = false;

          _this.scrollerInfo.sort= 'salesCount';
          _this.fetchData();
        } else {
          _this.hotIcon = false;

          _this.scrollerInfo.sort= 'salesCount_DESC';
          _this.fetchData();
        }
      } else if (val == 'time') {
        if (this.timeIcon == false) {
          // this.type=1; //时间
          _this.timeIcon = true;
          _this.wholeIcon = false;

          _this.scrollerInfo.sort= 'startDate';
          _this.fetchData();
        } else {
          _this.timeIcon = false;

          _this.scrollerInfo.sort= 'startDate_DESC';
          _this.fetchData();
        }
      } else if (val == 'whole') {
        if (this.wholeIcon == false) {
          // this.type=1; //全部
          _this.wholeIcon = true;
          _this.priceIcon = false;
          _this.hotIcon = false;
          _this.timeIcon = false;

          _this.scrollerInfo.sort= '';
          _this.fetchData();
        }
        // else {
        //   this.wholeIcon = false;
        // }
      }
    },
    showFilter(val) {
      if (val == "curriculum") {
        this.curriculumShow = true;
        this.show = false;
        this.mechanismShow = false;
        this.lecturerShow = false;
        this.cityShow = false;
      }
      if (val == "mechanism") {
        this.mechanismShow = true;
        this.show = false;
        this.curriculumShow = false;
        this.lecturerShow = false;
        this.cityShow = false;
      }
      if (val == "lecturer") {
        this.lecturerShow = true;
        this.show = false;
        this.curriculumShow = false;
        this.mechanismShow = false;
        this.cityShow = false;
      }
      if (val == "city") {
        this.cityShow = true;
        this.show = false;
        this.curriculumShow = false;
        this.mechanismShow = false;
        this.lecturerShow = false;
      }
      if (val == "screen") {
        this.show = true;
        this.curriculumShow = false;
        this.mechanismShow = false;
        this.lecturerShow = false;
        this.cityShow = false;
      }
    },
    // goPage(code, status) {
    //   this.$router.push({
    //     name: "courseDetail",
    //     query: { courseCode: code, courseStatus: status }
    //   });
    // },
     goPage(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
    },

    //取消搜索
    onCancel() {},

    // 搜索提交
    onSubmit(value) {
      console.log("提交了", value);
    },

    // 输入文字变化时触发
    getResult(val) {
      console.log(val);
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

.detail-type {
  .toppp {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 555;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 8px 20px $bgGray;
  }

  .detail-type-search {
    height: 44px;
    width: 100%;
    position: relative;
    top: 0;
    right: 0;
  }

  //一级删选
  .first-level-filter-box {
    height: 34px;
    width: 100%;
    // padding: 0 $padding;
    display: flex;
    flex-direction: row;
    background-color: #fff;

    .first-level-filter {
      flex: 1;
      display: flex;
      justify-content: center;
      text-align: center;
      line-height: 2.5em;
      font-size: $fontSize;
    }
  }

  //二级筛选
  .second-filter-box {
    height: 32px;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: #fff;

    .second-filter {
      flex: 1;
      text-align: center;
      line-height: 2;
      font-size: $fontSize;
    }

    .second-icon {
      background: url(~assets/img/icon/nav-pull.png) no-repeat !important;
      background-position: 82% center !important;
      background-size: auto 25% !important;
    }

    .second-icon-tow {
      background: url(~assets/img/icon/nav-push.png) no-repeat !important;
      background-position: 82% center !important;
      background-size: auto 25% !important;
    }
  }

  .centre {
    padding: 130px 0 0;
    .centre-list {
    }
  }

  .filter-left-show {
  background-color: $bgGray;
  color: #000;
  text-align: center;
  height: 100%;
  width: 300px;
  padding: 130px $padding $padding $padding;
  }

  .filter-right-show {
  background-color: $bgGray;
  color: #000;
  text-align: center;
  height: 100%;
  width: 300px;
  padding: 130px $padding $padding $padding;
  }

  .filter-icon {
    background: url(~assets/img/icon/sort-down-click.png) no-repeat !important;
    background-position: 82% center !important;
    background-size: auto 25% !important;
  }

  .filter-icon-tow {
    background: url(~assets/img/icon/sort-up-click.png) no-repeat !important;
    background-position: 82% center !important;
    background-size: auto 25% !important;
  }

  .whole-filter {
    font-size: 13;
    color: #b92a17;
    @include halfpxline(0, #b92a17, 0 , 0, 2px, 0);
  }

  .whole-filter-tow {
    color: $fontColorBlack;
  }
}

.package-box {
  @include halfpxline(0, $bgGray, 0, 0, 1px, 0);
  padding: $padding;

  .package-title {
    h4 {
      text-align: center;
      color: $fontColorBlack;
      font-size: $fontSize;
      @include ellipsisMore(1);
    }

    p {
      text-align: center;
      color: $fontColorGray;
      font-size: $fontSizeTips;
      @include ellipsisMore(1);
    }
  }

  .original-price {
    text-align: center;
    color: $fontColorGray;
    font-size: $fontSizeTips;
    text-decoration: line-through;
  }
  .package-btn {
    margin-top: $padding;
    display: flex;

    div {
      display: inline-block;
      margin: 0 auto;
      padding: 5px 10px;
      border: 1px solid $colorRedDeep;
      color: $colorRedDeep;
      font-size: $fontSizeBut;
      border-radius: 15px;
    }
  }
  .card-more-content-slot {
    padding: $uiMarginH 0;
  }

  .screen-preview {
    width: 210%;
    margin-left: -$padding+1px;
    padding: $padding 0;

    .screen-preview-block {
      float: left;
      width: 25%;
      padding: 0 6px;
      line-height: 1.75;
      // border-right: 1px solid $borderColor;
      text-align: center;

      &:last-child {
        border-right-width: 0;
      }

      .screen-preview-header {
        width: 167px;
        // height: 88px;
        margin: 0 auto;
        text-align: center;
        position: relative;

        // .icon {
        //   position: absolute;
        //   left: -20px;
        //   top: 10px;
        //   width: 66px;
        //   text-align: center;

        //   img {
        //     width: 100%;
        //     height: 100%;
        //   }
        // }

        img {
          width: 148px;
          height: 82px;
          // height: 100%;
        }
      }

      .package-address {
        @include ellipsisOne();
        span {
          color: $fontColorGray;
          font-size: $fontSizeTips;
        }
      }

      & > p {
        @include ellipsisOne();
        margin-left: 10px;
        width: 90%;
        color: $fontColorBlack;
        font-size: $fontSizeBut;
        margin-top: 6px;
      }
    }
  }
}
.city-show {
  background-color: $bgGray;
  color: #000;
  text-align: center;
  padding: 130px $padding $padding $padding;
}
</style>