<!-- 
	我的资源订单列表页面
 -->

<template>
	<div class="order-list" v-cloak>
		<tab :line-width=2 v-model="tabSelected">
      <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">{{ item.name }}</tab-item>
    </tab>
    <swiper v-model="tabSelected" height="100%" :show-dots="false" :threshold="tabChangeW">
      <swiper-item v-for="(tabDataItem, tabDataIndex) in tabData" :key="tabDataIndex">
    		<!-- <el-card-order @on-load-more="loadMore" :card-data="item.list" :card-count="count" :card-index="index"></el-card-order> -->
    		<template v-if="tabDataItem.value == 'video'">
	  			<scroller class="scroller" lock-x height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
						<div>
  						<el-img-text-rank @on-btn-click="btnClick" v-for="(item, ind) in tabDataItem.list" :img-text-data="item" img-text-btn="-1" :key="ind"></el-img-text-rank>

							<el-load-more :load-all="tabDataItem.loadAll"></el-load-more>
  					</div>
  				</scroller>
    		</template>

    		<template v-if="tabDataItem.value == 'file'">
	  			<scroller class="scroller" lock-x height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
  					<div>
							<el-file-block v-for="(item, ind) in tabDataItem.list" :file-data="item" :key="ind"></el-file-block>
  						<!-- <el-img-text-rank @on-data-change="btnFileClick" v-for="(item, ind) in tabDataItem.list" :is-download=true :img-text-data="item" img-text-btn="1" :key="ind"></el-img-text-rank> -->
							
							<el-load-more :load-all="tabDataItem.loadAll"></el-load-more>
    				</div>
    			</scroller>
    		</template>

    		<template v-if="tabDataItem.value == 'column'">
	  			<scroller class="scroller" lock-x height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
						<div class="column-list">
  						<el-img-text-column @on-btn-click="btnClick" v-for="(item, ind) in tabDataItem.list" :img-text-data="item" :key="ind"></el-img-text-column>

							<el-load-more :load-all="tabDataItem.loadAll"></el-load-more>
  					</div>
  				</scroller>
    		</template>
      </swiper-item>
    </swiper>
	</div>
</template>

<script type="type/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem } from 'vux'

	import elImgTextRank from 'components/img-text/img-text-rank'
	import elLoadMore from 'components/load-more/load-more'
	import elFileBlock from 'components/file/file-block'
	import elImgTextColumn from 'components/img-text/img-text-column'

	export default {
		name: 'orderList',
		components: {
			Scroller, Tab, TabItem, Swiper, SwiperItem, 
			elImgTextRank, elLoadMore, elFileBlock, elImgTextColumn
		},
		data () {
			return {
				title: '订单列表页面',
				count: this.wordBook.pageSize,
				tabChangeW: this.wordBook.tabChangeW,
				scrollerInfo: {
					offsetBottom: 20,
					onfetching: false,
					loadAll: false, // 是否加载完
				},
				tabData: [
					{
						value: 'video',
						name: '音视频',
						type: "0",
						pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					},{
						value: 'file',
						name: '资料',
						type: "1",
					  pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					},{
						value: 'column',
						name: '专栏',
						type: "2",
						pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					}
				],
				tabSelected: this.$route.query.type || 0
			}
		},
		watch: {
			tabSelected (newValue, oldValue) {
				this.onTabClick(newValue)
			}
		},
		mounted () {
			// 取全部数据(当前数据)
			this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
			// this.fetchData(this.tabData[0], 0);
		},
		methods: {
			fetchData (obj, ind = 0) {
				let _this = this;
				if(this.tabData[this.tabSelected].onFetching) return;
				this.tabData[this.tabSelected].onFetching = true;	

				if(obj.type == 0) {
					_this.getVideo(obj, ind);
				} else if(obj.type == 1) {
					_this.getFile(obj, ind);
				} else {
					_this.getColumn(obj, ind);
				}
			},
			getColumn (obj, ind) {
				let _this = this;

				this.$http.post('/api/product/term/list',
						_this.qs.stringify({
							isPurchased: 1,
							customerId: _this.$store.state.user.userId,
							pageNum: obj.pageNum,
							pageSize: _this.count
						})).then(function(e) {
							let responseData = e.data.data,
									customerShopOrderList = [];
							_this.tabData[ind].onFetching = false;					

							if(e.data.code == 200) {
								if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
									customerShopOrderList = e.data.data.result.map(function(item, index) {
										return {
		                  id: item.termId,
		                  img: item.images,
		                  price: item.price,
		                  readCount: item.playCount,
		                  buyCount: item.buyCount,
		                  desc: item.remark,
		                  title: item.termName,
		                  totalTerm: item.totalTerm,
		                  upToDate: item.updateCount
										}
									})
								}

								if(customerShopOrderList.length < _this.count) {
									_this.tabData[ind].loadAll = true;
								}

								if(obj.pageNum == 1) {
									_this.tabData[ind].list = customerShopOrderList;
								} else {
									_this.tabData[ind].list = _this.tabData[ind].list.concat(customerShopOrderList);
								}
								_this.tabData[ind].pageNum++;
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}

							_this.resetView(ind);
					})
			},
			getFile (obj, ind) {
				let _this = this;

				this.$http.post('/api/customer/material',
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							pageNum: obj.pageNum,
							pageSize: _this.count
						})).then(function(e) {
							if(e.data.code == 200) {
								let res = e.data.data,
										list = [];
								if(res.result.length > 0){
									list = res.result.map(function(item, index){
										return {
											id: item.materialId,
											name: item.name,
											// type: item.memo,
											pay: item.integralAmount,
											isBuy: item.downloadStatus,
											download: item.downloadCount,
											price: item.integralAmount,
										}
									})
								}

								if(list.length < _this.count) {
									_this.tabData[ind].loadAll = true;
								}

								if(obj.pageNum == 1) {
									_this.tabData[ind].list = list;
								} else {
									_this.tabData[ind].list = _this.tabData[ind].list.concat(list);
								}
								_this.tabData[ind].pageNum++;
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
							_this.resetView(ind);
					})
			},
			getVideo (obj, ind) {
				let _this = this;

				this.$http.post('/api/customer/product/online',
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							pageNum: obj.pageNum,
							pageSize: _this.count
						})).then(function(e) {
							let responseData = e.data.data,
									customerShopOrderList = [];
							_this.tabData[ind].onFetching = false;					

							if(e.data.code == 200) {
								if(responseData && responseData.result && responseData.result.length > 0) {
									customerShopOrderList = responseData.result.map(function(item, index) {
										return {
											img: item.images,
											id: item.id,
											title: item.name,
											type: item.remark,
											pay: item.price,
											originalPrice: item.originalPrice, // 原价
											isBuy: 1,
											like: {
												num: item.viewCount,
												percent: item.rank
											},
											url: 'courseTypeDetail',
											query: {
												id: item.id,
												type: item.onlineType == 1 ? 'video' : 'audio'
											}
										}
									})
								}

								if(customerShopOrderList.length < _this.count) {
									_this.tabData[ind].loadAll = true;
								}

								if(obj.pageNum == 1) {
									_this.tabData[ind].list = customerShopOrderList;
								} else {
									_this.tabData[ind].list = _this.tabData[ind].list.concat(customerShopOrderList);
								}
								_this.tabData[ind].pageNum++;
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}

							_this.resetView(ind);
					})
			},
			resetView (ind) {
				let _this = this;
				this.$nextTick(() => {
					this.tabData[this.tabSelected].onFetching = false;	
          this.$refs.scrollerBottom[ind].reset()
        })
			},
			onTabClick (val) {
				if(this.tabData[val].list.length == 0){
					this.fetchData(this.tabData[val], val)
				}
			},
			loadMore (val) {
				this.fetchData(this.tabData[val], val)
			},
			btnClick (val) {
				if(!this.isLogin()) return false;
				
				let _this = this;
				_this.payCode = val.params.code;
					
				this.$http.post('/wechat/order/create',
					{
						"userCode": _this.$store.state.user.userCode,
						"productCode": val.params.code,
						"amount": 1,
						"money": val.pay,
						"allMoney": val.pay,
						"orderType":  4,
						"lessonCode": '',
						"address": ""
					}).then(function(e) {
						let responseData = e.data;

						if(responseData.errcode != 1) {
							_this.$vux.toast.show({
			          text: responseData.msg
			        })
						} else {
							_this.pay.show = true;
							_this.pay.allPrice = val.pay;
							_this.pay.list[0].value = responseData.data.order.code;
							_this.pay.list[1].value = val.title;
							_this.pay.list[2].value = 1;
						}
					})	
			},
			btnFileClick (val, status) {
				let _this = this;
				if(status == "download") {
					_this.tabData[2].list.map(function(item, index) {
						if(item.code == val.query.code) {
							item.download++;
							item.isBuy = 1;
						}
					});
				}
			},
			loadMore () {
				if(this.tabData[this.tabSelected].onFetching || this.tabData[this.tabSelected].loadAll) {
          this.$refs.scrollerBottom[this.tabSelected].reset()
				} else {
					this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
				}
			}
		}
	}
</script>

<style lang="scss">
	.order-list .vux-slider {
		height: 100%;
	}
</style>>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.order-list {
		height: 100%;
	}

	.column-list {
		padding: 0 $padding;
	}
</style>