<!-- 
	门票券
 -->

<template>
	<div class="ticket">
		<group>
			<cell title="门票" @click.native="showTicketPopup" is-link>
				<div v-if="ticketData > 0" class="ticket-btn" slot="after-title">{{ ticketData }}张可用</div>
				<div v-else class="ticket-btn" slot="after-title">暂无可用</div>
			</cell>
		</group>

		<div v-transfer-dom>
			<popup class="ticket-popup" v-model="ticketPopup.status" position="right" is-transparent>
				<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
					<div class="ticket-content">
						<x-button class="ticket-popup-btn" type="primary" @click.native="hidePopup">确定</x-button>
						<divider v-show="scrollerInfo.list">可用课程门票</divider>
						<div v-show="item.status" @click="ticketSelect(item)" :class="['ticket-block', {'select': item.select}]" v-for="(item, index) in  scrollerInfo.list" :key="index">
							<div :class="['ticket-block-content', { 'active': item.tips }]">
								<div class="ticket-block-left">
									<div class="ticket-block-img">
										<img :src="item.img" alt="">
									</div>
									<div class="ticket-block-info">
										<h5>{{ item.name }}</h5>
										<span>{{ item.remark }}</span>
										<p>截止日期：{{ item.time }}</p>
									</div>
								</div>
								<div class="ticket-block-right">
									<p>
										<span>门票价值</span>
										<label><i>￥</i>{{ item.price }}</label>
									</p>
								</div>	
							</div>
							<div v-if="item.tips" class="ticket-tips">{{ item.tips }}</div>
						</div>
						<divider v-show="scrollerInfo.list">不可用课程门票</divider>
						<div v-show="!item.status" @click="ticketSelect(item)" :class="['ticket-block', {'select': item.select}]" v-for="(item, index) in  scrollerInfo.list" :key="index">
							<div :class="['ticket-block-content', { 'active': item.tips }]">
								<div class="ticket-block-left">
									<div class="ticket-block-img">
										<img :src="item.img" alt="">
									</div>
									<div class="ticket-block-info">
										<h5>{{ item.name }}</h5>
										<span>{{ item.remark }}</span>
										<p>截止日期：{{ item.time }}</p>
									</div>
								</div>
								<div class="ticket-block-right">
									<p>
										<span>门票价值</span>
										<label><i>￥</i>{{ item.price }}</label>
									</p>
								</div>	
							</div>
							<div v-if="item.tips" class="ticket-tips">{{ item.tips }}</div>
						</div>
						<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
					</div>
				</scroller>
			</popup>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Group, Cell, XButton, Popup, Divider, TransferDomDirective as TransferDom  } from 'vux'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "ticket",
		directives: {
	    TransferDom
	  },
		components: { Scroller, Group, Cell, XButton, Popup, Divider, elLoadMore },
		props: ['ticketInfo'],
		data () {
			return {
				title: "门票券",
				scrollerInfo: {
					offsetBottom: 60,
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: [
						// {
						// 	img: "",
						// 	code: "",
						// 	name: "",
						// 	remark: "",
						// 	tips: "",
						// 	time: "",
						// 	price: ""
						// }
					]
				},
				ticketData: this.value,
				ticketPopup: {
					status: false
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				if(this.scrollerInfo.onFetching) return;
				this.scrollerInfo.onFetching = true;		

				this.$http.post('/wechat/usercenter/customer/adticket',
						{
							"customerCode": _this.$store.state.user.userCode,
							"productCode": _this.ticketData.code,
							"pageNum": _this.scrollerInfo.pageNum,
							"pageSize": _this.scrollerInfo.pageSize
						}
					).then(function(e) {
						if(e.data.code == 200){
							let list = [];

							if(e.data.data.adticketList && e.data.data.adticketList.length > 0) {
								list = e.data.data.adticketList.map(function(item, index){
									return {
										img: _this.resolveImg(item.thumbnail),
										code: item.adticketCode,
										name: item.productName,
										remark: item.remark || "在线支付专享",
										tips: "",
										time: item.endTime,
										price: item.price || "100",
										status: item.status,
										select: false
									}
								})
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.scrollerInfo.list = list;
							} else {
								_this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
							}

							_this.scrollerInfo.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
					})
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
					this.scrollerInfo.onFetching = false;			
          this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {
          this.$refs.scrollerBottom.reset()
				} else {
					this.fetchAgency()
				}
			},
	    showTicketPopup () {
	    	this.ticketPopup.status = true;
	    },
	    hidePopup () {
	    	this.ticketPopup.status = false;
	    },
	    ticketSelect (obj) {
	    	obj.select = !obj.select;
	    }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$ticketRadius: $borderRadius;
	$ticketImgW: 80px;

	.ticket {
		width: 100%;
		background: $bgGray;
	}

	.ticket-btn {
		position: absolute;
		top: 50%;
		right: $padding + 12px;
		margin-top: -12px;
	}

	.ticket-popup {
		width: 100% !important;
		height: 100%;
		background: $bgGray !important;
	}

	.ticket-content {
		padding: $padding;
	}

	.ticket-popup-btn {
		margin-bottom: $padding;
	}

	.ticket-block {
		margin-bottom: $padding;

		&.select {
			.ticket-block-right {
				position: relative;

				&:before {
					content: "";
					position: absolute;
					right: 0;
					bottom: 0;
					width: 30px;
					height: 30px;
					background: url("~assets/img/icon/select.png") no-repeat;
					background-size: 100%;
				}
			}
		}
	}

	.ticket-block-content {
		display: flex;

		&.active {
			.ticket-block-left {
				border-radius: $ticketRadius 0 0 $ticketRadius;
			}
			.ticket-block-right {
				border-radius: 0 $ticketRadius $ticketRadius 0;
				border-left: 0;
			}
		}
	}

	.ticket-block-left {
		position: relative;
		flex: 1;
		background: #fff;
		border-radius: $ticketRadius;

		.ticket-block-img {
			position: absolute;
			left: $padding/2;
			top: 0;
			width: $ticketImgW;
			height: 100%;
			// border-radius: $ticketImgW;
			overflow: hidden;
			display: flex;
			align-items: center;

			img {
				width: 100%;
				// height: 100%;
			}
		}

		.ticket-block-info {
			width: 100%;
			padding: $padding/2;
			padding-left: $ticketImgW + $padding;

			h5 {
				font-size: $fontSizeH4;
				@include ellipsisOne();
			}

			p {
				font-size: $fontSizeTips;
			}

			span {
				@include ellipsisOne();
				font-size: $fontSizeTips;
				color: $fontColorGray;
			}
		}
	}

	.ticket-block-right {
		position: relative;
		width: 6em;
		background: #fff;
		border-radius: $ticketRadius;
		display: flex;
		align-items: center;
		text-align: center;
		border-left: 2px dashed $borderColor;

		span {
			font-size: $fontSizeTips;
			color: $fontColorGray;
			display: block;
		}

		label {
			font-size: $fontSizeH4;
			color: $colorYellowEasy;

			i {
				font-style: normal;
				font-size: $fontSizeTips;
			}
		}
	}

	.ticket-tips {
		width: 100%;
		border-top: 2px dashed $borderColor;
		padding: 0 $padding/2;
		line-height: 30px;
		border-radius: $ticketRadius;
		color: $fontColorGray;
		background: #fff;
	}
</style>