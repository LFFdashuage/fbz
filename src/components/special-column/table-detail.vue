<!-- 
     table专栏详情
-->
<template>
	<div v-cloak>
    <div class="content-detail">
       <!--课程简介-->
      <div class="detail-introduce" >
        <div class="table-content-title">
	        <span>专栏简介</span>
	      </div>
        <div class="detail-introduce-box" :class="{introduceShowall:true,active:introduceShowall}">
          <div ref="introduce" class="rich-html"   v-html="tableDetailData.content" ></div>
        </div>
        <div v-show="introduceShow">
          <div  v-show="!introduceShowall" class="mui-text-center imgbtn" :class="{active:introduceShowall}" @click="introduceShowall=!introduceShowall"><div><divider class="open-color">展开更多</divider></div></div>
        </div>
      </div>

      <!--讲师介绍-->
      <div>
        <el-teacher :author-data="authorListData"></el-teacher>
      </div>

      <!--购买须知-->
      <div class="detail-notice">
        <div class="table-content-title">
	        <span>购买须知</span>
	      </div>
        <div class="detail-notice-box">
          <p class="icon">本课程为￥{{tableDetailData.price}}终身订阅，订阅成功后，即可永久收听。</p>
          <p class="icon">版权归原作者所有，严禁录成任何形式，严禁在任何第三方平台传播，违者将追究其法律责任。</p>
          <p class="icon">在购买过程中，如果有任何问题，您可以拨打客服电话021-XXXXXXXX。</p>
        </div>
      </div>

      <!--课程评价-->
      <div class="detail-comment">
        <div class="table-content-title-evaluate">
            <span class="title-name">课程评价</span><span class="title-when-long">{{tableDetailData.termRank.toFixed(1)}}分</span>
	      </div>

        <div class="comment" >
          <div class="comment-list-block" v-for="(item, index) in commentInfo.list" :key="index">
					  <div class="comment-list-block-info">
              <div class="comment-img">
							    <img :src="item.headUrl" alt="">
						    </div>
                <div class="name">
                  {{ item.customerName }}
                  <div class="rater">
                    <rater :active-color="wordBook.raterConfig.activeColor" :font-size="wordBook.raterConfig.fontSize" v-model="item.rank" disabled></rater>{{item.toFixed(1)}}
                  </div>
                </div>
					  </div>
            <p class="comment-content">{{ item.content }}</p>
				  </div>

          <div v-if="commentInfo.int<3" class="hide-more">
            <div class="show-more">
              <div @click="showMore">填写评价</div>
            </div>
          </div>
          <div v-if="commentInfo.int==3" class="show-more">
            <div @click="showMore"> 填写并查看更多评价 </div>
          </div>

        </div>
      </div>

    </div>
	</div>
</template>

<script type="text/babel">
import { TransferDom, Rater, Divider } from "vux";
import elTeacher from "components/teacher/teacher";

export default {
  name: "elTableDetail",
  props: ["tableDetailData", "authorListData"],
  directives: {
    TransferDom
  },
  components: { 
    Rater, Divider,
    elTeacher
  },
  data() {
    return {
      introduceShow: false,
      introduceShowall: false,
      commentInfo: {
        int: 0,
        commentType: 2,
        pageNum: 1,
        pageSize: 3,
        productId: this.$route.query.id,
        list: []
      }
    };
  },
  watch: {
    authorListData() {
      this.show();
    }
  },
  mounted() {
    this.fetchData();
    let heightIntroduce = this.$refs.introduce.offsetHeight;
    if (heightIntroduce < 100) {
      this.introduceShow = this.introduceShow;
    } else {
      this.introduceShow = !this.introduceShow;
    }
    // console.log(heightIntroduce, this.$refs.introduce);
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.$http.post("/api/product/comment/list",
          _this.qs.stringify({
            productId: this.commentInfo.productId,
            commentType: this.commentInfo.commentType,
            pageNum: this.commentInfo.pageNum,
            pageSize: this.commentInfo.pageSize
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
            _this.commentInfo.list = list;
            _this.commentInfo.int = e.data.data.result.length;
            // console.log(_this.commentInfo.int);
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    // 点击显示更多
    show() {
      let _this = this;
      this.$nextTick(function() {
        let heightIntroduce = this.$refs.introduce.offsetHeight;
        if (heightIntroduce < 100) {
          _this.introduceShow = _this.introduceShow;
        } else {
          _this.introduceShow = !_this.introduceShow;
        }
        // console.log(heightIntroduce, this.$refs.introduce);
      });
    },

    // 跳转评论页面
    showMore() {
      this.$router.push({
        name: "commentType",
        query: { id: this.$route.query.id, type: 2 }
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

$commentBlockBtnsW: 40px;

.content-detail {
  height: 100%;
  background-color: $borderColor;
  margin-bottom: 70px;

  .detail-introduce {
    margin-top: 5px;
    background-color: #fff;
    padding: $padding $padding 0;

    .detail-introduce-box {
      padding: 0 3px;
    }
  }

  .detail-teacher {
    background-color: #fff;
    padding: $padding $padding 0;
    margin-top: 5px;

    .detail-teacher-box {

      .detail-teacher-introduce {
        color: $fontColorGray;
        display: flex;
        .detail-teacher-photo {
          img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
          }
        }
        .detail-teacher-info {
          padding: 0 $padding;

          .detail-teacher-name {
            display: inline-block;
            padding: $padding 0;
            font-size: $fontSize;
            color: $fontColorBlack;
          }
          .detail-teacher-remark{
            
          }
        }
      }  
    }
  }

  .detail-notice {
    @include uiBorderTop();
    background-color: #fff;
    padding: $padding $padding 0;

    .detail-notice-box {
      padding: 0 3px;

      .icon {
        margin-bottom: 5px;
        display: inline-block;
        padding-left: 20px;
        line-height: 1.7;
        background: #fff url(~assets/img/icon/round.png)no-repeat;
        background-size: 10px;
        background-position: 0 5px;
      }
    }
  }

  .detail-comment {
    @include uiBorderTop();
    background-color: #fff;
    padding: $padding $padding 0;

    .comment {
      height: 100%;

      .comment-list-block {
        padding: $padding 0;
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
      }

      .comment-list-block-info {
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
      
      .comment-content {
        line-height: 1.75;
        color: $fontColorBlack;
        // @include ellipsisOne();
        padding: 5px;
      }

      .show-more {
        margin: $padding 0;
        text-align: center;

        div {
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
  }

  .introduceShowall {
    overflow: hidden;
    clear: both;
    background: #fff;
    margin-top: 5px;
    height: 100px;
  }

  .introduceShowall.active {
    height: auto;
    background: #fff;
  }

  .table-content-title-tacher,
  .table-content-title-evaluate {
    display: flex;
    padding: $padding 0;
    line-height: 1;
    font-size: $fontSizeH4;

    .title-name {
      flex: 1;
      display: block;
      @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
      text-indent: 0.5em;
    }

    .title-when-long {
      color: $fontColorGray;
    }
  }

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

  .imgbtn {
    text-align: center;

    div {
      width: 150px;
      margin: 0 auto;
      display: inline-block;
    }
  }

  .open-color {
    color: $colorYellowEasy;
  }
}
</style>