<!-- 
	新课程详情页
 -->
<template>
	<div class="detail" v-show="courseInfo.name" v-cloak>
		<div class="container scroll-fix">
      
      <!-- 顶部详情 -->
			<div class="detail-header-box">
      	<!-- <el-img-text-relate :img-text-data="courseInfo"></el-img-text-relate> -->
          <el-img-text-detail-course :img-text-data="courseInfo"></el-img-text-detail-course>

			</div>
			
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <div class="list">
	      	<template v-if="tabSelected == 0">

            <!--课程简介-->
            <div class="content-box" v-show="courseInfo.content">
              <div class="table-content-title">
	              <span>课程简介</span>
	            </div>
              <div  :class="{showall:true,active:showall}">
                <div ref="introduce" class="rich-html" v-html="courseInfo.content"></div>
              </div>
              <div v-show="introduceShow">
                <div v-show="!showall" class="mui-text-center imgbtn" :class="{active:showall}" @click="showall=!showall"><div><divider class="open-color">展开更多</divider></div></div>
              </div>
            </div>

            <!-- 讲师 -->
            <div>
               <el-teacher :author-data="authorData"></el-teacher>
            </div>
	      	</template>

	        <template v-if="tabSelected == 1">
	        	<!-- <el-img-text-relate v-for="(item, index) in relateData" :img-text-data="item" :key="index"></el-img-text-relate> -->
            <el-img-text-course v-for="(item, index) in relateData" :img-text-data="item" :key="index"></el-img-text-course>
	        </template>

	      </div>
	    </div>
		</div>
		
    <!-- 底部按钮 --> 
		<div v-transfer-dom>
			<div class="detail-btn-bottom">
        <div class="footer-collection"  :class="{ 'collection-icon' : isIcon, 'collection-icon-tow': !isIcon}" @click="collection"></div>
        <div class="detail-bottom-btn buy ">
          <div class="left" @click="goPage('forceCourse', { id: courseInfo.authorId, type: 'course'})" >线下课程</div>
          <div @click="goPage('curriculumOrder', { id: courseInfo.periodsId, type: 'course' })">马上订票</div>
        </div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
import {
  TransferDom,
  Divider,
  XButton,
  Flexbox,
  FlexboxItem,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  Sticky
} from "vux";
import elImgTextRank from "components/img-text/img-text-rank";
import elImgTextRelate from "components/img-text/img-text-relate";
import elComment from "components/comment/comment";
import elAuthor from "components/author/author";
import elReward from "components/reward/reward";
import elWitness from "components/witness/witness";
import elVideo from "components/video/video";
import elTeacher from "components/teacher/teacher";
import elImgTextCourse from "components/course/img-text-course";
import elImgTextDetailCourse from "components/course/img-text-detail-course";

export default {
  name: "courseNewDetail",
  directives: {
    TransferDom
  },
  components: {
    Divider,
    XButton,
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Sticky,
    elImgTextRank,
    elImgTextRelate,
    elComment,
    elAuthor,
    elReward,
    elWitness,
    elVideo,
    elTeacher,
    elImgTextCourse,
    elImgTextDetailCourse
  },
  data() {
    return {
      typeData: 1,
      isIcon: false,
      introduceShow: false,
      showall: false,
      title: "课程详情",
      courseInfo: {
        periodsId: this.$route.query.periodsId,
        content: "",
        name: "",
        price: "",
        originalPrice: "",
        status: "",
        address: "",
        startDate: "",
        endDate: "",
        seller: "",
        isClick: false,
        authorId: "",
        companyId: "",
        isCollection: ""
      },
      tabDatas: [
        {
          value: "detail",
          title: "全部"
        },
        {
          value: "relate",
          title: "相关"
        }
      ],
      tabSelected: 0,
      relateData: [
        {
          id: 17,
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
          id: 18,
          img:
            "http://fubanzhang.oss-cn-hangzhou.aliyuncs.com/images/086960367d644f7ab64dfd280a5a645f.jpg",
          title: "截图你随便巴尔查",
          time: "2018-02-122018-05-01",
          address: "杭州",
          surplus: 33,
          price: 455636,
          originalPrice: 345345
        }
      ],
      authorData: {},
      // authorinfo: {
      // 	authorId: String,
      // 	companyId: String
      // },
      witnessData: this.$route.query.periodsId,
      playBtn: {
        status: false,
        obj: ""
      }
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "fetchData",
    authorData() {
      this.show();
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.getRelate();
      _this.$http
        .post(
          "/api/curriculum/curriculumDetails",
          _this.qs.stringify({
            periodsId: _this.courseInfo.periodsId,
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let resInfo = e.data.data;
            _this.courseInfo.img = resInfo.periodsImg;
            _this.courseInfo.name = resInfo.periodsName;
            _this.courseInfo.content = _this.resolveRichTextImg(
              resInfo.content
            );
            _this.courseInfo.price = resInfo.price;
            _this.courseInfo.originalPrice =
              resInfo.originalPrice || resInfo.price;
            _this.courseInfo.status = resInfo.sellTicketStateExplain; // 售票状态
            _this.courseInfo.address = resInfo.address;
            _this.courseInfo.startDate = resInfo.startTime;
            _this.courseInfo.endDate = resInfo.endTime;
            _this.courseInfo.seller = resInfo.remainingNumber;
            _this.courseInfo.authorId = resInfo.authorId;
            _this.courseInfo.companyId = resInfo.companyId;
            _this.courseInfo.isCollection = resInfo.isCollection;
            // _this.authorinfo = {
            // 	authorId: resInfo.authorId,
            // 	companyId: resInfo.companyId
            // }
            _this.getAuthorInfo();
            //  console.log(resInfo)
            if (_this.courseInfo.isCollection == 1) {
              _this.isIcon = true;
            }
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    // 拉取讲师信息
    getAuthorInfo() {
      let _this = this;
      _this.$http
        .post(
          "/api/curriculum/authorsInfo",
          _this.qs.stringify({
            authorId: _this.courseInfo.authorId || "1",
            companyId: _this.courseInfo.companyId
          })
        )
        .then(function(e) {
          let resData = e.data.data,
            list = [];
          if (e.data.code == 200) {
            if (resData.length > 0) {
              list = resData.map(function(item, index) {
                return {
                  img: item.authorImg,
                  name: item.authorName,
                  label: item.authorRemark,
                  content: item.authorContent,
                  companyName: item.companyName,
                  companyContent: item.companyContent,
                  companyImg: item.companyImg
                };
              });
            }
            _this.authorData = list[0];
            // console.log(_this.authorData)
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    getRelate() {
      let _this = this;
      _this.$http
        .post(
          "/api/curriculum/relevantCurriculum",
          _this.qs.stringify({
            periodsId: _this.courseInfo.periodsId,
            pageNum: 1,
            pageSize: 4
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let resInfo = e.data.data,
              list = [];
            if (e.data.data.result && e.data.data.result.length > 0) {
              list = e.data.data.result.map(function(item, index) {
                return {
                  img: _this.resolveImg(item.periodsImg),
                  id: item.periodsId,
                  name: item.periodsName,
                  status: item.sellTicketStateExplain,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  address: item.address,
                  endDate: item.endTime,
                  startDate: item.startTime,
                  url: "courseDetail",
                  seller: item.remainingNumber,
                  isClick: true
                };
              });
            }
            // _this.relateData = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    //显示更多
    show() {
      let _this = this;
      this.$nextTick(function() {
        let heightIntroduce = this.$refs.introduce.offsetHeight;
        if (heightIntroduce < 100) {
          _this.introduceShow = _this.introduceShow;
        } else {
          _this.introduceShow = !_this.introduceShow;
        }
      });
    },
    playBtnClick() {
      if (this.playBtn.status) {
        this.playBtn.obj = document.querySelector(".play-audio").pause();
      } else {
        this.playBtn.obj = document.querySelector(".play-audio").play();
      }
      this.playBtn.status = !this.playBtn.status;
    },
    goPage(url, query) {
      if (!this.isLogin()) return false;
      this.$router.push({ name: url, query: query });
    },

    // 收藏
    collection() {
      let _this = this;
      _this.$http
        .post(
          "/api/customer/collection",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            goodsType: 4,
            goodsId: _this.$route.query.periodsId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            _this.$vux.toast.show({
              text: e.data.msg
            });
            _this.isIcon = !_this.isIcon;
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

.container {
  padding-bottom: 50px;

  .detail-header-box {
    @include halfpxline(0, $borderColor, 0, 0, 10px, 0);
  }

  .content-box {
    padding: $padding $padding 0;
    border-bottom: 5px solid $borderColor;

    .table-content-title {
      padding: $padding/2 0;
      line-height: 1;
      font-size: $fontSizeH4;

      span {
        @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
        text-indent: 0.5em;
        display: block;
      }
    }

    .showall {
      overflow: hidden;
      clear: both;
      background: #fff;
      margin-top: 5px;
      height: 100px;
    }

    .showall.active {
      height: auto;
      background: #fff;
    }

    .imgbtn {
      text-align: center;

      div {
        width: 150px;
        margin: 0 auto;
        display: inline-block;
      }
    }

    .rich-html {
      @include articleText();
    }

    .open-color {
      color: $colorYellowEasy;
    }
  }
}

.detail-btn-bottom {
  @include halfpxline(0, $borderColor, 1px, 0, 0, 0);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 30px;
  text-align: center;
  background: $bgGray;
  color: #fff;
  font-size: $fontSizeH3;
  z-index: 500;
  display: flex;

  .footer-collection {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    width: 11%;
    padding-right: 25px;
    color: #333;
  }

  .collection-icon {
    background: $bgGray url(~assets/img/icon/redHeart.png) no-repeat;
    background-position: 13px center;
    background-size: auto 40%;
  }

  .collection-icon-tow {
    background: $bgGray url(~assets/img/icon/heart.png) no-repeat;
    background-position: 13px center;
    background-size: auto 40%;
  }

  .detail-bottom-btn {
    flex: 1;
    display: flex;
    flex-direction: row;
    margin: $padding/2 $padding;
    padding: 5px 0;
    &.buy {
      background: $colorRedDeep;
      border-radius: 2em;
    }

    .left {
      @include halfpxline(0, $borderColor, 0, 2px, 0, 0);
    }

    div {
      width: 50%;
    }
  }
}
</style>