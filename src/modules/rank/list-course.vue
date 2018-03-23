<!-- 
	课程下载
 -->

<template>
	<div class="rank-list" v-cloak>

    <div class="top-search">
      <search
		    v-model="search"
		    @on-submit="submitCheck"
		    placeholder="请输入要搜索资料名称"
		    ref="search"></search>
    </div>
    
		<div class="container">
			
			<!-- <el-filter-file class="rank-filter scroll-fix" :filter-data="filterData" @on-selected-change="setSelectedId"></el-filter-file> -->

	      
	      <tab class="tab" v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabData" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>

				 <el-filter-file class="rank-filter" :filter-data="filterData" @on-selected-change="setSelectedId"></el-filter-file>

	      <swiper class="list" height="100%" v-model="tabSelected" :show-dots="false" :threshold="tabChangeW">
	        <swiper-item v-for="(tabContentDatasList, index) in tabData" :key="index">
  					<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200">
  						<div class="file-list">
  							<el-file-block v-for="(item, ind) in tabContentDatasList.list" :file-data="item" :key="ind"></el-file-block>
								<el-load-more :load-all="tabContentDatasList.loadAll"></el-load-more>
          		</div>
          	</scroller>
	        </swiper-item>
	      </swiper>
	
    </div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem, XInput , XButton, Search} from 'vux'
	import elImgTextRank from 'components/img-text/img-text-rank'
	import elLoadMore from 'components/load-more/load-more'
	import elFilterFile from 'components/file/new-filter-file'
	import elFileBlock from 'components/file/file-block'

	export default {
		name: 'listCourse',
		components: { Scroller, Tab, TabItem, Swiper, SwiperItem, XInput , XButton, Search, 
			elImgTextRank, elLoadMore, elFilterFile, elFileBlock },
		data () {
			return {
        search: '',
				filterData: [
					{
						status: true,
						id: "",
						name: "全部",
						list: [
							// {
							// 	id: "",
							// 	images: "",
							// 	name: "全部"
							// }
						]
					}
				],
				index: 0,
				count: this.wordBook.pageSize,
				tabChangeW: this.wordBook.tabChangeW,
				scrollerInfo: {
					offsetBottom: 130
				},
				tabData: [
					{
						value: 'new',
						title: '最新上传',
						orderType: 1,
						pageNum: 1,
						pageSize: this.count,
						onfetching: false,
						loadAll: false,
						list: []
					},{
						value: 'most',
						title: '下载最多',
						orderType: 2,
						pageNum: 1,
						pageSize: this.count,
						onfetching: false,
						loadAll: false,
						list: []
					}
				],
				tabSelected: 0,
				newData: [],
				mostData: [],
				selectedId: ''
			}
		},
		watch: {
			tabSelected (newValue, oldValue) {
				this.onTabClick(newValue)
			}
		},
		mounted () {
			this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
		},
		methods: {
			fetchData(obj, ind) {
				let _this = this;

				_this.getData(obj, ind);

				_this.$http.post('/api/index/material/type').then(function(e) {
	  			if(e.data.code == 200) {
						let res = e.data.data,
								list = [];

						if(res.length > 0) {
							list = res.map(function(item, index) {
								return {
									status: true,
									id: item.id,
									name: item.name,
									list: item.children || []
								}
							});
						}
						_this.filterData = _this.filterData.concat(list);
					} else {
						_this.$vux.alert.show({
							content: e.data.msg
						})
					}
	  		})
			},
			getData (obj, ind) {
				let _this = this;

				if(_this.tabData[ind].onFetching) return;
				_this.tabData[ind].onFetching = true;

				_this.$http.post('/api/index/material',
					_this.qs.stringify({
		  			customerId: _this.$store.state.user.userId,
		  			pageNum: obj.pageNum, 
		  			pageSize: obj.pageSize,
		  			orderType: obj.orderType, // 1最新上传， 2最多下载
		  			materialTypeId: _this.selectedId,
            searchKeyword:_this.search
		  		})).then(function(e) {
						let responseData = e.data.data,
								list = [];
						if(e.data.code == 200) {
							if(responseData.result && responseData.result.length > 0) {
								list = responseData.result.map(function(item, index){
									return {
										id: item.materialId,
										name: item.name,
										// type: item.memo,
										pay: item.integralAmount,
										isBuy: item.downloadStatus,
										download: item.downloadCount,
										downloadUrl: _this.resolveImg(item.file_url),
										price: item.integralAmount,
									}
								});
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
						_this.resetView(ind, responseData.pageNum == 1);
		  		});
			},
			resetView (ind, status) {
				this.$nextTick(() => {
					this.tabData[ind].onFetching = false;
          if(status) {
	          this.$refs.scrollerBottom[ind].reset({top: 0})
          } else {
          	this.$refs.scrollerBottom[ind].reset()
          }
        })
			},
			onTabClick (val) {
				if(this.tabData[val].list.length == 0 || this.tabData[val].pageNum == 1){
					this.tabData[this.tabSelected].loadAll = false;
					this.tabData[this.tabSelected].onFetching = false;
            this.getData(this.tabData[val], val);
					}
			  },
			btnClick (val, status, ind) {
				let _this = this;
				_this.tabData[ind].list.map(function(item, index) {
					if(item.code == val.query.code) {
						item.download++;
						item.isBuy = 1;
					}
				});
			},
			loadMore () {
				if(this.tabData[this.tabSelected].onFetching || this.tabData[this.tabSelected].loadAll) {
        	this.$refs.scrollerBottom[this.tabSelected].reset()
				} else {
					this.getData(this.tabData[this.tabSelected], this.tabSelected);
				}
			},
			setSelectedId (val) {
				this.selectedId = val;
				this.tabData.map(function(item, index){
					item.pageNum = 1;
				})
				this.tabData[this.tabSelected].list = [];
				this.tabData[this.tabSelected].onFetching = false;
				this.tabData[this.tabSelected].loadAll = false;
				this.resetView(this.tabSelected, true);
				this.getData(this.tabData[this.tabSelected], this.tabSelected);
        this.search='';
			},
      // 搜索最新上传 
      submitCheck(){
        this.tabData.map(function(item, index){
					item.pageNum = 1;
				})
        this.tabData[this.tabSelected].list = [];
        this.getData(this.tabData[this.tabSelected], this.tabSelected);
    	},
		}
	}
</script>

<style lang="scss">
	.rank-list .vux-slider > .vux-swiper {
    overflow-y: auto;
  }
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/rank';
	.rank-filter {
			width: 84px;
      height: 100%;
			overflow: auto;
			// padding-bottom: 40px;
			-webkit-overflow-scrolling: touch;
		}	
	.container {
    flex: 1;
    width: 100%;
    height: 100%;
	}

	.weui-vcode{
	  font-size: 1rem;
	}

	.tab {
		width: 100%;
		height: auto;
	}

	
</style>