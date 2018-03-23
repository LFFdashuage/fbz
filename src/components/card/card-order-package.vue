<!-- 
	订单内套餐订单产品展现卡
 -->

<template>
	<div  class="card-order-list" v-cloak>
	  <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
			<div>
				<div class="package-block" v-for="(item, index) in cardData" :key="index">
					<div class="package-block-header">
						<!-- <div class="order-no">订单号：{{ item.orderNo }}</div> -->
						<!-- <div class="package-info"> -->
							<p>{{ item.name }}</p>
							<span>{{ item.statusName }}</span>
						<!-- </div> -->
					</div>

					<div class="package-block-content">
						<div class="package-detail-block" v-for="(it, ind) in item.list" :key="ind">
							<div class="img" :style="{backgroundImage: 'url(' + it.img + ')' }">
								<!-- <img :src="it.img" alt=""> -->
							</div>
							<div class="text">
								<h5 v-if="it.name" class="title">{{ it.name }}</h5>
								<p class="address fa fa-calendar">{{ it.date }}</p>
								<p class="address fa fa-map-marker">{{ it.address }}</p>
								<div class="text-detail">
									<div class="num">x{{ it.num }}</div>
									<div class="price">￥{{ it.price }}</div>
								</div>
							</div>
						</div>
					</div>

					<div class="package-footer">
						<!-- 显示商品总量 -->
						<div class="package-all-info">
							<p>合计金额</span>：<span>￥{{ item.actualAmount }}</span></p>
						</div>
						
						<div class="package-footer-btn">
							<!-- 支付状态 -->
							<template v-if="item.orderStatus == 0">
								<x-button class="btn" @click.native="deleteOrder(item, index)" mini>取消</x-button>
								<x-button class="btn" @click.native="payment(item)" mini>立即支付</x-button>
							</template>
						</div>
					</div>
				</div>
				<el-load-more :load-all="onFetchAll"></el-load-more>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, XButton } from "vux";

	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "cardPackage",
		components: {
			Scroller, XButton, elLoadMore
		},
		props: ['cardData', 'cardCount', 'cardIndex', 'onFetching', 'onFetchAll'],
		data () {
			return {
				title: "产片卡片",
				list: [{
					orderNo: "1111111111111111",
					name: "企业运营大系统套餐",
					statusName: "待付款",
					statusValue: 0,
					remainingNum: 1,
					list: [
						{
							img: "",
							name: "执行模式4.0 王笑菲",
							num: 1,
							date: "2017/11/09-2017/11/21",
							address: "上海",
							price: "99.9",
							originalPrice: "110",
							orderStatus: 0
						}
					]
				}],
				scrollerInfo: {
					offsetBottom: 3,
					onfetching: false,
					loadAll: false, // 是否加载完
				},
			}
		},
		watch: {
			cardData (newValue, oldValue) {
				let _this = this;
				setTimeout(function(argument) {
					_this.$nextTick(() => {
	          _this.$refs.scrollerBottom.reset()
	        })
				})
			} 
		},
		methods: {
			payment (obj) {
				// 应传code
				this.$router.push({name: "confirmOrder", query: { orderId : obj.orderId, type: obj.type, orderType: obj.orderType }});
			},
			goPage (url, query) {
				this.$router.push({ name: url, query: query })
			},
			deleteOrder (item, ind) {
				let _this = this;
				_this.$vux.confirm.show({
					content: "确认取消订单？",
					onConfirm () {
						_this.$http.post('/api/customer/order/delete',
			  			_this.qs.stringify({
			  				customerId: _this.$store.state.user.userId,
		  					orderId: item.orderId
			  			})).then(function(e) {
			  				if(e.data.code == 200) {
									_this.cardData.splice(ind, 1);
									_this.$vux.toast.show({
										text: "删除成功"
									})
			  				} else {
			  					_this.$vux.alert.show({
			  						content: e.data.msg
			  					})
			  				}
			  		});		
					}
				})
			},
			loadMore () {
				this.$emit("on-load-more", this.cardIndex)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.package-block {
		@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);
		margin-top: $padding;
	}

	.package-block-header {
		@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		position: relative;
		height: $inputH;
		line-height: $inputH;
		padding: 0 $padding;

		p {
			float: left;
			max-width: 80%;
			@include ellipsisOne();
		}

		span {
			float: right;
			color: $fontColorGray;
		}
	}

	.package-block-content {
		width: 100%;
	}

	.package-detail-block {
		width: 100%;
		line-height: 1.75;
		padding: $padding;
		display: flex;

		.img {
			position: relative;
			width: 100px;
			height: 100px;
			background-size: cover;
			overflow: hidden;

			img {
				width: 100%;
			  width: auto;
			  height: auto;
			  margin: auto;
			}
		}

		.text {
			flex: 1;
			padding-left: .5em;

			.title {
				font-size: $fontSizeH4;
			}
		}

		p {
			line-height: 1.75;
			display: block;
		}

		.fa {
			&:before {
				width: 2em;
				padding-right: .5em;
			}
		}

		.text-detail {
			.num {
				float: left;
			}

			.price {
				float: right;
			}
		}
	}

	.package-footer {
		@extend %clearfix;
		padding: 4px $padding;

		.btn {
			float: right;
			width: auto;
	    margin: 6px 0;
	    margin-left: 10px;
	    line-height: $inputH - 12px;
		}
	}

	.package-all-info {
		float: left;
  	@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		line-height: $inputH;

		span {
			color: $colorOrange;
		}
	}

	.package-footer-btn {
		float: right;
		@extend %clearfix;
		line-height: $inputH;
	}
</style>