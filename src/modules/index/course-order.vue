<!-- 
	课程支付页面，报名参加课程，包含复训和升级
 -->

<template>
	<div class="enlist dn-form scroll-fix" v-cloak>
		<h5 class="enlist-title">{{ courseInfo.name }}</h5>
		
		<!-- <template v-if="courseInfo.type != 'package'"> -->
			<el-img-text :img-text-data="courseInfo"></el-img-text>    
		<!-- </template> -->

		<!-- <template v-else>
			<el-img-text v-for="(item, index) in courseInfo.list" :img-text-data="item" :key="index"></el-img-text>
			<div class="img-text-info" v-if="courseInfo.originalPrice">
				<span>原价：{{ courseInfo.originalPrice }}元</span>
				<p>活动价：{{ courseInfo.price }}元</p>
			</div>
		</template>
 -->
		<el-friend @on-hide-popup="onChangeFriend"></el-friend>
		
		<group v-if="courseInfo.type != 'package'">
			<x-number :title="'门票券' + ticketDatas.maxNum + '张可用'" :max="ticketDatas.maxNum" :min="ticketDatas.minNum" v-model="ticketDatas.useNum"></x-number>
		</group>	
		
		<group>
			<x-switch title="抵用券可用金额" :inline-desc="voucher.num" v-model="voucher.status"></x-switch>
		</group>

		<el-cart-course :cart-course-data="cartCourseData" :cart-course-data-status="cartCourseDataStatus"></el-cart-course>
	</div>
</template>

<script type="text/babel">
	import { Group, Cell, XSwitch, Selector, XNumber, XInput, XButton, FormPreview, Popup, TransferDomDirective as TransferDom } from 'vux'
  import { mapState } from 'vuex'
	import elVerificationCode from 'components/verification-code/verification-code'
	import elFriend from 'components/friend/friend'
	import elTicket from 'components/ticket/ticket'
	import elImgText from 'components/img-text/img-text-course'
	import elCartCourse from 'components/cart/cart-course'

	export default {
		name: 'pay',
		directives: {
	    TransferDom
	  },
		components: { Group, Cell, XSwitch, Selector, XNumber, XInput, XButton, FormPreview, Popup, elFriend, elTicket, elImgText, elCartCourse },
		data () {
			return {
				title: '报名参加课程',
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
        courseId:'',
				tel: "",
				ticketDatas: {
					minNum: 0,
					maxNum: 0,
					useNum: 0,
				},
				ticketData: 0,
				voucher: {
					status: false,
					num: "0"
				},
				addManInfo: [],
				friendValue: [],
				orderInfo: {}
			}
		},
		computed: {
			...mapState({
        user: state => state.user,
        isLoading: state => state.isLoading,
      }),
			cartCourseDataStatus () {
				let status = false;
				
				if(this.friendValue.length > 0) {
					status = true
				}

				return status;
			},
			cartCourseData () {
				let voucherAmount = 0,
						amount = this.friendValue.length,
						adTicketCount = this.ticketDatas.useNum,
						enrollInfo = "",
						money = (amount-adTicketCount) * this.courseInfo.price;

				if(this.voucher.status) {
					voucherAmount = parseFloat(this.voucher.num);

					if(money < voucherAmount) {
						voucherAmount = money;
						money = 0;
					} else {
						money = parseFloat(money - voucherAmount);
					}
				}

				if(amount > 0) {
					this.friendValue.map(function(item, index) {
						if(index == 0) {
							enrollInfo += item.friendId;
						} else {
							enrollInfo += "," + item.friendId;
						}
					});
				}

				return {
					"type": this.$route.query.type,
					"id": this.$route.query.id,
					"price": this.courseInfo.price,
					"amount": amount + "", // 数量
					"money": money + "", // 金额
					"orderType": "1", // orderType:1课程2音视频3奖赏4商城
					"voucherAmount": this.voucher.status ? 1 : 0, // 使用课程券的金额
					"adTicketCount": adTicketCount + "", // 使用门票的数量，默认为0
					"enrollInfo": enrollInfo // 报名人信息
				}
			}
		},
		mounted () {
			this.fetchData();
      
		},
		methods: {
			fetchData () {
				let _this = this,
						url = '/api/curriculum/addCurriculum',
						query = {
							customerId: _this.user.userId,
							periodsId: _this.courseInfo.id
						};
				if(_this.courseInfo.type == 'activity') {
					url = '/api/curriculum/addOffineActivity';
					query = {
						customerId: _this.user.userId,
						activityId: _this.courseInfo.id
					}
				} else if (_this.courseInfo.type == 'package') {
					url = '/api/curriculum/addLessonsPackage';
					query = {
						customerId: _this.user.userId,
						lessonPackageId: _this.courseInfo.id
					}
				}

				_this.$http.post(url,
					_this.qs.stringify(query)).then(function(e) {
						if(e.data.code == 200) {
							let resInfo = e.data.data;
			  			let date = resInfo.startTime + " - " + resInfo.endTime;
			  			let list = [];
							_this.courseId = resInfo.courseId||0;

							if (_this.courseInfo.type == 'package') {
								// _this.voucher.num = resInfo.voucherPrice || 0;

								if(resInfo.lessons.length > 0) {
									list = resInfo.lessons.map(function(it, index){
										let datePeriods = it.startDate + " - " + it.endDate;
				  						return {
												id: it.lessonsId,
												name: it.lessonName,
												isClick: false
				  						}
									})

									_this.courseInfo = {
				  					course: "",
										id: _this.$route.query.id,
										type: _this.$route.query.type,
										startDate: resInfo.startTime,
										address: resInfo.address, // 1
										name: resInfo.discountName, 
										price: resInfo.discountprice,
										originalPrice: resInfo.packagePrice, // 1
										remark: resInfo.remark, // 1
										img: resInfo.images, // 1
										count: resInfo.remainingNumber,
				  					date: "",
				  					isClick: false
									}
								}
							} else if(_this.courseInfo.type == 'activity') {
								_this.courseInfo =	{
									course: "",
									id: _this.$route.query.id,
									type: _this.$route.query.type,
									startDate: resInfo.startTime,
									address: resInfo.address, // 1
									name: resInfo.activityName, 
									price: resInfo.price,
									originalPrice: resInfo.originalPrice || resInfo.price, // 1
									remark: resInfo.remark, // 1
									img: resInfo.images, // 1
									count: resInfo.remainingNumber,
			  					date: date,
			  					isClick: false
								};
							} else {
								_this.courseInfo =	{
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
							})
						}
					}
				);
			},
	    onChangeFriend (val) {
	    	this.friendValue = val;	    	
	    },
       // 拉取奖学金，抵用券
    getScholarship() {
      let _this = this;
      _this.$http
        .post(
          "/api/userInfo/userAttribute",
          this.qs.stringify({
            customerId: _this.user.userId,
            lessonId: _this.courseId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;
            _this.voucher.num = res.voucherAmount || 0;
            _this.ticketDatas.maxNum = res.admissionTicket || 0;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    }
	  }
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/icon';

	.enlist {
		width: 100%;
		height: 100%;
		background: $bgGray;
	}
	
	.enlist-title {
		padding: 0 $padding;
		line-height: 50px;
		font-size: $fontSizeH3;
		color: #fff;
		background: #fff;
		// background: $colorYellowEasy;
		overflow: hidden;
		color: $fontColorBlack;

		.price {
			float: right;
			color: $colorRed;
		}
	}

	.img-text-course {
		background: #fff;
		padding: 0 $padding;
	}

	.img-text-info {
		@include imgTextPriceInfo();
		padding: 0 $padding;
	}
</style>