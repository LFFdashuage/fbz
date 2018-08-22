<!--
专栏详情
-->
<template>
  <div class="specialColumnDetail">
    <!-- 顶部详情 -->
    <div class="special-detail">
      <template v-if="specialData.onlineType == 1">        		
        <el-video ref="video" :video-data="videoData" :has-buy="specialData.isBuy"></el-video>
      </template>
      <template  v-if="specialData.onlineType == 0">
        <el-audio @on-audio-buy="purchase" @audio-btn-change="audioBtnChange" ref="audio" :audio-data="videoData"></el-audio>
      </template>

       <section>      
  	    <div class="term-info">
          <p class="name" v-if="specialData.onlineType == 1">{{ specialData.termName }}</p>
          <p class="term-info-ramk">
            <span class="price">￥{{ specialData.price | numToCash}}</span>
            <span class="original-price">￥{{ specialData.originalPrice | numToCash}}</span>
            <span class="total-term">更{{specialData.updateCount}}期|共{{specialData.totalTerm}}期</span>
          </p>
          <p class="term-info-footer">
            <span class="rater">
              <rater :active-color="wordBook.raterConfig.newActiveColor" :font-size="wordBook.raterConfig.fontSize" v-model="specialData.termRank" disabled></rater>
              {{specialData.termRank.toFixed(1)}}分
            </span>
            <span class="play-count">{{ specialData.playCount }}人学过</span>
            <span class="termTypeName">{{specialData.termTypeName}}</span>
          </p>
        </div>
      </section>

    </div>

  	<div class="tab">
      <tab v-model="tabSelected">
        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
      </tab>
      <div class="content">

        <!-- 左边详情 -->
      	<template v-if="tabSelected == 0">
          <div>
            <el-table-detail :table-detail-data="specialData" :author-list-data="authorList"></el-table-detail> 
          </div>
      	</template>

        <!-- 右部列表 -->
        <template v-if="tabSelected == 1">
					<div class="special-list">
            
            <!-- 数字选集按钮 -->
            <div class="special-list-radio"> 
              <checker v-model="videoint" radio-required default-item-class="checker-special-default" selected-item-class="checker-special-selected" >
                <checker-item @click.native="loadNext(index,item)" :value="index" v-for="(item, index) in specialData.list" :key="index" >{{index+1}}</checker-item>
              </checker>
            </div>

            <div class="table-content-title">
	            <span class="title-name">专栏目录</span>
              <span class="when-long">总时长:{{specialData.totalDuration}}分钟</span>
	          </div>

            <!-- 列表选集 -->
            <checker v-model="videoint" radio-required default-item-class="checker-catalog-list-default" selected-item-class="checker-catalog-list-selected" >
              <checker-item @click.native="loadNext(index,item)" :value="index" v-for="(item, index) in specialData.list" :key="index" >
                <div class="catalog-list">
                  <div class="catalog-list-title">
                    <span class="serial-number">{{index+1}}.</span>
                    <p>{{item.childName}} </p>
                    <span class="when-long">{{item.duration}}分钟</span>
                  </div>
                </div>
              </checker-item>
            </checker>

          </div>
        </template> 

      </div>
    </div>

    <div v-transfer-dom>
      <div class="footer">
        <!-- <div class="footer-content"> -->

          <div class="footer-collection"  :class="{ 'collection-icon' : isIcon, 'collection-icon-tow': !isIcon}" @click="collection"></div>
          

          <div class="detail-bottom-btn buy ">
            <div class="left" @click="goPage('forceCourse', { id: specialData.authorId, type: 'course'})" >线下课程</div>
            
            <div v-if="specialData.isBuy == 0" @click="goPage('curriculumOrder', { id: goPageId, type: 'specialColumn' })">立即订阅</div>
            <div v-else>已订阅</div>
          </div>

          <!-- <div  class="footer-purchase" @click="goPage('curriculumOrder', { id: goPageId, type: 'specialColumn' })">
            <p>立即购买</p>
          </div>
          <div v-else class="footer-purchase">
            <p>已购买</p>
          </div> -->
        
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  TransferDom,
  Popup,
  Tab,
  TabItem,
  Swiper,
  Group,
  Rater,
  XTextarea,
  SwiperItem,
  Checker,
  CheckerItem
} from "vux";
import elAudio from "components/video/audio";
import elVideo from "components/video/video";
import elTableDetail from "components/special-column/table-detail";

export default {
  name: "specialColumnDetail",
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Swiper,
    Popup,
    Group,
    XTextarea,
    Rater,
    SwiperItem,
    Checker,
    CheckerItem,
    elTableDetail,
    elAudio,
    elVideo
  },
  data() {
    return {
      videoint: 0,
      commentRater: 0,
      commentContent: "",
      activeVideo: 0,
      goPageId: this.$route.query.id,
      specialData: {
        termId: this.$route.query.id,
        termName: "",
        images: "",
        price: "",
        originalPrice: "",
        playCount: "",
        remark: "",
        totalTerm: 0,
        createTime: "",
        fileUrl: "",
        content: "",
        authorId: "",
        termTypeName: "",
        updateCount: 0,
        termType: 0,
        isBuy: 0,
        termRank: 5,
        // fileThumb: "",
        totalDuration: "",
        onlineType: "",
        list: []
      },
      videoData: {
        authorName: "",
        authorImg: "",
        fileThumb: "",
        fileUrl: "",
        onlineType: ""
      },
      authorList: {},
      tabSelected: 0,
      tabDatas: [
        {
          value: "detail",
          title: "详情"
        },
        {
          value: "curriculum",
          title: "选集"
        }
      ],
      isIcon: false
    };
  },
  mounted() {
    this.fetchData();
    // console.log("学霸卡1可用，0不可用", this.$store.state.user.isAvailable);
    // console.log("已购老师ID", this.$store.state.user.authorIds);
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.$http
        .post(
          "/api/product/term",
          _this.qs.stringify({
            termId: this.$route.query.id,
            customerId: this.$store.state.user.userId
          })
        )
        .then(function(e) {
          let resData = e.data.data,
            list = [];
          if (e.data.code == 200) {
            let hasBuyState =
              _this.$store.state.user.isAvailable == 1 ||
              _this.arrContain(
                _this.$store.state.user.authorIds,
                resData.authorId.toString()
              )
                ? "1"
                : "0";
            let onlineType = "";

            if (resData.childTerm && resData.childTerm.length > 0) {
              list = resData.childTerm.map(function(item, index) {
                if (index == 0) {
                  onlineType = item.onlineType;
                }

                return {
                  authorName: item.authorName,
                  authorImg: item.authorImages,
                  name: resData.termName,
                  isBuy:
                    item.childBuyStatus == 1 ||
                    hasBuyState == 1 ||
                    resData.price
                      ? 1
                      : 0,
                  createTime: item.childCreateTime,
                  fileUrl: item.childFileUrl,
                  id: item.childId,
                  img: item.childImages,
                  childName: item.childName,
                  playCount: item.childViewCount,
                  duration: item.duration,
                  onlineType: item.onlineType
                };
              });
            }

            _this.specialData = {
              termId: _this.specialData.termid,
              termName: resData.termName,
              images: resData.images,
              price: resData.price || 0,
              originalPrice: resData.originalPrice || 0,
              playCount: resData.playCount,
              remark: resData.remark,
              totalTerm: resData.totalTerm || 0,
              createTime: resData.createTime,
              fileUrl: resData.fileUrl,
              content: resData.content,
              authorId: resData.authorId,
              termTypeName: resData.termTypeName,
              updateCount: resData.updateCount || 0,
              termType: resData.termType,
              isBuy:
                resData.isBuy == 1 || hasBuyState == 1 || resData.price == 0
                  ? 1
                  : 0,
              termRank: resData.termRank || 5,
              // fileThumb: "",
              list: list,
              isCollection: resData.isCollection,
              totalDuration: resData.totalDuration,
              onlineType: onlineType
            };
            _this.videoData = {
              fileThumb: list[0].authorImg,
              fileUrl: list[0].fileUrl,
              isBuy: list[0].isBuy,
              name: list[0].name,
              childName: list[0].childName,
              lecturer: list[0].authorName
            };
            _this.getAuthorsInfo();
            if (resData.isCollection == 1) {
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
    getAuthorsInfo() {
      let _this = this;
      _this.$http
        .post(
          "/api/curriculum/authorsInfo",
          _this.qs.stringify({
            authorId: this.specialData.authorId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (e.data.data && e.data.data && e.data.data.length > 0) {
              list = e.data.data.map(function(item, ind) {
                return {
                  // authorName: item.authorName,
                  // authorImg: item.authorImg,
                  // authorContent: item.authorContent,
                  // companyName: item.companyName,
                  // authorRemark: item.authorRemark
                  img: item.authorImg,
                  name: item.authorName,
                  label: item.authorRemark,
                  content: item.authorContent,
                  companyName: item.companyName,
                  companyContent: item.companyContent,
                  companyImg: item.companyImg
                };
              });
              _this.authorList = list[0];
            }
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    // 立即购买
    purchase() {
      //   let _this = this;
      //   _this.$http
      //     .post(
      //       "/api/product/term/order/confirm",
      //       _this.qs.stringify({
      //         productId: this.$route.query.id,
      //         customerId: _this.$store.state.user.userId,
      //         num: 1,
      //         voucherStatus: 0,
      //         walletStatus:0
      //       })
      //     )
      //     .then(function(e) {
      //       if (e.data.code == 200) {
      //         _this.$router.push({
      //           name: "confirmOrder",
      //           query: {
      //             orderId: e.data.data.orderId,
      //             orderType: 4,
      //             type: e.data.data.type
      //           }
      //         });
      //       } else {
      //         _this.$vux.alert.show({
      //           content: e.data.msg
      //         });
      //       }
      //     });
    },

    // 收藏/取消收藏
    collection() {
      let _this = this;
      _this.$http
        .post(
          "/api/customer/collection",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            goodsType: 2,
            goodsId: _this.$route.query.id
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
    },

    // 评价
    evaluate() {
      this.$router.push({
        name: "comment",
        query: { id: this.$route.query.id }
      });
    },
    audioBtnChange(data) {
      console.log(data);
      let len = this.specialData.list.length;
      if (data == "prev") {
        if (this.activeVideo == 0) {
          this.loadNext(len - 1);
        } else {
          this.loadNext(this.activeVideo - 1);
        }
      } else if (data == "next") {
        if (this.activeVideo == len - 1) {
          this.loadNext(0);
        } else {
          this.loadNext(this.activeVideo + 1);
        }
      }
    },
    goPage(url, query) {
      this.$router.push({ name: url, query: query });
    },
    // 播放
    loadNext(ind) {
      if (this.activeVideo == ind) return;
      let specialData = this.specialData.list[ind];

      this.activeVideo = ind;

      this.specialData.playCount = specialData.playCount;
      if (specialData.onlineType == 1) {
        this.$refs.video.loadNext({
          src: specialData.fileUrl,
          id: specialData.id
        });
      } else {
        this.$refs.audio.loadNext({
          id: specialData.id,
          name: specialData.name,
          childName: specialData.childName,
          fileUrl: specialData.fileUrl,
          fileThumb: specialData.authorImg,
          lecturer: specialData.authorName,
          isBuy: specialData.isBuy
        });
      }
      this.specialData.onlineType = specialData.onlineType;
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

.special-detail {
  width: 100%;
  border-bottom: 5px solid $bgGray;
  line-height: 1;
  text-align: left;
  background: #fff;
  // display: inline-block;
  // padding-bottom: $padding;
  position: relative;

  .term-info {
    padding: $padding;
    .name {
      text-align: left;
      font-size: $fontSizeH3;
      @include ellipsisOne();
      margin-bottom: $padding;
    }
    .term-info-ramk {
      .price {
        font-size: $fontSizeH2;
        color: $colorRedDeep;
      }
      .original-price {
        font-size: $fontSizeTips;
        color: $fontColor;
        text-decoration: line-through;
      }
      .total-term {
        font-size: $fontSizeTips;
        color: $colorYellowEasyDeep;
        float: right;
      }
    }
    .term-info-footer {
      margin-top: 6px;
      .play-count {
        margin-left: 20px;
        font-size: $fontSizeTips;
        color: $fontColor;
      }
      .termTypeName {
        display: inline-block;
        float: right;
        font-size: $fontSizeTips;
        // border: 1px solid $bgGray;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        background-color: $colorGrayDisabled;
      }
      .rater {
        font-size: $fontSizeTips;
      }
    }
  }
}

.content {
  .special-list {
    margin-bottom: 70px;
  }

  .special-list-radio {
    width: 100%;
    padding: $padding;
    margin-bottom: $padding;
    @include halfpxline(0, $borderColor, 0, 0, 10px, 0);

    .vux-checker-box {
      padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
    }
  }

  .table-content-title {
    display: flex;
    margin: 0 $padding;
    padding: $padding 0;
    @include halfpxline(0, $borderColor, 0, 0, 1px, 0);
    line-height: 1;

    .title-name {
      flex: 1;
      display: block;
      @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
      text-indent: 0.5em;
      color: $fontColorBlack;
      font-size: $fontSizeH4;
    }
  }

  .checker-catalog-list-default {
    width: 100%;
  }

  .checker-catalog-list-selected {
    color: $colorYellowEasy;
    // background-color: red;
    p {
      color: $colorYellowEasy;
    }
  }

  .catalog-list {
    width: 100%;
    padding: $padding/2;

    .catalog-list-title {
      display: flex;
      padding: $padding;
      @include halfpxline(0, $borderColor, 0, 0, 1px, 0);

      .serial-number {
        color: $colorYellowEasy;
        font-size: $fontSize;
      }

      p {
        flex: 1;
        line-height: 1.35;
        margin-left: 5px;
        @include ellipsisMore(1);
        font-size: $fontSize;
      }
    }
  }

  .when-long {
    font-size: $fontSize;
    color: $fontColorGray;
  }

  .checker-special-default {
    margin: 5px;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid $bgGray;
    background-color: $bgGray;
    border-radius: 5px;
  }

  .checker-special-selected {
    border: 1px solid $bgGray;
    color: $colorYellowEasy;
  }
}

.footer {
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
    // background-color: $colorBlue;
  }

  .footer-trial {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    width: 27%;
    padding-right: 20px;
    background: $bgGray url(~assets/img/icon/trial.png) no-repeat;
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
}
</style>