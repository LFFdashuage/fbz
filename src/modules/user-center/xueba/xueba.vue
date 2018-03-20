<!-- 
	学霸卡页面
 -->

<template>
	<div class="xueba scroll-fix">
		<div class="xueba-header">
      <img class="img-filter" :src="user.img">
			<img class="header-img" :src="user.img">
			<div class="header-info">
        <div class="header-info-identity">
          <label>{{ user.level == 'common' ? '普通用户' : user.levelName || "会员" }}</label>
        </div>
				<p>{{ user.name }}</p>
        <!-- <span>{{user.expiryTime}}</span> -->
			</div>
		</div>
		
		<div class="xueba-content">
			<div class="xueba-content-title">
				<span>学霸卡</span>
			</div>
			<div class="xueba-card">
				<div :class="['xueba-block', {'active': index == cardSelected }]" v-for="(item, index) in cardData" :key="index" @click="setActive(index, item)">
					<div class="xueba-block-content">
						<p>{{ item.name }}</p>
						<div class="remark">{{ item.remark }}</div>
					</div>
					<div class="xueba-block-price">
						<template v-if="item.cardType==4">
              <div @click="chooseTeacher(index, item)">
                <p v-if="teacherType==0">{{ prompt }}</p>
                <img v-else class="teacher-Img"  :src="teacherImg" alt="">
                <img class="arrowIcon" src="~assets/img/icon/rightArrow.png" alt="">	  
              </div>			
						</template>
						<template v-else >
              <span>￥</span>{{ item.price }}
						</template>
					</div>
				</div>
			</div>
		</div>

		<div v-transfer-dom>
			<popup class="commet-bg-white" v-model="comment.listShow" position="bottom" height="80%">
        
        <!-- 搜索框 -->
        <search
        v-model="value"
        :autoFixed="false"
        @on-submit="search"
        @on-cancel="onCancel"
        placeholder="请输入要搜索教师名称！"
        ref="search">
        </search>

        <!-- 结果列 -->
        <div class="choose-teacher">
        <scroller lock-x :height="-teacherList.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom">
          <div class="choose-teacher-content">
            <el-teacher-info :teacher-info-data="item" v-for="(item, index) in  teacherList.list" :class="{ 'teacher-info-selected':selected == index}" :key="index" :index="index" @teacherinfo="teacherInfoData"></el-teacher-info>
            <el-load-more :load-all="teacherList.loadAll"></el-load-more>
          </div>
        </scroller> 
        </div>

			</popup>
		</div>
		
		<div v-transfer-dom>
			<div class="pay">
				<p>总金额 <span><i>￥</i>{{ payData.money }}</span></p>
				<div @click="payOrder" :class="['pay-order', { 'disabled': !payData.status }]">立即支付</div>
			</div>
		</div>

	</div>
</template>

<script type="text/babel">
import { mapState } from "vuex";
import { XInput, XButton, Scroller, Search, TransferDom, Popup } from "vux";
import elCart from "components/cart/cart";
import elTeacherInfo from "components/xueba/teacherInfo";
import elLoadMore from "components/load-more/load-more";

export default {
  name: "xueba",
  directives: {
    TransferDom
  },
  components: {
    Popup, Scroller, Search, XInput, XButton,
    elCart, elTeacherInfo, elLoadMore
  },
  data() {
    return {
      selected: 0,
      xuebaCardId: "",
      teacherType: 0,
      teacherid: "",
      teacherImg: "",
      cardSelected: 0,
      prompt: "选择老师",
      cardData: [
        {
          value: "",
          name: "",
          remark: "",
          price: 0
        }
      ],
      payData: {
        money: Number,
        status: false
      },
      comment: {
        listShow: false
      },
      value: "",
      teacherList: {
        offsetBottom: 180,
        onFetching: false,
        loadAll: false,
        pageSize: 10,
        pageNum: 1,
        list: []
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  mounted() {
    this.payData.money = this.cardData[this.cardSelected].price;
    this.fetchData();
  },
  methods: {
    teacherInfoData( index, teacherid, teacherimages, teacherprice, teachertype) {
      // console.log(index, teacherid, teacherimages, teacherprice, teachertype);
      this.selected = index;
      this.teacherid = teacherid;
      this.payData.money = teacherprice;
      this.teacherType = teachertype;
      this.teacherImg = teacherimages;
      this.comment.listShow = !this.comment.listShow;
    },
    fetchData() {
      this.getTeacherList();
      this.getXuebaCard();
    },
    setActive(ind, data) {
      if (data.cardType == 4) {
        if (this.teacherType == 1) {
          this.cardSelected = 3;
          this.xuebaCardId = data.id;
          this.payData.status = true;
        }
      } else {
        (this.teacherid = 0), (this.teacherType = 0);
        this.teacherImg = "";
        this.cardSelected = ind;
        this.payData.money = this.cardData[ind].price;
        this.xuebaCardId = data.id;
        this.payData.status = true;
      }
    },
    // 购买
    payOrder() {
      let _this = this;
      if (this.payData.status == true) {
        this.teacherid == 0 ? null : this.xuebaCardId = 4;
        // 已购买的专攻学霸卡老师存在返回true 
        // if ( this.arrContain(this.$store.state.user.authorIds, this.teacherid.toString()) == true ) {
        //   _this.$vux.alert.show({
        //     content: "你已购买过"
        //   });
        // } else {
          if(this.teacherid == 0 && this.xuebaCardId == ''){
             this.$vux.toast.text('请选择老师', 'middle')
          }else{
              _this.$store.commit("updateLoadingStatus", { isLoading: true });
          _this.$http
            .post(
              "/api/product/memberCard/order/confirm",
              _this.qs.stringify({
                cardId: this.xuebaCardId,
                customerId: _this.$store.state.user.userId,
                authorId: _this.teacherid,
                walletStatus:0
              })
            )
            .then(function(e) {
              _this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (e.data.code == 200) {
                // console.log(e.data.data);
                _this.$router.push({
                  name: "confirmOrder",
                  query: {
                    orderId: e.data.data.orderId,
                    orderType: e.data.data.orderType,
                    type: e.data.data.type
                  }
                });
              } else {
                _this.$vux.alert.show({
                  content: e.data.msg
                });
              }
            });
          }
      // }
      }
    },

    // 学霸卡
    getXuebaCard() {
      let _this = this;
      _this.$http.post("/api/product/memberCard").then(function(e) {
        // console.log(e);
        if (e.data.code == 200) {
          let list = [];
          if (e.data.data && e.data.data.length > 0) {
            list = e.data.data.map(function(item, ind) {
              return {
                id: item.id,
                name: item.name,
                price: item.price || 0,
                remark: item.remark,
                status: item.status,
                cardType: item.cardType,
                sort: item.sort
              };
            });
          }
          // console.log(list);
          _this.cardData = list;
        } else {
          _this.$vux.alert.show({
            content: e.data.msg
          });
        }
      });
    },

    // 老师列表
    getTeacherList(data) {
      let _this = this;
      if (this.teacherList.onFetching || this.teacherList.loadAll) return;
      this.teacherList.onFetching = true;

      _this.$http
        .post(
          "/api/index/teacher",
          _this.qs.stringify({
            searchKeyword: data,
            pageSize: _this.teacherList.pageSize,
            pageNum: _this.teacherList.pageNum
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data,
              list = [];

            if (e.data.data.result && e.data.data.result.length > 0) {
              list = res.result.map(function(item, index) {
                return {
                  authorId: item.authorId,
                  images: item.images,
                  name: item.name,
                  price: item.price,
                  remark: item.remark
                };
              });
            }

            if (_this.teacherList.pageNum == 1) {
              _this.teacherList.list = list;
            } else {
              _this.teacherList.list = _this.teacherList.list.concat(list);
            }

            if (_this.teacherList.pageNum >= res.pages) {
              _this.teacherList.loadAll = true;
            }

            _this.teacherList.pageNum++;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
          _this.resetView();
        });
    },
    resetView() {
      this.$nextTick(() => {
        this.teacherList.onFetching = false;
        this.$refs.scrollerBottom.reset();
      });
    },
    loadMore() {
      if (this.teacherList.onFetching || this.teacherList.loadAll) {
        // this.resetView();
        this.$refs.scrollerBottom.reset();
      } else {
        this.getTeacherList(this.pageNum);
      }
    },

    // 选择老师
    chooseTeacher() {
      this.comment.listShow = !this.comment.listShow;
      this.payData.money = 0;
      this.cardSelected = 3;
      this.xuebaCardId = "";
      this.payData.status = true;
    },

    // 搜索
    search(data) {
      this.teacherList.loadAll = false;
      this.teacherList.onFetching = false;
      this.teacherList.pageNum = 1;
      // console.log(data)
      this.getTeacherList(data);
    },

    // 取消
    onCancel() {
      // this.$vux.alert.show({
      //   content: "已取消"
      // });
      console.log('已取消')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$xuebaBlockCilcle: 20px;
$xuebaBlockCilcleActiveColor: #eed8a7;
$xuebaBlockCilcleBorder: 2px;

.xueba {
  .xueba-header {
    position: relative;
    padding: 40px 0 $padding;
    text-align: center;
    overflow: hidden;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      bottom: 0;
      background: url(~assets/img/user-center/xueba.png) no-repeat;
      background-size: 100% auto;
      z-index: -1;
    }

    .img-filter {
      position: absolute;
      top: -50%;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      z-index: -2;
      filter: blur(8px);
      // display: none;
    }

    .header-info {
      width: 100%;
      padding-top: 10px;

      .header-info-identity {
        label {
          position: relative;
          line-height: 20px;
          padding: 0 10px 0 0;
          margin-bottom: 10px;
          margin-left: 26px;
          text-indent: 6px;
          text-align: center;
          color: #fff;
          font-size: $fontSize;
          background-color: $colorRedDeep;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          display: inline-block;

          &:before {
            content: "";
            position: absolute;
            left: -26px;
            width: 37px;
            height: 100%;
            background: url(~assets/img/user-center/member-red.png) no-repeat;
            background-size: auto 100%;
          }
        }
      }

      p {
        font-size: $fontSizeH4;
      }
    }

    .header-img {
      width: $headerH;
      height: $headerH;
      margin: 0 auto;
      border-radius: $headerH;
    }
  }
}

.xueba-content{
  .xueba-content-title {
    padding: $padding;
    line-height: 1;
    font-size: 1.2rem;

    span {
      @include halfpxline(0, $colorRedDeep, 0, 0, 0, 6px);
      text-indent: 0.5em;
      display: block;
    }
  }
  .xueba-card {
    padding: $padding;

    .xueba-block {
      position: relative;
      width: 100%;
      padding: 10px ($padding*2 + $xuebaBlockCilcle/2);
      margin-bottom: $padding*2;
      background-color: #f9efd6;
      border-radius: $borderRadius;
      border: $xuebaBlockCilcleBorder solid transparent;
      display: flex;
      justify-content: center;
      align-items: center;

      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: -$xuebaBlockCilcle/2 - $xuebaBlockCilcleBorder;
        width: $xuebaBlockCilcle;
        height: $xuebaBlockCilcle;
        margin-top: -$xuebaBlockCilcle/2;
        border-radius: $xuebaBlockCilcle;
        border: $xuebaBlockCilcleBorder solid transparent;
        background: #fff;
        transform: rotate(45deg);
        z-index: 2;
      }

      &:after {
        left: auto;
        right: -$xuebaBlockCilcle/2 - $xuebaBlockCilcleBorder;
      }

      &.active {
        border-color: $xuebaBlockCilcleActiveColor;

        &:before {
          border-right-color: $xuebaBlockCilcleActiveColor;
          border-top-color: $xuebaBlockCilcleActiveColor;
        }

        &:after {
          border-left-color: $xuebaBlockCilcleActiveColor;
          border-bottom-color: $xuebaBlockCilcleActiveColor;
        }

        .xueba-block-content {
          &:before {
            content: "";
            position: absolute;
            top: -15px;
            left: -($padding*2 + $xuebaBlockCilcle/2);
            width: 36px;
            height: 22px;
            background: url(~assets/img/user-center/hat.png) no-repeat;
            background-size: 100%;
            background-position: 0 0;
            transform: scaleX(-1);
            // transform-origin: 50% 0;
            // perspective: 500;
            // transform-style: preserve-3d;
          }
        }
      }

      .xueba-block-content {
        @include halfpxline(0, $fontColorGray, 0, 3px, 0, 0);
        flex: 1;
        padding-right: 1em;

        &:after {
          border-style: dotted;
        }

        .remark {
          color: $fontColorGray;
        }
      }

      .xueba-block-price {
        width: 5em;
        height: 100%;
        padding-left: 1em;
        position: relative;

        .arrowIcon {
          position: absolute;
          right: -15px;
          top: 0;
          height: 20px;
          width: 20px;
        }
        .teacher-Img {
          height: 25px;
          width: 25px;
          border-radius: 50%;
          margin-left: 10px;
        }
      }
    }
  }
}

.choose-teacher {
  height: 100%;
  width: 100%;

  .choose-teacher-content {
    width: 100%;
    height: 100%;    
    @extend %clearfix;
  }
}

.pay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  width: 100%;
  height: $inputH;
  line-height: $inputH;
  background-color: #fff;
  border-top: 1px solid $borderColor;

  p {
    float: left;
    padding-left: $padding;

    i {
      font-style: normal;
    }
  }

  .pay-order {
    float: right;
    width: 140px;
    text-align: center;
    background: $colorRedDeep;
    color: #fff;
    &.disabled {
      background: $disabledPay;
      color: #fff;
    }
  }
}


</style>