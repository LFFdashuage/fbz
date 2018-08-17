<!-- 
	首页
 -->

<template>
	<div class="index" v-cloak>
		<div v-transfer-dom>		
			<el-top></el-top>
		</div>
		
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" ref="scrollerBottom" v-cloak>
			<div class="index-container scroll-fix">
			
				<div class="banner">
		    	<swiper auto height="167px" dots-position="center" :interval=2000 loop class="shadow">
		    	<!-- <swiper auto dots-position="center" :interval=2000 :list="bannerTopDatas" loop> -->
		    		<swiper-item v-for="(item, index) in bannerTopDatas" :key="index">
		    			<div class="banner-img" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
		    		</swiper-item>
		    	</swiper>
				</div>
				
				<div v-if="user.level == 'commom'"  class="join-in">
					<label for="">现在加入，你将获得200份免费协议资料。</label>
					<span class="join-btn" @click="joinIn">加入富班长</span>
				</div>

        <!-- 培训头条 -->

        <div class="news">
          <div class="index-news">
            <div class="index-news-title"><i>培训<span>头条</span></i></div>
            <div class="index-news-msg">
              <swiper auto height="32px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
                <swiper-item v-for="(item, index) in indexNewsList.list" :key="index"><p @click="goPage({name: 'newsDetail', query: {id: item.id}})">{{ item.title }}</p></swiper-item>
              </swiper>
            </div>
            <div class="index-news-btn" @click="goPage({name: 'news'})">更多 <span class="fa fa-angle-right"></span></div>
          </div>
        </div>
        
				
				<div class="entry">
					<div v-for="(item, index) in entryDatas" :key="index" :class="['entry-' + item.img]" @click="entry(item.url, item.type)">
						<p>{{ item.name }}</p>
					</div>
				</div>
				<!-- <div @click="goPage({name: 'class'})">
					跳到班级主页
				</div>
				<div @click="goPage({name: 'classMate'})">
					跳到同学页
				</div> -->
				<!-- 课程预告 -->
				<el-card-more :card-more-data="coursePreview" class="card-first">
					<scroller lock-y slot="content" height="139px" ref="scrollerBottomCourse" v-cloak :scrollbar-x="false">
						<div @click.stop="stopTop" class="card-more-content-slot course-preview clearfix" >
							<div @click="goPage({name: 'courseNewDetail', query: { periodsId: item.id } })" class="course-preview-block" v-for="(item, index) in coursePreview.list" :key="index">
								<div class="course-preview-header">
									<img :src="item.img" alt="头像">
								</div>
								<p class="author">{{ item.author }}</p>
								<p class="name">{{ item.name }}</p>
								<span>{{ item.date }}</span>
							</div>
						</div>
					</scroller>
				</el-card-more>

				

				<!-- 音频 -->
				<el-card-more :card-more-data="tuijianAudioDatas" class="border-top">
					<!-- <scroller lock-y slot="content" height="133px" ref="scrollerBottomCourse" v-cloak :scrollbar-x="false">
						<div @click.stop="stopTop" class="card-more-content-slot sound-preview clearfix" >
							<div @click="goPage({name: 'courseTypeDetail', query: { type: item.type, id: item.id} })" class="sound-preview-block" v-for="(item, index) in tuijianAudioDatas.list" :key="index">
								<div class="sound-preview-header">
									<img :src="item.src" alt="头像">
                  <div class="icon">
                    <img src="~assets/img/icon/icon-audio.png" alt="">
                  </div>
								</div>
								<p>{{ item.name }}</p>
							</div>
						</div>
					</scroller> -->    

          <div slot="content">
            <div class="audio-block-item"  @click="goPage({name: 'courseTypeDetail', query: { type: itemc.type, id: itemc.id} })" v-for="(itemc , indc) in tuijianAudioDatas.list" :key="indc" >

              <div class="audio-img">
                <img :src="itemc.src" alt="头像">
              </div>

              <div class="right-audio-info">
             	<p class="name">{{ itemc.name }}</p>
               	<p class="dese">{{ itemc.remark }}</p>
              </div>

            </div>
          </div>
				</el-card-more>

				<!-- 视频 -->
				<el-card-more :card-more-data="tuijianVideoDatas">
					<!-- <scroller lock-y slot="content" height="146px" ref="scrollerBottomCourse" v-cloak :scrollbar-x="false">
						<div @click.stop="stopTop" class="card-more-content-slot screen-preview clearfix" >
							<div @click="goPage({name: 'courseTypeDetail', query: { type: item.type, id: item.id} })" class="screen-preview-block" v-for="(item, index) in tuijianVideoDatas.list" :key="index">
								<div class="screen-preview-header">
									<img :src="item.src" alt="头像">
                  <div class="icon">
                    <img src="~assets/img/icon/icon-video.png" alt="">
                  </div>
								</div>
								<p>{{ item.name }}</p>
                
							</div>
						</div>
					</scroller> -->

           <div slot="content" >
             <div class="video-block">
            <div class="video-block-item" @click="goPage({name: 'courseTypeDetail', query: { type: itemv.type, id: itemv.id} })" v-for="(itemv , indc) in tuijianVideoDatas.list" :key="indc" >

              <div class="video-img">
                <img :src="itemv.src" alt="头像">
              </div>
              <p>{{ itemv.name }}</p>

              <div class="icon">
                 <img src="~assets/img/icon/icon-video.png" alt="">
              </div>

            </div>
            </div>
          </div>

				</el-card-more>

				<!-- 视频 <el-card-more :card-more-data="tuijianVideoDatas">
					<div class="card-more-content-slot clearfix" slot="content">
						<el-card-more-block class="card-more-padding" v-for="(item, index) in tuijianVideoDatas.list" :card-more-block-data="item" :key="index"></el-card-more-block>
					</div>
				</el-card-more> -->

				<!-- 专栏订阅 -->
				<el-card-more :card-more-data="specialColumn">
					<div slot="content">
						<el-img-text-column v-for="(item, index) in specialColumn.list" :img-text-data="item" :key="index"></el-img-text-column>
					</div>
				</el-card-more>

				<!-- 底部入口 entrance -->
				<!-- <div class="index-entrance">
					<div class="index-entrance-block" v-for="(item, index) in entranceData" :key="index">				
						<div :class="['index-entrance-block-content', 'index-entrance-' + item.img]">
							<p>{{ item.title }}</p>
							<span>{{ item.titleEn }}</span>
						</div>
					</div>
				</div> -->
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
import { mapState } from "vuex";
import hold from "src/commons/hold";
import {
  Scroller,
  Group,
  Cell,
  Swiper,
  SwiperItem,
  Card,
  Panel,
  Popup,
  XInput,
  XButton,
  TransferDom
} from "vux";

import elTop from "components/index/top";
import elTuijian from "components/tuijian/tuijian";
import elImgText from "components/img-text/img-text";
import elImgTextZhuanlan from "components/img-text/img-text-zhuanlan";
import elVideo from "components/video/video";
import elCardMore from "components/card/card-more";
import elCardMoreBlock from "components/card/card-more-block";
import elImgTextNews from "components/img-text/img-text-news";
import elImgTextColumn from "components/img-text/index-img-text-column";

import { getterIndex } from "services/index";

import imgBanner from "assets/img/banner-base.jpg";

export default {
  name: "index",
  directives: {
    TransferDom
  },
  components: {
    Scroller,
    Group,
    Cell,
    Swiper,
    SwiperItem,
    Card,
    Panel,
    Popup,
    XInput,
    XButton,
    elTop,
    elTuijian,
    elImgText,
    elImgTextZhuanlan,
    elVideo,
    elCardMore,
    elCardMoreBlock,
    elImgTextNews,
    elImgTextColumn
  },
  data() {
    return {
      imgBanner: imgBanner,
      scrollerInfo: {
        offsetBottom: 94
      },
      bannerWidthHeight: this.wordBook.bannerWidthHeight,
      bannerTopDatas: [],
      bannerBottomDatas: [],
      entryDatas: getterIndex.entryDatas,
      coursePreview: {
        title: "课程预告",
        url: {
          name: "courseNav"
        },
        text: "更多",
        list: []
      },
      tuijianAudioDatas: {
        title: "音频",
        url: {
          name: "rankList",
          params: {
            type: "audio"
          }
        },
        text: "更多",
        list: []
      },
      tuijianVideoDatas: {
        title: "视频",
        url: {
          name: "rankList",
          params: {
            type: "video"
          }
        },
        text: "更多",
        list: []
      },
      indexNewsList: {
        title: "培训头条",
        newsTop: {
          title: "",
          id: ""
        },
        url: {
          name: "news"
        },
        text: "更多",
        list: [],
        timeout: ""
      },
      specialColumn: {
        title: "专栏",
        url: {
          name: "specialColumn"
        },
        text: "更多",
        list: []
      },
      entranceData: [
        {
          title: "赚钱风口",
          titleEn: "Make money outlet",
          img: "outlet"
        },
        {
          title: "平台服务",
          titleEn: "Platform services",
          img: "service"
        },
        {
          title: "招商融资",
          titleEn: "Investment financing",
          img: "investment"
        },
        {
          title: "技术支持",
          titleEn: "Technical support",
          img: "support"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  watch: {
    bannerTopDatas: (newValue, oldValue) => {
      console.log(1);
      // alert(0)
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    stopTop() {},

    fetchData() {
      let _this = this;
      // 获取所有数据
      // _this.getAd();
      _this.getHomePage();
    },

    //获取主页全部数据
    getHomePage() {
      let _this = this;
      _this.$http.post("/api/index/homePage").then(function(e) {
        let resData = e.data.data,
          topList = [],
          audioList = [],
          videoList = [],
          newsList = [],
          lessonsList = [],
          termList = [];
        if (e.data.code == 200) {
          // console.log(e.data.data)

          //top 轮播
          if (resData.adTopList.length > 0) {
            topList = resData.adTopList.map(function(item, index) {
              return {
                url: item.adLinked,
                img: item.images
              };
            });

            _this.bannerTopDatas = topList;
          }
          //音频
          if (resData.audioList.length > 0) {
            audioList = resData.audioList.map(function(item, index) {
              return {
                id: item.id,
                src: item.images,
                name: item.name,
                remark: item.remark,
                type: "audio"
              };
            });

            _this.tuijianAudioDatas.list = audioList;
          }

          //视频
          if (resData.videoList.length > 0) {
            videoList = resData.videoList.map(function(item, index) {
              return {
                id: item.id,
                src: item.images,
                name: item.name,
                type: "video"
              };
            });

            _this.tuijianVideoDatas.list = videoList;
          }

          //头条
          if (resData.newsList && resData.newsList.length > 0) {
            newsList = resData.newsList.map(function(item, index) {
              if (index == 0) {
                _this.indexNewsList.newsTop = {
                  id: item.id,
                  title: item.name,
                  ind: index
                };
              }
              return {
                id: item.id,
                img: _this.resolveImg(item.images),
                title: item.name,
                ind: index
              };
            });
            _this.indexNewsList.list = newsList;
          }

          //课程预告
          if (resData.lessonsList && resData.lessonsList.length > 0) {
            lessonsList = resData.lessonsList.map(function(item, ind) {
              return {
                id: item.id,
                img: item.images,
                author: item.authorName,
                name: item.name,
                date: item.startDate
              };
            });
            _this.coursePreview.list = lessonsList;
          }

          //专栏
          if (resData.termList && resData.termList.length > 0) {
            termList = resData.termList.map(function(item, ind) {
              return {
                id: item.id,
                img: item.images,
                price: item.price,
                readCount: item.playCount,
                title: item.name,
                authorName:item.authorName,
                totalTerm: item.totalTerm,
                upToDate: item.updateCount
              };
            });
          }
          _this.specialColumn.list = termList;
        } else {
          _this.$vux.alert.show({
            content: e.data.msg
          });
        }
        _this.resetView();
      });
    },
    //加入富班长
    joinIn() {
      // this.$router.push({ name: "banding"});
      this.$router.push({ name: "binding" });
    },
    getAd() {
      let _this = this;
      _this.$http.post("/api/goods/recommend").then(function(e) {
        if (e.data.code == 200) {
          console.log(e.data);
        } else {
          _this.$vux.alert.show({
            content: e.data.msg
          });
        }
        _this.resetView();
      });
    },

    updateNews() {
      // // 定时更新显示的广告
      // 	let _this = this;
      // if(_this.indexNewsList.timeout)
      // 	clearTimeout(_this.indexNewsList.timeout);
      // let newsTop = _this.indexNewsList.newsTop,
      // 	newsTopList = _this.indexNewsList.list,
      // 	ind = newsTop.ind;
      // if(ind == 3) {
      // 	_this.indexNewsList.newsTop = {
      // 		id: newsTopList[0].id,
      // 		title: newsTopList[0].title,
      // 		ind: 0
      // 	}
      // } else {
      // 	_this.indexNewsList.newsTop = {
      // 		id: newsTopList[ind+1].id,
      // 		title: newsTopList[ind+1].title,
      // 		ind: newsTopList[ind+1].ind
      // 	}
      // }
      // _this.indexNewsList.timeout = setTimeout(_this.updateNews(), 10000);
    },

    entry(url, type) {
      this.$router.push({ name: url, params: { type: type } });
    },

    videoAudioDetail(url, id) {
      this.$router.push({ name: url, params: { id: id } });
    },

    resetView() {
      let _this = this;
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset();

        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
        }, 1000);
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

@import "~assets/css/entry";
@import "~assets/css/form";

.card-first {
  border-top: 0 !important;
}

$playImgW: 60px;
$playBtnW: 30px;

.index {
  height: 100%;
  width: 100%;
  padding-top: $indexTopH;
  // padding-bottom: 30px;
}

.banner {
  // padding: 5px $padding;
  // border-radius: 10px;

  .shadow {
    // 底部阴影
    // box-shadow: 0px 2px 15px #888888;
    // border-radius: 10px;
  }
}
.banner-img {
  width: 100%;
  height: 100%;
  background: no-repeat;
  background-size: cover;
  background-position: center;
  // border-radius: 10px;
}

.card-more-content {
  padding-top: 15px;
}

.card-more-content-slot {
  padding: $uiMarginH 0;
}

.card-more-padding {
  border-right: 5px solid transparent;

  &:nth-child(even) {
    border-left: 5px solid transparent;
    border-right: 0;
  }
}

.join-in {
  width: 100%;
  line-height: 34px;
  padding: $uiMarginH $padding;
  display: flex;

  label {
    padding-left: 30px;
    font-size: $fontSizeH5;
    @include ellipsisOne();
    flex: 1;
    display: block;
    background: #fff url(~assets/img/index/broadcast.png) no-repeat;
    background-position: 5px center;
    background-size: auto 55%;
  }

  .join-btn {
    padding: 0 $padding;
    background-color: #b72d20;
    border-radius: 34px;
    font-size: $fontSize;
    color: #fff;
  }
}

.course-preview {
  width: 180%;
  margin-left: -$padding;
  padding: 0;
}

.course-preview-block {
  float: left;
  width: 25%;
  // padding: 0 $padding;
  // line-height: 1.75;
  // border-right: 1px solid $borderColor;
  text-align: center;

  &:last-child {
    border-right-width: 0;
  }

  .course-preview-header {
    position: relative;
    width: $tuijianImgW + 36px;
    margin: 0 auto;
    text-align: center;
    display: flex;

    img {
      width: $tuijianImgW;
      height: $tuijianImgW;
      margin: 0 auto;
      border-radius: $tuijianImgW;
    }

    span {
      width: 20px;
      line-height: 1.35;
      margin: 0 auto;
      margin-left: 1em;
      color: $fontColorGray;
      word-break: break-all;
      white-space: normal;
      display: flex;
      align-items: center;
    }
  }
  .author {
    font-size: $fontSizeH5;
    @include ellipsisOne();
    margin-left: 10px;
    width: 90%;
    margin-top: 6px;
  }

  .name {
    color: $fontColorGray;
    @include ellipsisOne();
    margin-left: 10px;
    width: 90%;
    margin-top: 6px;
    font-size: $fontSizeTips;
  }

  & > span {
    color: $fontColorGray;
    font-size: 10px;
  }
}
.border-top {
  @include uiBorderTop();
}

.sound-preview {
  width: 180%;
  margin-left: -$padding;
  padding: 0;
  padding: $padding 0;
}

.sound-preview-block {
  float: left;
  width: 25%;
  // padding: 0 $padding;
  padding: 0 6px;
  line-height: 1.75;
  // border-right: 1px solid $borderColor;
  text-align: center;

  &:last-child {
    border-right-width: 0;
  }

  .sound-preview-header {
    width: 145px;
    margin: 0 auto;
    text-align: center;
    position: relative;

    .icon {
      position: absolute;
      left: -20px;
      top: 10px;
      width: 66px;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    img {
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
  }

  & > p {
    @include ellipsisOne();
    width: 90%;
    margin-left: 10px;
    color: $fontColorBlack;
    margin-top: 6px;
  }
}
.screen-preview {
  width: 210%;
  margin-left: -$padding + 1px;
  padding: 0;
  padding: $padding 0;
}

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

    .icon {
      position: absolute;
      left: -20px;
      top: 10px;
      width: 66px;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  & > p {
    @include ellipsisOne();
    margin-left: 10px;
    width: 90%;
    color: $fontColorBlack;
    margin-top: 6px;
  }
}

.news {
  padding: 8px 0;
  background-color: #eee;
}
.index-news {
  // @include uiBorderTop();
  background-color: #fff;
  height: 40px;
  // margin: $padding 0;
  padding: 10px $padding;
  line-height: 40px - $uiMarginH * 2;
  display: flex;
  // background-color: #f6f7f6;

  .index-news-title {
    // width: 6em;
    // color: #000;
    margin: 0 $padding/2;
    font-size: 17px;
    color: #323332;
    font-weight: bolder;
    // background: url(~assets/img/index/headlines.png) no-repeat;
    // background-position: 5px 5px;
    // background-size: auto 80%;
  }

  .index-news-msg {
    flex: 1;
    height: 99%;
    margin-right: 1em;
    overflow: hidden;

    p {
      @include ellipsisMore(1);
      font-size: $fontSizeH5;
    }
  }

  .index-news-btn {
    position: relative;
    width: 3.8em;
    color: $fontColorGray;
    // color: $colorYellowEasy;
    text-indent: 0.5em;
    // @include halfpxline(0, $fontColorGray, 0, 0, 0, 2px);

    // &:after {
    //   content: "";
    //   position: absolute;
    //   top: 50%;
    //   left: 0;
    //   height: $fontSizeH5 * 2;
    //   width: 1px;
    //   margin-top: - $fontSizeH5+9px;
    // }
  }
}

@keyframes changeNews {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-32px);
  }
}

.audio-block-item {
  padding: $padding 0;
  @include halfpxline(0, $borderColor, 1px, 0, 1px, 0);
  display: flex;
  flex-direction: row;
  width: 100%;
  .audio-img {
    width: $tuijianImgW;
    height: $tuijianImgW;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .right-audio-info {
    width: 80%;
    // background-color: #999;
    padding-left: $padding;
    p {
      line-height: 25px;
      @include ellipsisMore(1);
    }
    .name {
      margin-top: 5px;
      font-size: $fontSizeH5;
      color: $fontColorBlack;
    }
    .dese {
      font-size: $fontSizeBut;
      color: $fontColor;
    }
  }
}
.video-block {
  display: flex;
  flex-wrap: wrap;
  .video-block-item {
    position: relative;
    padding: 6px;
    width: 50%;
    // background-color: #999;
    .video-img {
      width: 100%;
    }
    p {
      @include ellipsisMore(1);
    }
    .icon{
      // background-color: #999;
      position: absolute;
      top: 20%;
      left: 15%;
      img{
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>