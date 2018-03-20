<!-- 
	评论页面
 -->
<template>
	<div class="comment-bar">
		<div class="comment-list">

			<scroller lock-x :height="-comment.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
				<div class="comment-list-content">
					<div class="comment-list-block" v-for="(item, index) in comment.list" :key="index">
						<div v-if="item.img" class="img">
							<img :src="item.img" alt="">
						</div>

						<div class="comment-list-block-info">
							<div class="name">{{ item.name }}</div>
							<!-- <span class="time">{{ item.time }}</span> -->
              <p>
                <rater :active-color="wordBook.raterConfig.activeColor" :font-size="wordBook.raterConfig.fontSize" v-model="item.rank" disabled></rater>{{item.rank.toFixed(1)}}
							</p>
              <p class="comment-list-content">{{ item.content }}</p>
						</div>

					</div>
					<el-load-more :load-all="comment.loadAll"></el-load-more>
				</div>
			</scroller>

		</div>
		
		<div v-transfer-dom>
			<popup class="commet-bg-white" v-model="comment.textShow" position="bottom">
				<div class="comment-text">
					<div class="comment-text-header">
						<div class="comment-cancel" @click="hideText">取消</div>
						<div :class="['comment-submit', { 'disable': commentValue.length == 0 }]" @click="submitComment">发表</div>
					</div>
          <div class="rater-box">
            <p>评星：<rater v-model="rater" :active-color="wordBook.raterConfig.activeColor" :font-size=20></rater></p>
          </div>
					<x-textarea ref="textarea" v-model="commentValue" :placeholder="comment.placeholder" :rows="6"></x-textarea>
				</div>
	    </popup>
		</div>

		<div v-transfer-dom>
			<div class="comment-mini">
				<div class="comment-input" @click="showText">{{ comment.placeholder }}</div>
				<div class="comment-btn">
					<i v-if="commentData.commentCount > 0">{{ commentData.commentCount }}</i>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
import { TransferDom ,Scroller ,Popup ,Group ,XTextarea, Rater ,XInput } from "vux";
import elLoadMore from "components/load-more/load-more";

export default {
  name: "commentType",
  directives: {
    TransferDom
  },
  components: {
    Scroller , Popup , Group , XTextarea , XInput , Rater,
    elLoadMore
  },
  data() {
    return {
      title: "底部评论",
      commentType:this.$route.query.type,
      comment: {
        num: 0,
        offsetBottom: 46,
        miniShow: true,
        textShow: false,
        listShow: false,
        placeholder: "我来说两句",
        pageNo: 1,
        pageSize: this.wordBook.pageSize,
        onFetching: false,
        loadAll: false,
        list: []
      },
      commentData: {
        id: this.$route.query.id,
        commentCount: 0
      },
      commentValue: "",
      rater:0
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {

    fetchData() {
      this.fetchComment(false);
    },

    fetchComment(status) {
      let _this = this,
        pageNo;

      if (status) {
        _this.comment.pageNo = 1;
      }
      pageNo = _this.comment.pageNo;

      if (_this.comment.onFetching) return;
      _this.comment.onFetching = true;

      _this.$http
        .post(
          "/api/product/comment/list",
          _this.qs.stringify({
            commentType:_this.commentType,
            productId: _this.$route.query.id,
            pageNo: pageNo,
            pageSize: _this.comment.pageSize
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data,
              list = [];

            if (res.result && res.result.length > 0) {
              list = res.result.map(function(item, index) {
                return {
                  img: item.headUrl,
                  name: item.customerName,
                  time: item.createTime,
                  content: item.content,
                  rank:item.rank
                };
              });
            }

            if (list.length < _this.comment.pageSize) {
              _this.comment.loadAll = true;
            }

            if (_this.comment.pageNo == 1) {
              _this.comment.list = list;
            } else {
              _this.comment.list = _this.comment.list.concat(list);
            }
            _this.comment.pageNo++;
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
      this.$nextTick(() => {
        this.comment.onFetching = false;
        this.$refs.scrollerBottom.reset();
      });
    },

    showText() {
      if (!this.isLogin()) return;
      this.comment.textShow = true;
      document.querySelector(".comment-text textarea").focus();
    },

    hideText() {
      this.comment.textShow = false;
    },

    showList() {
      this.comment.listShow = true;
      this.comment.textShow = false;
    },

    hideList() {
      this.comment.listShow = false;
      this.comment.textShow = false;
    },

    submitComment() {
      let _this = this;

      if (!this.isLogin()) return false;

      if (_this.commentValue == "") return false;

      _this.$store.commit("updateLoadingStatus", { isLoading: true });
      this.$http
        .post(
          "/api/product/comment",
          this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            content: _this.commentValue,
            productId: _this.commentData.id,
            rank:_this.rater,
            commentType:_this.commentType,
          })
        )
        .then(function(e) {
          _this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (e.data.code == 200) {
            _this.comment.textShow = false;
            _this.commentValue = "";
            _this.rater = 0;
            _this.$vux.alert.show({
                content: e.data.msg
              });
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    loadMore() {
      if (this.comment.onFetching || this.comment.loadAll) {
        this.$refs.scrollerBottom.reset();
      } else {
        this.fetchComment();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$commentBlockBtnsW: 40px;

.commet-bg-white {
  background: #fff;
}

.comment-mini {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: $padding/2 $padding;
  border-top: 1px solid $bgGray;
  display: flex;
  background: $bgGray;
  z-index: 550;

  .comment-input {
    flex: 1;
    line-height: 30px;
    text-indent: 1em;
    border: 1px solid $fontColorGray;
    border-radius: $borderRadius;
  }

  .comment-btn {
    position: relative;
    width: 3em;
    height: 30px;
    background: url("~assets/img/icon/comment-bar.png") no-repeat;
    background-size: auto 100%;
    background-position: right;

    i {
      position: absolute;
      top: -6px;
      right: -6px;
      padding: 0 0.3em;
      line-height: 1.35;
      font-size: $fontSizeTips;
      // background: $bgGray;
      background: $colorRedDeep;
      color: #fff;
      font-style: normal;
      border-radius: 10px;
    }
  }
}

.comment-text {
  .comment-text-header {
    @extend %clearfix;
    padding: $padding $padding 0;
    border-top: 1px solid $bgGray;

    .comment-cancel {
      float: left;
    }
    .comment-submit {
      float: right;
    }
  }
}

.comment-list {
  width: 100%;
  height: 100%;

  .comment-list-header {
    position: relative;
    line-height: $inputH;
    // text-align: center;
    border-bottom: 1px solid $bgGray;
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: $inputH;
    line-height: $inputH;
    font-size: $fontSizeH4;
    background: $bgGray;
  }
}

.comment-list-block {
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  position: relative;
  width: 100%;
  padding: $padding;
  display: flex;

  .img {
    width: $quotationUserImgW;
    height: $quotationUserImgW;

    img {
      width: 100%;
      height: 100%;
      border-radius: $quotationUserImgW;
    }
  }
}

.comment-list-block-info {
  padding-left: 10px;
  line-height: 1.5;
  flex: 1;

  .name {
    @include ellipsisOne();
    font-size: $fontSizeH3;
    color: $fontColorBlack;
  }

  .time {
    font-size: $fontSizeTips;
    color: $fontColorGray;
  }

  // p {
  //   line-height: 1.75;
  //   color: $fontColorBlack;
  // }
  .comment-list-content{
    line-height: 1.75;
    color: $fontColorBlack;
    text-align: left;
  }
}

.comment-block-btns {
  position: absolute;
  top: $padding;
  right: $padding;
  width: $commentBlockBtnsW;
  text-align: right;
  display: none;

  .zan {
    &.active {
      &:before {
        color: $colorRed;
      }
    }

    &:before {
      margin-right: 0.3em;
    }
  }
}
.rater-box{
  padding: $padding $padding 0;
  height: 30px;
  width: 100%;
  font-size: $fontSize;
  // background-color: #888;
}
</style>