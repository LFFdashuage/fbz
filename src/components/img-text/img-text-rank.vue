<!-- 
	视频和音频 排行榜图文混排
 -->

<template>
	<div class="img-text img-text-rank" @click="goPage(imgTextData.url, imgTextData.query)" v-cloak>
		<div v-if="imgTextData.img" :class="['img-text-img', imgTextData.query.type]">
			<img class="img" :src="imgTextData.img" alt="">
		</div>
		
		<div class="text">
			<h5 :class="['title', {'text-left': isDownload }]">{{ imgTextData.title }}</h5>
			<p class="type">{{ imgTextData.type }}</p>
			
			<p v-if="imgTextData.like.num || imgTextData.like.num == 0">
				<rater v-model="raterNum" :margin="wordBook.raterConfig.margin" slot="value" :max="wordBook.raterConfig.max" :font-size="wordBook.raterConfig.fontSize" :active-color="wordBook.raterConfig.activeColor" disabled></rater>
				（{{ imgTextData.like.num }}）
			</p>
			<p v-if="imgTextData.download || imgTextData.download == 0">下载次数：{{ imgTextData.download }}</p>

			<div class="price-rank">
				<div class="original-price">原价：￥{{ imgTextData.originalPrice }}</div><span>￥</span>{{ imgTextData.pay }}
			</div>
			
		</div>

		<div v-transfer-dom>
			<popup v-model="payShow" position="bottom">
	      <div class="pay">
					<form-preview header-label="付款金额" :header-value="pay.allPrice" :body-items="pay.list"></form-preview>	
	      	
	      	<div class="pay-btn">
						<x-button type="primary" :class="{'disabled': !user.pay}" @click.native="payOrder">支付</x-button>
	      	</div>
	    	</div>
	    </popup>
    </div>
	</div>
</template>

<script type="text/babel">
	import { Rater, TransferDom, XButton, FormPreview, Popup } from 'vux'
  import { mapState } from 'vuex'

	export default {
		name: "imgTextRank",
		components: { Rater, XButton, FormPreview, Popup },
		directives: {
	    TransferDom
	  },
		props: ['imgTextData', 'imgTextBtn', 'isDownload', 'imgTextInd', 'fromRank'],
		data () {
			return {
				// raterConfig: this.wordBook.raterConfig,
				list: {
					title: '',
					type: '',
					pay: '',
					isBuy: 0,
					img: '',
					like: {
						num: 0,
						percent: 0
					},
					isClick: false,
					url: '',
					query: {}
				},
				btnStatus: {
					order: false,
					pay: false
				},
				btns: [
					{
						link: '',
						name: '播放'
					},{
						link: '',
						name: '下载'
					}
				],
				payShow: false,
				pay: {
					show: false,
					allPrice: 0,
					list: [
						{
			        label: '订单号',
			        value: ''
			      }, {
			        label: '名称',
			        value: ''
			      }, {
			        label: '数量',
			        value: ''
			      }
			    ]
				},
				payCode: '',
				// raterNum: 5,
				raterNum: this.imgTextData.like && this.imgTextData.like.percent ? this.imgTextData.like && this.imgTextData.like.percent : 5
			}
		},
		computed: {
			...mapState({
        user: state => state.user,
        loadbar: state => state.loadbar
      }),
			isClick () {
				if(this.imgTextData.pay == 0) {
					return true
				} else if (this.imgTextData.isBuy > 0) {
					return true
				} else {
					return false
				}
			}
		},
		watch: {
			payShow (newValue, oldValue) {
				this.$emit("on-pay-show", newValue);
			}
		},
		mounted () {
		},
		methods: {
			goPage (url, query) {
				// 1、没有url 不跳转
				// 2、没有btn （课程）判断是否购买过，判断是否绑定，判断是否
				// 3、没有购买
				let _this = this;
				if(!url) {
					return false
				}

				_this.$router.push({name: url, query: query });
			},
			downloadFile (status) {
				let _this = this;
				_this.$http.post('/api/product/online/order/confirm',
					_this.qs.stringify({
						productId: _this.imgTextData.query.id,
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						if(e.data.code == 200) {

						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							});
						}
						// _this.$emit('on-data-change', _this.imgTextData, 'download', _this.imgTextInd);
						// window.location = _this.imgTextData.downloadUrl;
					})
			},
			payOrder () {
	    	let _this = this;

				if(!this.user.pay) return false;
				if(!this.loadbar.isLoading) {
					_this.$store.commit('updateLoadingStatus', {isLoading: true});
					_this.payShow = false;
					// this.payWeixinOrder(_this.pay.list[0].value);
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text';

	.pay-btn {
		padding: $padding;

		.disabled {
			background: $disabledPay;
		}
	}
	
	.price-rank {
		position: relative;
		float: right;
		text-align: right;
		color: $colorRed;
		font-size: $fontSizeH4;

		.original-price {
			padding-right: .5em;
			font-size: $fontSizeTips;
			letter-spacing: -0.1em;
			color: $fontColorGray;
			text-decoration: line-through;
			display: inline-block;
		}

		span {
			float: none;
			// position: absolute;
			// bottom: 0px;
			// left: -1em;
			font-size: $fontSize;
			color: $colorRed;
		}
	}	
</style>