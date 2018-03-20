<!-- 
	用户中心
 -->

<template>
	<div class="user-center scroll-fix" v-cloak>
		<header>
			<div class="person-info">
        <div class="information"  @click="goPage({'name': 'msg'})">
          <span v-if="msgNum > 0">{{ msgNum | numMaxToChange }}</span>
        </div>
        <div class="img">
				  <img @click="goPage({name:'personal'})" :src="user.img" alt="">
        </div>
				<div class="header-info">
					<!-- <label>{{ user.level == 'common' ? '普通用户' : user.levelName || "会员" }}</label> -->
					<p>{{ user.name }}</p>
          <p class="grade">{{ user.level == 'common' ? '普通用户' : user.levelName || "会员" }}
            <span v-if="user.level == 'common'" @click="goPage('binding')">会员注册</span>
            <span v-if="user.level != 'common' && user.level != 'dreamPartner' " @click="submitUpgrade">升级</span>
          </p>
          <!-- <p v-if="user.isAvailable==1" class="expiry-time">学霸卡到期时间：{{ user.expiryTime }}</p> -->
        </div>	
			</div>
			
			<div class="user-center-money">
				<div class="user-center-money-block" v-for="(item, index) in moneyDatas" :key="index"  @click="checkLogin({name: item.url}, item.click)">
					<span>{{ item.value }}</span>
					{{ item.name }}
				</div>
			</div>

		</header>

		<main>
      <!-- member-list-padding -->
			<div class="member-list ">
				<div class="member-block" v-for="(item, index) in memberDatas.list" :key="index" @click="checkLogin({name: item.url}, item.click)">
					<i :class="['icon', 'icon-user-' + item.icon]"></i>
					{{ item.name }}
				</div>
			</div>

			<div class="member-list">
				<div class="member-block" v-for="(item, index) in operationDatas.list" :key="index" @click="checkLogin({name: item.url}, item.click)">
					<i :class="['icon', 'icon-user-' + item.icon]"></i>
					{{ item.name }}
				</div>
			</div>

			<div class="xueba" @click="goPage({name: 'xueba'})">
				<div class="xueba-header">加入“学霸养成计划”</div>
				<div class="xueba-content">
					<img src="~assets/img/user-center/hat.png" alt="">
					<p>月度，季度，年度，专项学霸卡
						<span>各种课程随心随时随地听</span>
					</p>
				</div>
			</div>

			<div class="user-center-setup">
				<group>
		      <cell :class="{'setup-active': item.new}" v-for="(item, index) in setupDatas" :key="index" :title="item.name" @click.native="checkLogin({name: item.url}, item.click)" is-link>
		      	<div slot="icon" :class="['icon-setup', 'icon', 'icon-user-' + item.icon]"></div>
		      	<div class="member-rights" slot="default">{{ item.desc }}</div>
		      </cell>
		    </group>
			</div>
		</main>

		<div v-transfer-dom>
			<actionsheet v-model="show7" :menus="menu7" theme="android" @on-click-menu="click">
    	</actionsheet>
    </div>
	</div>
</template>

<script type="text/babel">
import { mapState } from "vuex";
import { Group, Cell, Actionsheet, TransferDom } from "vux";

export default {
  name: "userCenter",
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, Actionsheet
  },
  data() {
    return {
      title: "用户中心",
      kefuUrl: "kefu",
      msgNum: 0,
      moneyDatas: [
        {
          value: "",
          name: "门票",
          url: "ticket",
          query: {},
          value: 0,
          icon: "ticket",
          click: false, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        },
        {
          value: "",
          name: "抵用券",
          url: "voucher",
          query: {},
          value: 0,
          icon: "voucher",
          click: false, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        },
        {
          value: "",
          name: "奖学金",
          url: "wallet",
          query: {},
          value: 0,
          icon: "wallet",
          click: false, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        },
        {
          value: "",
          name: "积分",
          url: "integral",
          query: {},
          value: 0,
          icon: "integral",
          click: false, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        }
      ],
      memberDatas: {
        name: "",
        show: true,
        list: [
          // ,{
          // 	value: '',
          // 	name: '我的消息',
          // 	// name: '线上资料',
          // 	url: 'msg',
          // 	query: {},
          // 	icon: 'msg',
          // 	click: false, // 不绑定是否可点击
          // 	new: '', // 推广背景
          // 	show: true
          // },
          // {
          // 	value: '',
          // 	name: '我的奖学金',
          // 	url: 'wallet',
          // 	query: {},
          // 	icon: 'wallet',
          // 	click: false, // 不绑定是否可点击
          // 	new: '', // 推广背景
          // 	show: true
          // },
          // {
          // 	value: '',
          // 	name: '我的订单',
          // 	url: 'order',
          // 	//url: 'orderCourseList',
          // 	// url: 'orderActivityList',
          // 	// url: 'orderSourceList',
          // 	// url: 'orderMallList',
          // 	 query: {},
          // 	icon: 'order',
          // 	click: false, // 不绑定是否可点击
          // 	new: '', // 推广背景
          // 	show: true
          // },
          {
            value: "",
            name: "课程订单",
            url: "orderCourseList",
            icon: "orderCourseList",
            query: {},
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          },
          {
            value: "",
            name: "活动订单",
            url: "orderActivityList",
            icon: "orderActivityList",
            query: {},
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          },
          {
            value: "",
            name: "套餐订单",
            url: "orderPackageList",
            icon: "orderSourceList",
            query: {},
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          },
          {
            value: "",
            name: "商城订单",
            url: "orderMallList",
            icon: "orderMallList",
            query: {},
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          }
        ]
      },
      setupDatas: [
        {
          value: "",
          name: "分享二维码",
          url: "share",
          icon: "qrcode",
          click: true, // 不绑定是否可点击
          desc: "分享给好友",
          new: "share", // 推广背景
          show: true
        },
        {
          value: "",
          name: "会员中心",
          url: "upgradeRights",
          icon: "member",
          desc: "合伙人权益",
          click: true,
          show: true
        },
        {
          value: "",
          name: "常用名单",
          url: "friend",
          query: {},
          icon: "friend",
          click: false, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        },
        {
          value: "",
          name: "地址管理",
          url: "address",
          icon: "address",
          click: false,
          show: true
        },
        {
          value: "",
          name: "意见反馈",
          url: "feedback",
          query: {},
          icon: "feedback",
          click: true, // 不绑定是否可点击
          new: "", // 推广背景
          show: true
        }
      ],
      operationDatas: {
        name: "",
        show: true,
        list: [
          // {
          // 	value: '',
          // 	name: '我的订单',
          // 	// name: '课程订单',
          // 	url: 'order',
          // 	// url: 'orderCourseList',
          // 	// url: 'orderActivityList',
          // 	// url: 'orderSourceList',
          // 	// url: 'orderMallList',
          // 	query: {},
          // 	icon: 'order',
          // 	click: false, // 不绑定是否可点击
          // 	new: '', // 推广背景
          // 	show: true
          // },{
          // 	value: '',
          // 	name: '我的消息',
          // 	// name: '线上资料',
          // 	url: 'msg',
          // 	query: {},
          // 	icon: 'msg',
          // 	click: false, // 不绑定是否可点击
          // 	new: '', // 推广背景
          // 	show: true
          // },

          {
            value: "",
            name: "我的客户",
            url: "customer",
            query: {},
            icon: "customer",
            click: true, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          },
          {
            value: "",
            name: "我的代理",
            url: "agency",
            query: {},
            icon: "agent",
            click: true, // 不绑定是否可点击
            show: true
          },
          {
            value: "",
            name: "我的资料",
            // name: '活动订单',
            url: "orderSourceList",
            query: {},
            icon: "file",
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          },
          {
            value: "",
            name: "我的收藏",
            // name: '商城订单',
            url: "collection",
            query: {},
            icon: "collection",
            click: false, // 不绑定是否可点击
            new: "", // 推广背景
            show: true
          }
        ]
      },
      show7: false,
      menu7: [
        {
          label: "课程订单",
          value: "orderCourseList"
        },
        {
          label: "活动订单",
          value: "orderActivityList"
        },
        {
          label: "套餐订单",
          value: "orderPackageList"
        },
        {
          label: "商城订单",
          value: "orderMallList"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  mounted() {
    this.fetchData();
    this.getMessage();
  },
  methods: {
    click(key) {
      this.checkLogin({ name: key });
    },
    fetchData() {
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/userAttribute",
          this.qs.stringify({
            customerId: this.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;
            _this.$store.commit("updateUserTicketsCount", {
              ticketsCount: res.ticketsCount
            });
            _this.$store.commit("updateUserVoucherAmount", {
              voucherAmount: res.voucherAmount
            });
            _this.$store.commit("updateUserWalletAmount", {
              walletAmount: res.walletAmount
            });
            _this.$store.commit("updateUserIntegralAmount", {
              integralAmount: res.integralAmount
            });
            _this.moneyDatas.map(function(item, index) {
              if (index == 0) {
                item.value = res.ticketsCount;
              } else if (index == 1) {
                item.value = res.voucherAmount;
              } else if (index == 2) {
                item.value = res.walletAmount || 0;
              } else if (index == 3) {
                item.value = res.integralAmount || 0;
              }
            });
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },
    clearStorage() {
      window.localStorage.clear();
      this.$router.push({ name: "index" });
    },
    checkLogin(url, data) {
      if (!data) {
        if (!this.isLogin()) return false;
      }

      if (url.name) {
        // if(url.name == 'collection' || url.name == 'xueba') {
        // 	this.$vux.alert.show({
        // 		content: "功能紧急开发中"
        // 	})
        // } else
        if (url.name == "order") {
          this.show7 = true;
        } else if (/http/.test(url.name)) {
          location.href = url.name;
        } else {
          this.$router.push(url);
        }
      } else {
        this.clearStorage();
      }
    },
    upgrade() {
      let _this = this;

      _this.$store.commit("updateLoadingStatus", { isLoading: true });

      _this.$http
        .post(
          "/api/customer/upgrade",
          _this.qs.stringify({
            customerId: this.$store.state.user.userId,
            type: 0
          })
        )
        .then(function(e) {
          _this.$store.commit("updateLoadingStatus", { isLoading: false });

          _this.$vux.alert.show({
            content: e.data.msg
          });
        });
    },
    submitUpgrade() {
      let _this = this;

      _this.$store.commit("updateLoadingStatus", { isLoading: true });
      _this.$http
        .post(
          "/api/customer/upgrade",
          _this.qs.stringify({
            customerId: this.$store.state.user.userId,
            type: 1
          })
        )
        .then(function(e) {
          _this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (e.data.code == 200) {
            _this.$router.push({ name: "upgrade" });
          } else {
            _this.$vux.confirm.show({
              content: e.data.msg,
              confirmText: "返回",
              cancelText: "查看",
              onCancel() {
                _this.$router.push({ name: "upgrade" });
              },
              onConfirm() {}
            });
          }
        });
    },
    goPage(url) {
      // if(url.name == 'collection' || url.name == 'xueba') {
      // 	this.$vux.alert.show({
      // 		content: "功能紧急开发中"
      // 	})
      // } else {
      this.$router.push(url);
      // }
    },
    // 获取有多少信息提示
    getMessage() {
      let _this = this;
      	this.$http.post('/api/tidings/unreadMessageCount',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						_this.msgNum = e.data.data.allMessage;
				})
    }
  }
};
</script>

<style lang="scss">
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.user-center-setup {
  .weui-cells {
    margin-top: 0;
    font-size: $fontSize !important;
  }

  .vux-label {
    text-indent: 0.5em;
  }
}
</style>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$userCenterheaderImgW: $headerH;
$userCenterIconW: 30px;

.user-center {
  min-height: 100%;
  background-color: $colorBgGray;

  .icon {
    padding-left: $userCenterIconW + 6px;

    &:before {
      width: $userCenterIconW;
      height: $userCenterIconW;
      margin-top: -$userCenterIconW/2;
    }
  }
}

header {
  position: relative;
  padding: $padding 0 0;
  margin: 0 0 $padding;
  // background: url(~assets/img/user-center/bg.png) no-repeat;
  // background-size: 100% 90%;
  // background-position: center;
  // background: $colorOrange;
  color: $fontColorBlack;
  text-align: center;
  background-color: #fff;

  .person-info {
    display: flex;
    justify-content: space-between;
    padding: 0 0 $padding $padding;
    text-align: left;
    @include halfpxline(0, $borderColor, 0, 0, 1px, 0);
    position: relative;
    .img {
      width: 60px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .information {
      position: absolute;
      top: 10px;
      right: 20px;
      height: 20px;
      width: 20px;
      background: url(~assets/img/index/top-msg.png) no-repeat;
      background-size: 80%;
      background-position: bottom;

      & > span {
        position: absolute;
        top: -3px;
        left: 50%;
        padding: 0 0.4em;
        line-height: 1.5em;
        text-align: center;
        font-size: $fontSizeTips;
        background-color: $colorRedDeep;
        color: #fff;
        border-radius: 2em;
      }
    }
  }

  img {
    width: $userCenterheaderImgW;
    height: $userCenterheaderImgW;
    margin: 0 auto;
    border-radius: $userCenterheaderImgW;
  }

  .header-info {
    flex: 1;
    width: 100%;
    padding: 10px 0 0 $padding;
    font-size: $fontSizeH4;

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
    .expiry-time {
      font-size: $fontSize;
    }
    .grade {
      color: $fontColorGray;
      span {
        margin-left: 5px;
        padding: 2px 7px;
        background-color: $colorRedDeep;
        color: #fff;
        border-radius: 7px;
      }
    }
  }
}

.user-center-money {
  @extend %clearfix;
  padding: 6px $padding;
  background-color: #fff;
  color: $fontColorGray;
}

.user-center-money-block {
  @include halfpxline(0, $fontColorGray, 0, 0, 0, 1px);
  float: left;
  width: 25%;
  padding: 5px 0;
  text-align: center;
  font-size: $fontSizeTips;

  &:after {
    top: 25%;
    height: 100%;
  }

  &:first-child {
    @include halfpxline(0, #ddd, 0, 0, 0, 0);
  }

  span {
    font-size: $fontSizeH4;
    display: block;
    color: $fontColorBlack;
  }
}

.member-list {
  padding: 0;
  display: flex;
  // @include halfpxline(0, $bgGray, 1px, 0, 0, 0);
  border-bottom: 1px solid $bgGray;

  &.member-list-padding {
    padding: 0 $padding*2;
  }

  .member-block {
    flex: 1;
    padding: 10px 0;
    background-color: #fff;
    color: $fontColor;

    .icon {
      width: 100%;
      height: 30px;
      margin: 0 auto;
      display: block;

      &:before {
        left: 50%;
        margin-left: -15px;
      }
    }
  }
}

main {
  @extend %clearfix;
  text-align: center;
}

.user-center-order {
  @extend %clearfix;
  text-align: center;
  border-top: $padding solid $bgGray;
}

.user-center-block {
  @include halfpxline(0, $bgGray, 1px, 0, 0, 0);
  border-bottom: $padding solid $bgGray;

  .tuijian-tips {
    position: absolute;
    top: 0;
    left: 0;
    width: 53px;
    height: 36px;
    background: url("~assets/img/user-center/share.png") no-repeat;
    background-size: 100%;
  }
}

.user-center-block-title {
  line-height: 40px;
  text-indent: $padding;
  text-align: left;
  background: $bgGray;
}

.user-center-block-content {
  @extend %clearfix;
  text-align: center;
}

.user-center-operate {
  position: relative;
  float: left;
  width: 33.33%;
  height: 80px;
  padding-top: 46px;
  padding-left: 0;
  background-color: #fff;

  i {
    position: absolute;
    top: 26px;
    left: 50%;
    margin-left: -15px;
    display: block;
  }
}

.user-center-setup {
  border-bottom: $padding solid $bgGray;
  text-align: left;
  font-size: $fontSizeTips;
}
.member-rights {
  padding: $padding 6px;
  border-radius: 30px;
  color: #fff;
  font-size: $fontSize;
  background: #fff;
  color: $fontColorGray;
}

.user-center-setup {
  .weui-cell {
    padding-top: 6px;
    padding-bottom: 6px;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
  .icon-setup {
    width: 30px;
    height: 30px;
    padding-left: 26px;

    // &:before {
    // 	width: 20px;
    // 	height: 20px;
    // 	margin-top: -10px;
    // }
  }
}

.user-center-block-content {
  display: flex;
  font-size: $fontSizeTips;
}

.xueba {
  position: relative;
  padding: $padding;
  padding-top: $padding*2;
  margin: $padding*2 0 $padding;
  background-color: #fff;

  .xueba-header {
    position: absolute;
    left: 0;
    top: - $padding;
    padding: 0 $padding*1.5 0 $padding;
    line-height: 2;
    background: url(~assets/img/user-center/xueba-bg.png) no-repeat;
    background-size: 100% 100%;
    color: #fff;
  }

  .xueba-content {
    position: relative;
    text-align: left;
    display: flex;

    img {
      height: 5em;
    }

    p {
      flex: 1;
      line-height: 2;
      padding-left: 2em;
    }

    span {
      // display: block;
    }
  }
}
</style>
<style>

</style>
>