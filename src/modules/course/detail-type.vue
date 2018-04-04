<!-- 
	音频详情页
 -->
<template> 
	<div class="detail" v-if="list.title" v-cloak>
		<div class="detail-container">
      <template v-if="courseInfo.type == 'video' || courseInfo.type == 'course'">        		
			  <div :class="['video', { 'hidden': !videoHidden }]">
					<el-video ref="video" :video-data="course" :course-info="list" :has-buy="hasBuy"></el-video>
          <p class="detail-name">{{list.title}} <span>{{list.viewCount}}人观看</span></p>
				</div>
	    </template>

	    <template v-if="courseInfo.type == 'audio'">        		
				<el-audio ref="audio" @on-audio-buy="createOrder" @audio-btn-change="audioBtnChange" :audio-data="course" :course-info="list"></el-audio>
	    </template>
            
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <div class="list">
	      	<div v-show="tabSelected == 0">      
            <!-- 讲师 -->
            <div>
              <el-teacher :author-data="authorinfo"></el-teacher>
            </div>

            <!--课程评价-->
            <div class="detail-comment">
              <div class="table-content-title-evaluate">
                <p class="title-name">课程评价<span class="title-when-long">{{list.rank.toFixed(1)}}分</span></p>
	            </div>

              <div class="comment" >
                <div class="comment-list-block" v-for="(item, index) in commentInfoList.list" :key="index">
                  <div class="comment-list-block-info">
                    <div class="comment-img">
                      <img :src="item.headUrl" alt="">
                    </div>
                    <div class="name">
                      {{ item.customerName }}
                      <div class="rater">
                        <rater :active-color="wordBook.raterConfig.activeColor" :font-size="wordBook.raterConfig.fontSize" v-model="item.rank" disabled></rater>{{item.rank.toFixed(1)}}
                      </div>
                      <p>{{ item.content }}</p>
                    </div>
                  </div>
                </div>
                 <div v-if="hasBuy == 1">
                  <div v-if="commentInfoList.int<3" class="hide-more">
                    <div class="show-more">
                      <div @click="showMore">填写评价</div>
                    </div>
                  </div>

                  <div v-if="commentInfoList.int==3" class="show-more">
                    <div @click="showMore">填写并查看更多评价</div>
                  </div>
                </div>

              </div>
            </div>

            <div class="reward-record">
              <el-new-reward-list @reward-done="refreshReward" :reward-info="rewardInfo" :reward-refresh-status="rewardRefreshStatus"></el-new-reward-list>
            </div>
          </div>

	        <div v-show="tabSelected == 1">
	        	<el-img-text-rank @click.native="loadNext(ind)" v-for="(item, ind) in relateData" :img-text-data="item" :img-text-btn="-1" from-rank="true" :key="ind"></el-img-text-rank>
	        </div>
	      </div>
	    </div>
		</div>

		<div v-transfer-dom>
			<div class="detail-btn-bottom">
        <div class="footer-collection"  :class="{ 'collection-icon' : isIcon, 'collection-icon-tow': !isIcon}" @click="collection">收藏</div>
				<!-- <div class="detail-bottom-btn" @click="goPage('course', { type: '1' })">线下课程</div> -->
        <div class="footer-reward"><el-new-reward @reward-done="refreshReward" :reward-data="courseInfo"></el-new-reward></div>
				<!-- <div v-if="hasBuy == 0" class="detail-bottom-btn buy" @click="createOrder">订阅：￥{{ list.pay }}</div>-->
        <div v-if="hasBuy == 0" class="detail-bottom-btn buy" @click="goPage('curriculumOrder', { id: courseInfo.id, type: 'video' })">订阅：￥{{ list.pay }}</div> 
				<div v-else class="detail-bottom-btn buy" >已订阅</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
  import { Divider , XButton , Flexbox , FlexboxItem , Rater , Tab , TabItem , Swiper , SwiperItem , Sticky , TransferDom } from "vux";
  import elImgTextRank from "components/img-text/img-text-rank";
  import elComment from "components/comment/comment";
  import elAuthor from "components/author/author";
  import elNewReward from "components/reward/new-reward";
  import elNewRewardList from "components/reward/new-reward-list";
  import elProductAd from "components/product-ad/product-ad";
  import elVideo from "components/video/video";
  import elAudio from "components/video/audio";
  import elTeacher from "components/teacher/teacher";
  import imgPoster from "assets/img/audio.png";

  export default {
    name: "detail",
    directives: {
      TransferDom
    },
    components: {
      Divider,XButton,Flexbox,FlexboxItem,Rater,Tab,TabItem,Swiper,SwiperItem,Sticky,
      elImgTextRank,elComment,elAuthor,elNewReward,elNewRewardList,elProductAd,elVideo,elAudio,elTeacher
    },
    data() {
      return {
        activeVideo: -1, // 正在播放的音频或视频
        isIcon: false,
        title: "课程详情",
        imgPoster: "",
        hasBuy: false, // 是否购买
        playVisitStatus: false, // 是否点击过
        courseInfo: {
          spareType: "0", // spareType打赏类型 0产品 1头条
          type: this.$route.query.type,
          id: this.$route.query.id,
          name: "",
          desc: ""
        },
        rewardInfo: {
          spareType: "0", // spareType打赏类型 0产品 1头条
          goodsId: this.$route.query.id
        },
        commentInfo: {
          productId: this.$route.query.id,
          commentType: 1,
          hasBuy: 0
        },
        commentInfoList: {
          int: 0,
          commentType: 1,
          pageNum: 1,
          pageSize: 3,
          productId: this.$route.query.id,
          list: []
        },
        authorData: {
          authorId: String,
          companyId: String
        },
        authorinfo: {},
        list: {
          btn: "-1",
          title: "",
          type: "",
          pay: "",
          originalPrice: "",
          isBuy: "0",
          img: "",
          like: {
            num: 0,
            percent: 0
          },
          url: "",
          query: {
            id: this.$route.query.id,
            type: this.$route.query.type
          },
          viewCount: 0,
          rank: ""
        },
        tabDatas: [
          {
            value: "detail",
            title: "详情"
          },
          {
            value: "relate",
            title: "相关"
          }
        ],
        tabSelected: 0,
        course: {
          id: "",
          src: "",
          course: "",
          name: "",
          duration: 0,
          courseNum: 0,
          lecturer: "",
          subscribe: 0,
          desc: "",
          fileUrl: "",
          playauth: "",
          fileThumb: ""
        },
        relateDataBtn: "-1",
        relateData: [
          // {
          //   title: "",
          //   type: "",
          //   pay: "",
          //   isBuy: "0",
          //   img: "",
          //   like: {
          //     num: 0,
          //     percent: 0
          //   },
          //   idClick: false,
          //   url: "",
          //   query: {}
          // }
        ],
        playBtn: {
          status: false,
          obj: ""
        },
        type: {
          video: 1,
          audio: 0
        },
        rewardRefreshStatus: false, // 刷新列表数据
        videoHidden: true // 微信android机器video过高隐藏
      };
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route() {
        this.$router.go(0);
      },
    },
    mounted() {
      this.fetchData(true);
    },
    methods: {
      listenVideo() {
        let _this = this;
        let video = document.querySelector(".video");

        video.addEventListener("timeupdate", function() {
          if (video.currentTime > 30) {
            video.pause();
            alert("请先购买");
            _this.$vux.alert.show({
              content: "请先购买"
            });
          } else {
            video.play();
          }
        });
      },
      fetchData(status) {
        let _this = this,
          relateData = [],
          url,
          params = {};

        // if(status)
          _this.getRelateData();

        if (this.courseInfo.type == "course") {
          // url = '/wechat/discover/product/lessonDetails';
          // params = {
          // 			"userCode": _this.$store.state.user.userCode,
          // 			"productCode": _this.courseInfo.code,
          // 			"type": "video"
          // 		};
        } else {
          url = "/api/product/online";
          params = {
            customerId: _this.$store.state.user.userId,
            productId: _this.courseInfo.id
          };
        }

        this.$http.post(url, _this.qs.stringify(params)).then(function(e) {
          let responseData = e.data.data;
          if (e.data.code == 200) {
            _this.authorData = {
              authorId: responseData.authorId,
              companyId: responseData.companyId
            };
            let hasBuyState =
              responseData.price == 0 ||
              responseData.subscribeStatus > 0 ||
              _this.$store.state.user.isAvailable == 1 ||
              _this.arrContain(
                _this.$store.state.user.authorIds,
                responseData.authorId.toString()
              ) == true
                ? "1"
                : "0";
            _this.commentInfo.hasBuy = hasBuyState;
            _this.hasBuy = hasBuyState;

            _this.list.btn = hasBuyState == 1 ? "-1" : "0";
            _this.relateDataBtn = "0";

            _this.list.rank = responseData.rank || 5;
            _this.list.viewCount = responseData.viewCount;
            _this.list.title = responseData.name;
            _this.list.pay = responseData.price;
            _this.list.originalPrice = responseData.originalPrice;
            _this.list.isBuy = hasBuyState;
            _this.list.type = responseData.remark;
            _this.list.img = responseData.images;
            _this.list.like = {
              num: responseData.viewCount,
              percent: responseData.rank ? responseData.rank : 0
            };

            _this.course.id = _this.courseInfo.id;
            _this.course.fileUrl = responseData.fileUrl;
            _this.course.name = responseData.name;
            _this.course.hasBuy = hasBuyState;
            _this.course.childName = responseData.remark;
            // _this.course.duration = responseData.duration;
            _this.courseInfo.desc = _this.resolveRichTextImg(
              responseData.content
            );
            _this.courseInfo.name = responseData.name;

            _this.getAuthorInfo();
            _this.getCommentData();

            if (responseData.isCollection == 1) {
              _this.isIcon = true;
            }
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
      },
      // 讲师信息
      getAuthorInfo() {
        let _this = this;
        _this.$http.post(
            "/api/curriculum/authorsInfo",
            _this.qs.stringify({
              authorId: _this.authorData.authorId || "1",
              companyId: _this.authorData.companyId
            })
          ).then(function(e) {
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
              _this.course.lecturer = list[0].name;
              _this.course.fileThumb = list[0].img;
              // console.log(_this.course, list)
              _this.authorinfo = list[0];
              // console.log(_this.authorinfo);
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      getRelateData() {
        let _this = this;
        this.$http
          .post("/api/product/online/list",
            this.qs.stringify({
              onlineType: _this.type[_this.$route.query.type],
              topTag: "",
              freeStatus: "",
              showRankingStatus: "",
              productId: _this.courseInfo.id,
              pageNum: 1,
              pageSize: 4
            })
          )
          .then(function(e) {
            let list = [],
                audioList = [];

            if (e.data.code == 200) {
              if (e.data.data && e.data.data.result && e.data.data.result.length > 0) {
                list = e.data.data.result.map(function(item, index) {
                  return {
                    img: item.images,
                    id: item.id,
                    title: item.name,
                    type: item.remark,
                    src: item.fileUrl,
                    pay: item.price,
                    authorImg: item.authorImages,
                    authorName: item.authorName,
                    originalPrice: item.originalPrice, // 原价
                    isBuy: item.subscribeStatus || 0,
                    playCount: item.viewCount,
                    onlineType: item.onlineType,
                    like: {
                      num: item.viewCount,
                      percent: item.rank || 0
                    },
                    isClick: false,
                    url: "",
                    query: {}
                  }
                });
              }

              _this.relateData = list;
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      // 收藏
      collection() {
        let _this = this;
        _this.$http
          .post("/api/customer/collection",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              goodsType: 1,
              goodsId: _this.$route.query.id
            })
          ).then(function(e) {
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
      playBtnClick() {
        if (!this.playVisitStatus) {
          this.playVisitStatus = true;
          this.playCount(this.$route.query.code);
        }

        if (this.playBtn.status) {
          this.playBtn.obj = document.querySelector(".play-audio").pause();
        } else {
          this.playBtn.obj = document.querySelector(".play-audio").play();
        }
        this.playBtn.status = !this.playBtn.status;
      },
      playVideo() {
        if (!this.playVisitStatus) {
          this.playVisitStatus = true;
          this.playCount(this.$route.query.code);
        }
      },
      audioBtnChange (data) {
        let len = this.relateData.length;
        if(data == 'prev') {
          if(this.activeVideo == -1) {
            this.loadNext(len-1);
          } else {
            this.loadNext(this.activeVideo - 1)
          }
        } else if (data == 'next') {
          if(this.activeVideo == len - 1) {
            this.loadNext(-1);
          } else {
            this.loadNext(this.activeVideo + 1)
          }
        }
      },
      // 播放下一个
      loadNext(ind) {
        let relateData = this.relateData[ind];
        // console.log(relateData, this.relateData)
        this.activeVideo = ind;

        // this.relateData.playCount = relateData.playCount;
        if(relateData.onlineType == 1) {      
          this.$refs.video.loadNext({src: relateData.src, id: relateData.id});
        } else {
          this.$refs.audio.loadNext({
            id: relateData.id,
            name: relateData.title,
            childName: relateData.type,
            fileUrl: relateData.src,
            fileThumb: relateData.authorImg,
            lecturer: relateData.authorName,
            isBuy: relateData.isBuy
          });
        }

        this.courseInfo.id = relateData.id;
        this.fetchData();
      },
      hiddenVideo(data) {
        this.videoHidden = !data;
      },
      goPage(url, query) {
        this.$router.push({ name: url, query: query });
      },
      createOrder() {
      //   let _this = this;
      //   if (!this.isLogin()) return false;

      //   _this.$http.post("/api/product/online/order/confirm",
      //       _this.qs.stringify({
      //         productId: _this.courseInfo.id,
      //         customerId: _this.$store.state.user.userId,
      //         type: 2,
      //         voucherStatus: 0,
      //         walletStatus: 0,
      //         num: 1
      //       })
      //     ).then(function(e) {
      //       if (e.data.code == 200) {
      //         _this.$router.push({
      //           name: "confirmOrder",
      //           query: {
      //             orderId: e.data.data.orderId,
      //             orderType: 2,
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
      refreshReward(val) {
        this.rewardRefreshStatus = val;
      },
      // 评价
      getCommentData() {
        let _this = this;
        _this.$http
          .post(
            "/api/product/comment/list",
            _this.qs.stringify({
              productId: this.commentInfoList.productId,
              commentType: this.commentInfoList.commentType,
              pageNum: this.commentInfoList.pageNum,
              pageSize: this.commentInfoList.pageSize
            })
          )
          .then(function(e) {
            // console.log(e);
            if (e.data.code == 200) {
              let list = [];
              if (
                e.data.data &&
                e.data.data.result &&
                e.data.data.result.length > 0
              ) {
                list = e.data.data.result.map(function(item, ind) {
                  return {
                    id: item.id,
                    customerId: item.customerId,
                    customerName: item.customerName,
                    content: item.content,
                    createTime: item.createTime,
                    rank: item.rank,
                    headUrl: item.headUrl
                  };
                });
              }
              // console.log(list);
              _this.commentInfoList.list = list;
              _this.commentInfoList.int = e.data.data.result.length;
              // console.log(_this.commentInfoList.int);
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },

      // 跳转评价列表
      showMore() {
        this.$router.push({
          name: "commentType",
          query: { id: this.$route.query.id, type: 1 }
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions",
    "~assets/css/core/mixins",
    "~assets/css/core/vars";

  .detail {
    .detail-container {
      .text {
        .type {
          @include ellipsisMore(30);
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions",
    "~assets/css/core/mixins",
    "~assets/css/core/vars";

  .detail-container {
    padding-bottom: 50px;

      .detail-name {
        font-size: $fontSizeH4;
        padding: $padding;
        @include ellipsisOne();
        @include halfpxline(0, $borderColor, 0, 0, 5px, 0);
        span{
          float: right;
        }
      }

      .list {
        padding-top: $padding;

        .video,
        .audio-msg {
          width: 100%;
          // height: 200px;
          background: #333;

          video {
            width: 100%;
            height: 100%;
          }
          &.hidden {
            video {
              visibility: hidden;
              display: none;
            }
          }
        }

        .audio-msg {
          position: relative;
          height: auto;
          img {
            width: 100%;
          }
        }

        .detail-header-msg {
          padding: $padding;
          line-height: 2;
        }
        .detail-header-msg-desc {
          padding: $paddingTop 0;
          text-align: center;

          & > p {
            line-height: 1.35;
          }
        }
    }
  }

  .swiper-desc {
    padding: $padding;
  }

  // 音乐播放
  $playBtnW: 60px;

  .play-btn {
    position: absolute;
    bottom: $padding;
    left: 0;
    right: 0;
    width: $playBtnW;
    height: $playBtnW;
    margin: 0 auto;
    border-radius: $playBtnW;
    background: url("~assets/img/index/play-start.png") no-repeat;
    background-size: 100%;

    &.active {
      // animation: mymove 2s  linear infinite;
      background-image: url("~assets/img/index/play.png");
    }
  }

  @keyframes mymove {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .audio-detail-desc {
    margin-bottom: $paddingTop;
    padding: 0 6px;

    &.active {
      .audio-detail-desc-content {
        max-height: 11111400px;
      }
    }

    .fa {
      font-size: $fontSizeH2;
      text-indent: 0.5em;
    }

    .audio-detail-desc-header {
      font-size: $fontSizeH3;
      color: $colorRedDeep;
    }

    .audio-detail-desc-content {
      max-height: 0;
      overflow: hidden;
      transition: 1s;

      p {
        text-align: justify;
        text-indent: 2em;
      }
    }
  }

  .reward-record {
    @include uiBorderTop();  
  }

  .table-content-title-evaluate {
    padding: $padding 0;
    line-height: 1;
    font-size: $fontSizeH4;
    color: $fontColorBlack;

    .title-name {
      display: block;
      @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
      text-indent: 0.5em;
    }
    .title-when-long {
      color: $fontColorGray;
      float: right;
    }
  }

  .detail-comment {
    @include uiBorderTop();
    background-color: #fff;
    padding: $padding $padding 0;
    border-top: 5px solid $bgGray;
  }
  .comment {
    height: 100%;
    padding: 0 3px;

    .comment-list-block {
      padding: $padding 0;
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
    }

    .comment-list-block-info {
      // padding-left: 10px;
      width: 100%;
      line-height: 1.5;
      display: flex;

      .comment-img {
        width: $quotationUserImgW;
        height: $quotationUserImgW;
        background-color: #666;
        border-radius: $quotationUserImgW;
        img {
          width: 100%;
          height: 100%;
          border-radius: $quotationUserImgW;
        }
      }

      .name {
        flex: 1;
        @include ellipsisOne();
        font-size: $fontSize;
        color: $fontColorBlack;
        padding: 0 $padding;
      }
      .rater {
        font-size: $fontSizeTips;
        color: $fontColorGray;
      }
    }
    .show-more {
      // margin: $padding 0;
      text-align: center;
      padding: $padding;
      div {
        // background-color: #666;
        padding: 2px $padding;
        border: 1px solid $colorYellowEasyDeep;
        display: inline-block;
        border-radius: 10px;
      }
    }
    .hide-more {
      margin: $padding 0;
    }
  }

  .detail-btn-bottom {
    border-top: 1px solid $bgGray;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    text-align: center;
    background: $colorYellowEasy;
    color: #fff;
    font-size: $fontSizeH3;
    display: flex;
    z-index:500;

    .footer-collection {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      width: 27%;
      padding-right: 25px;
      color: #333;
      @include halfpxline(0, $borderColor,  0, 1px,0, 0);
      // background-color: $colorBlue;
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

    .footer-reward {
      height: 100%;
      width: 27%;
    }

    .detail-bottom-btn {
      flex: 1;

      &.buy {
        background: $colorRedDeep;
      }
    }
  }
</style>