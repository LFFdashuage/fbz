<!-- 
	头条详情
 -->

<template>
	<div class="news-detail scroll-fix">
		<div class="news-detail-header">
			<h5>{{ news.title }}</h5>
			<div class="info">
				<span>{{ news.time }}</span>
				<span v-if="news.readCount > 0">{{ news.readCount }}人浏览</span>
			</div>
		</div>

		<div class="news-detail-content" v-html="resolveRichTextImg(news.content)"></div>
		
		<el-reward class="news-reward" :reward-data="news" @reward-done="refreshReward" ></el-reward>
		<el-reward-list @reward-done="refreshReward" :reward-info="rewardInfo" :reward-refresh-status="rewardRefreshStatus"></el-reward-list>
  
		<!-- <el-comment-bar :comment-data="news"></el-comment-bar> -->
    <div v-transfer-dom>
			<div class="detail-btn-bottom">
        <div class="footer-collection"  :class="{ 'collection-icon' : isIcon, 'collection-icon-tow': !isIcon}" @click="collection">收藏</div>
				<div class="detail-bottom-btn buy" @click="comment">评论</div>
			</div>
		</div>
    
	</div>
</template>

<script type="text/babel">
  import { TransferDom } from "vux";
  import elCommentBar from "components/comment/comment-bar";
  import elReward from "components/reward/reward";
  import elRewardList from "components/reward/reward-list";

  export default {
    name: "newsDetail",
    components: {
      elCommentBar,
      elReward,
      elRewardList
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        title: "头条详情",
        news: {
          spareType: "1", // spareType打赏类型 0产品 1头条
          id: this.$route.query.id,
          content: "",
          time: "",
          readCount: "",
          img: "",
          commentCount: 0,
          title: "",
          isCollection: ""
        },
        rewardRefreshStatus: false,
        rewardInfo: {
          spareType: 1,
          goodsId: this.$route.query.id
        },
        isIcon: false
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        let _this = this;
        _this.$http
          .post(
            "/api/news/detail",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              id: _this.news.id
            })
          )
          .then(function(e) {
            if (e.data.code == 200) {
              let res = e.data.data;
              _this.news.title = res.title;
              _this.news.content = res.content;
              _this.news.time = res.updateTime || res.createTime;
              _this.news.readCount = res.readCount || 0;
              _this.news.commentCount = res.commentCount || 0;
              _this.news.isCollection = res.isCollection || 0;

              if (_this.news.isCollection == 1) {
                _this.isIcon = true;
              }
            } else {
              _this.$vux.alert.show({
                content: e.data.msg
              });
            }
          });
      },
      refreshReward(val) {
        this.rewardRefreshStatus = val;
      },
      // 收藏
      collection() {
        let _this = this;
        _this.$http
          .post(
            "/api/customer/collection",
            _this.qs.stringify({
              customerId: _this.$store.state.user.userId,
              goodsType: 7,
              goodsId: _this.news.id
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
      comment() {
        this.$router.push({
          name: "comment",
          query: { id: this.news.id }
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

  .news-detail-content {
    img {
      max-width: 100%;
    }

    video {
      min-height: 240px;
      background: #000;
    }
  }
</style>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions",
    "~assets/css/core/mixins",
    "~assets/css/core/vars";

  .news-detail {
    min-height: 101%;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 50px;
    overflow: scroll;
  }

  .news-detail-header {
    padding: $padding;

    h5 {
      line-height: 1.5;
      margin-bottom: $padding/2;
      font-size: $fontSizeH3;
      color: $fontColorBlack;
    }

    .info {
      font-size: $fontSizeTips;
      color: $fontColorGray;

      span {
        &:last-child {
          float: right;
        }
      }
    }
  }

  .news-detail-content {
    // width: 100%;
    // height: 200px;
    padding: 0 $padding*2 $padding;
    text-align: justify;
    // overflow: scroll;
  }

  .news-reward {
    margin-bottom: $padding;
  }
  .detail-btn-bottom {
    @include halfpxline(0, $borderColor, 1px, 0, 0, 0);
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
  }
  .detail-bottom-btn {
    flex: 1;

    &.buy {
      background: $colorRedDeep;
    }
  }
</style>