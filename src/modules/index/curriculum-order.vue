<!-- 
	课程支付页面，报名参加课程，包含复训和升级
 -->

<template v-cloak> 
<div class="enlist">
	<div class="curriculum-order" v-cloak>
		
		<template v-if="courseInfo.type != 'package'">
			<el-img-text :img-text-data="courseInfo"></el-img-text>    
		</template>

		<template v-else>
			<el-img-text v-for="(item, index) in courseInfo.list" :img-text-data="item" :key="index"></el-img-text>
			<div class="img-text-info" v-if="courseInfo.originalPrice">
				<span>原价：{{ courseInfo.originalPrice | numToCash}}元</span>
				<p>活动价：{{ courseInfo.price | numToCash}}元</p>
			</div>
		</template>
 
		<el-new-friend v-if="courseInfo.type != 'video'&&courseInfo.type != 'specialColumn'" @on-hide-popup="onChangeFriend" @on-people-num="onChangePeople"></el-new-friend>

    <div class="total-money">
      合计：
      <span>¥{{cartCourseData.total | numToCash}}</span>
    </div>
		
    <div v-if="courseInfo.type != 'package'&&courseInfo.type != 'video'&&courseInfo.type != 'specialColumn'" class="footer-box">
      <div :class="{ 'footer-icon' : isIcon, 'footer-icon-tow': !isIcon}" @click="ticket" class="footer-name">门票券</div>
	    <x-number :max="ticketDatas.maxNum" :min="ticketDatas.minNum" v-model="ticketDatas.useNum"></x-number>
    </div>

    <div class="footer-box" v-if="courseInfo.type != 'video'&&courseInfo.type != 'specialColumn'">
      <div :class="{ 'footer-icon' : discountIcon, 'footer-icon-tow': !discountIcon}" @click="discount" class="footer-name">抵用券</div>
	     <div class="discount-number">¥{{ voucher.num | numToCash}}</div>
    </div>

    <div class="footer-box">
      <div :class="{ 'footer-icon' : walletIcon, 'footer-icon-tow': !walletIcon}" @click="walletAmount" class="footer-name">奖学金</div>
	     <div class="discount-number">¥{{ moneyDatas.wallet | numToCash}}</div>
    </div>
 
    <div v-transfer-dom>
		  <el-cart-curriculum :cart-course-data="cartCourseData" :cart-course-data-status="cartCourseDataStatus" :cart-data="cartData"></el-cart-curriculum>
    </div>
  </div>
</div>
</template>

<script type="text/babel">
import { Group, Cell, CheckIcon, XSwitch, Selector, XNumber, XInput, XButton, FormPreview, Popup, TransferDomDirective as TransferDom } from "vux";
import { mapState } from "vuex";
import elVerificationCode from "components/verification-code/verification-code";
import elNewFriend from "components/friend/new-friend";
import elTicket from "components/ticket/ticket";
import elImgText from "components/img-text/img-text-curriculum";
import elCartCurriculum from "components/cart/cart-curriculum";

export default {
  name: "pay",
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, CheckIcon, XSwitch,  Selector,  XNumber, XInput,  XButton,  FormPreview, Popup, 
    elNewFriend, elTicket, elImgText, elCartCurriculum
  },
  data() {
    return {
      isIcon: false,
      discountIcon: false,
      walletIcon: false,
      title: "报名参加课程",
      courseInfo: {
        course: "",
        id: this.$route.query.id,
        type: this.$route.query.type,
        startDate: "",
        address: "",
        name: "",
        originalPrice: "",
        price: "",
        list: []
      },
      courseId: "",
      tel: "",
      ticketDatas: {
        minNum: 0,
        maxNum: 0,
        useNum: 0,
        ticket: 0
      },
      ticketData: 0,
      voucher: {
        status: false,
        num: "0"
      },
      moneyDatas: {
        status: false,
        wallet: "0"
      },
      cartData: {
        voucherAmount: 0,
        walletAmount: 0,
        admissionTicket: 0
      },
      addManInfo: [],
      friendValue: [],
      orderInfo: {}
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      isLoading: state => state.isLoading
    }),
    cartCourseDataStatus() {
      let status = false;
      if (this.courseInfo.type == "video"|| this.courseInfo.type == "specialColumn") {
        status = true;
      } else {
        if (this.friendValue.length > 0) {
          status = true;
        }
      }

      return status;
    },
    cartCourseData() {
      let voucherAmount = 0,
        walletAmount = 0,
        amount = this.friendValue.length || 1,
        adTicketCount = this.ticketDatas.ticket,
        enrollInfo = "",
        total = amount * this.courseInfo.price,
        money = (amount - adTicketCount) * this.courseInfo.price;

      if (this.voucher.status) {
        voucherAmount = parseFloat(this.voucher.num);

        if (money < voucherAmount) {
          voucherAmount = money;
          money = 0;
        } else {
          money = parseFloat(money - voucherAmount);
        }
      }

      if (this.moneyDatas.status) {
        walletAmount = parseFloat(this.moneyDatas.wallet);

        if (money < walletAmount) {
          walletAmount = money;
          money = 0;
        } else {
          money = parseFloat(money - walletAmount);
        }
      }

      if (amount > 0) {
        this.friendValue.map(function(item, index) {
          if (index == 0) {
            enrollInfo += item.friendId;
          } else {
            enrollInfo += "," + item.friendId;
          }
        });
      }

      return {
        type: this.$route.query.type,
        id: this.$route.query.id,
        price: this.courseInfo.price,
        amount: amount + "", // 数量
        total: total + "", // 合计
        money: money + "", // 金额
        orderType: "1", // orderType:1课程2音视频3奖赏4商城
        voucherAmount: this.voucher.status ? 1 : 0, // 使用课程券的金额
        walletAmount: this.moneyDatas.status ? 1 : 0, // 使用课程券的金额
        adTicketCount: adTicketCount + "", // 使用门票的数量，默认为0
        enrollInfo: enrollInfo // 报名人信息
      };
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ticket() {
      if (this.isIcon == true) {
        this.ticketDatas.ticket = 0;
        this.isIcon = !this.isIcon;
      } else if (this.isIcon == false) {
        this.ticketDatas.ticket = this.ticketDatas.useNum;
        this.isIcon = !this.isIcon;
      }
    },
    discount() {
      if (this.discountIcon == true) {
        this.voucher.status = false;
        this.discountIcon = !this.discountIcon;
      } else if (this.discountIcon == false) {
        this.voucher.status = true;
        this.discountIcon = !this.discountIcon;
      }
    },
    walletAmount() {
      if (this.walletIcon == true) {
        this.moneyDatas.status = false;
        this.walletIcon = !this.walletIcon;
      } else if (this.walletIcon == false) {
        this.moneyDatas.status = true;
        this.walletIcon = !this.walletIcon;
      }
    },
    fetchData() {
      let _this = this,
        url = "/api/curriculum/addCurriculum",
        query = {
          customerId: _this.user.userId,
          periodsId: _this.courseInfo.id
        };
      if (_this.courseInfo.type == "activity") {
        url = "/api/curriculum/addOffineActivity";
        query = {
          customerId: _this.user.userId,
          activityId: _this.courseInfo.id
        };
      } else if (_this.courseInfo.type == "package") {
        url = "/api/curriculum/addLessonsPackage";
        query = {
          customerId: _this.user.userId,
          lessonPackageId: _this.courseInfo.id
        };
      } else if (_this.courseInfo.type == "video") {
        url = "/api/product/online";
        query = {
          customerId: _this.user.userId,
          productId: _this.courseInfo.id
        };
      } else if (_this.courseInfo.type == "specialColumn") {
        url = "/api/product/term";
        query = {
          termId: _this.$route.query.id,
          customerId: _this.user.userId
        };
      }

      _this.$http.post(url, _this.qs.stringify(query)).then(function(e) {
        if (e.data.code == 200) {
          let resInfo = e.data.data;
          let date = resInfo.startTime + " - " + resInfo.endTime;
          let list = [];
          _this.courseId = resInfo.courseId;
          if (_this.courseInfo.type == "package") {
            // _this.voucher.num = resInfo.voucherPrice || 0;

            if (resInfo.lessons.length > 0) {
              list = resInfo.lessons.map(function(it, index) {
                let datePeriods = it.startDate + " - " + it.endDate;
                return {
                  id: it.lessonId,
                  name: it.lessonName,
                  // img: it.images,
                  // address: it.address,
                  // date: datePeriods,
                  // priceCurrency: "￥",
                  isClick: false
                };
              });

              _this.courseInfo = {
                course: "",
                id: _this.$route.query.id,
                type: _this.$route.query.type,
                startDate: resInfo.startTime,
                address: resInfo.address, // 1
                name: resInfo.discountName,
                price: resInfo.discountprice,
                originalPrice: resInfo.packagePrice || resInfo.discountprice, // 1
                remark: resInfo.remark, // 1
                img: resInfo.images, // 1
                count: resInfo.remainingNumber,
                date: "",
                list: list,
                isClick: false
              };
            }
          } else if (_this.courseInfo.type == "activity") {
            _this.courseInfo = {
              course: "",
              id: _this.$route.query.id,
              type: _this.$route.query.type,
              startDate: resInfo.startTime,
              address: resInfo.address, // 1
              name: resInfo.activityName,
              price: resInfo.price,
              originalPrice: resInfo.originalPrice || resInfo.price, // 1admissionTicket
              remark: resInfo.remark, // 1
              img: resInfo.images, // 1
              count: resInfo.remainingNumber,
              date: date,
              isClick: false
            };
          } else if (_this.courseInfo.type == "video") {
            // console.log(resInfo);
            _this.courseInfo = {
              course: "",
              id: _this.$route.query.id,
              type: _this.$route.query.type,
              name: resInfo.name,
              price: resInfo.price,
              originalPrice: resInfo.originalPrice || resInfo.price, // 1
              img: resInfo.images, // 1
              isClick: false
            };
          } else if (_this.courseInfo.type == "specialColumn") {
            // console.log(resInfo);
             _this.courseInfo = {
              id: _this.$route.query.id,
              type: _this.$route.query.type,
              name: resInfo.termName,
              price: resInfo.price,
              originalPrice: resInfo.originalPrice || resInfo.price, 
              img: resInfo.images, 
              isClick: false
            };
          }else {
            _this.courseInfo = {
              course: "",
              id: _this.$route.query.id,
              type: _this.$route.query.type,
              startDate: resInfo.startTime,
              address: resInfo.address, // 1
              name: resInfo.periodsName,
              price: resInfo.price,
              originalPrice: resInfo.originalPrice || resInfo.price, // 1
              remark: resInfo.remark, // 1
              img: resInfo.images, // 1
              count: resInfo.remainingNumber,
              date: date,
              isClick: false
            };
          }
          // 拉取奖学金，抵用券
          _this.getScholarship();
        } else {
          _this.$vux.alert.show({
            content: e.data.msg
          });
        }
      });
    },
    onChangeFriend(val) {
      this.friendValue = val;
      // console.log(val);
    },
    onChangePeople(ind,val) {
     this.friendValue.splice(ind, 1);
    },
    // 拉取奖学金，抵用券
    getScholarship() {
      let _this = this;
      let query = {
        customerId: _this.user.userId,
        lessonId: _this.courseId
      };
      if (_this.courseInfo.type == "video"|| this.courseInfo.type == "specialColumn") {
        let query = {
          customerId: _this.user.userId
        };
      }
      _this.$http
        .post("/api/userInfo/userAttribute", _this.qs.stringify(query))
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;
            _this.voucher.num = res.voucherAmount || 0;
            _this.moneyDatas.wallet = res.walletAmount || 0;
            _this.ticketDatas.maxNum = res.admissionTicket || 0;
            // console.log(res);
            _this.cartData = {
              voucherAmount: res.voucherAmount || 0,
              walletAmount: res.walletAmount || 0,
              admissionTicket: res.admissionTicket || 0
            };
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

// @import '~assets/css/icon';
.enlist {
  width: 100%;
  height: 100%;
  background: $bgGray;
  margin-bottom: 50px;
  overflow: auto;
  overflow-x: hidden;

  .curriculum-order {
    height: 100%;
    width: 100%;

    .img-text-info {
      @include imgTextPriceInfo();
      padding: 0 $padding;
    }

    .total-money {
      background-color: #fff;
      margin: $padding 0;
      padding: 5px $padding;
      text-align: right;
      color: $fontColorBlack;
      font-size: $fontSizeH5;
      span {
        color: $colorRedDeep;
        font-size: $fontSizeH4;
      }
    }

    .footer-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      @include halfpxline(0, $bgGray, 0 , 0, 1px, 0);

      .footer-name {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 48px;
        width: 93px;
        font-size: 12px;
      }
      .footer-icon {
        background: #fff url(~assets/img/icon/Selected01.png) no-repeat;
        background-position: 13px center;
        background-size: auto 60%;
      }

      .footer-icon-tow {
        background: #fff url(~assets/img/icon/Selected02.png) no-repeat;
        background-position: 13px center;
        background-size: auto 60%;
      }
      .discount-number {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 30px;
        color: $colorRedDeep;
        font-size: $fontSizeH4;
      }
    }
  }
}
</style>