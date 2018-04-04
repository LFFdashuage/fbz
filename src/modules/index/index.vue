<!-- 
	首页
 -->

<template>
	<div class="index" v-cloak>
		<div v-transfer-dom>		
			<el-top></el-top>
		</div>
		
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" ref="scrollerBottom" v-cloak>
			<div class="index-container scroll-fix">
			
				<div class="banner">
		    	<swiper auto dots-position="center" :interval=2000 loop>
		    	<!-- <swiper auto dots-position="center" :interval=2000 :list="bannerTopDatas" loop> -->
		    		<swiper-item v-for="(item, index) in bannerTopDatas" :key="index">
		    			<div class="banner-img" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
		    		</swiper-item>
		    	</swiper>
				</div>
				
				<div v-if="user.level == 'commom'" class="join-in">
					<label for="">现在加入，你讲获得200份免费协议资料。</label>
				</div>
				
				<div class="entry">
					<div v-for="(item, index) in entryDatas" :key="index" :class="['entry-' + item.img]" @click="entry(item.url, item.type)">
						<p>{{ item.name }}</p>
					</div>
				</div>
				<!-- <div @click="goPage({name: 'class'})">
					跳到班级主页
				</div> -->
				<!-- <div @click="goPage({name: 'winWin'})">
					跳到共赢页
				</div> -->
				<!-- 课程预告 -->
				<el-card-more :card-more-data="coursePreview">
					<div class="card-more-content-slot course-preview clearfix" slot="content">
						<div @click="goPage({name: 'courseDetail', query: { periodsId: item.id } })" class="course-preview-block" v-for="(item, index) in coursePreview.list" :key="index">
							<div class="course-preview-header">
								<img :src="item.img" alt="头像">
								<span>{{ item.author }}</span>
							</div>
							<p>{{ item.name }}</p>
							<span>{{ item.date }}</span>
						</div>
					</div>
				</el-card-more>

				<!-- 培训头条 -->
				<div class="index-news">
					<div class="index-news-title">培训<span>头条</span></div>
					<div class="index-news-msg">
						<swiper auto height="32px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
				      <swiper-item v-for="(item, index) in indexNewsList.list" :key="index"><p @click="goPage({name: 'newsDetail', query: {id: item.id}})">{{ item.title }}</p></swiper-item>
				    </swiper>
					</div>
					<div class="index-news-btn" @click="goPage({name: 'news'})">更多</div>
				</div>

				<!-- 音频 -->
				<el-card-more :card-more-data="tuijianAudioDatas">
					<div class="card-more-content-slot clearfix" slot="content">
						<el-card-more-block class="card-more-padding" v-for="(item, index) in tuijianAudioDatas.list" :card-more-block-data="item" :key="index"></el-card-more-block>
					</div>
				</el-card-more>

				<!-- 视频 -->
				<el-card-more :card-more-data="tuijianVideoDatas">
					<div class="card-more-content-slot clearfix" slot="content">
						<el-card-more-block class="card-more-padding" v-for="(item, index) in tuijianVideoDatas.list" :card-more-block-data="item" :key="index"></el-card-more-block>
					</div>
				</el-card-more>
				<!-- <el-card-more :card-more-data="tuijianVideoDatas">
					<div class="peixun-news" slot="content">
						<el-img-text-news :img-text-data="item" @click="goPage({name: 'courseTypeDetail', query: { type: 'video', id: item.id }})" v-for="(item, index) in tuijianVideoDatas.list" :key="index"></el-img-text-news>
					</div>
				</el-card-more> -->

				<!-- 培训导航推荐 -->
				<a :href="bannerCenterDatas.adLinked" class="tuijian-banner">
				<!-- <a href="bannerCenterDatas.adLinked" class="tuijian-banner" @click="goPage('course', {'type': 1})"> -->
					<img :src="bannerCenterDatas.adImage" alt="">
				</a>

				<!-- 专栏订阅 -->
				<el-card-more :card-more-data="specialColumn">
					<div slot="content">
						<el-img-text-column v-for="(item, index) in specialColumn.list" :img-text-data="item" :key="index"></el-img-text-column>
					</div>
				</el-card-more>

				<!-- 底部入口 entrance -->
				<div class="index-entrance">
					<div class="index-entrance-block" v-for="(item, index) in entranceData" :key="index">				
						<div :class="['index-entrance-block-content', 'index-entrance-' + item.img]">
							<p>{{ item.title }}</p>
							<span>{{ item.titleEn }}</span>
						</div>
					</div>
				</div>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
  import { mapState } from 'vuex'
	import hold from 'src/commons/hold'
	import { Scroller, Group, Cell, Swiper, SwiperItem, Card, Panel, Popup, XInput, XButton, TransferDom } from 'vux'
	
	import elTop from 'components/index/top'
	import elTuijian from 'components/tuijian/tuijian'
	import elImgText from 'components/img-text/img-text'
	import elImgTextZhuanlan from 'components/img-text/img-text-zhuanlan'
	import elVideo from 'components/video/video'
	import elCardMore from 'components/card/card-more'
	import elCardMoreBlock from 'components/card/card-more-block'
	import elImgTextNews from 'components/img-text/img-text-news'
	import elImgTextColumn from 'components/img-text/img-text-column'

	import { getterIndex } from 'services/index';

	import imgBanner from 'assets/img/banner-base.jpg'

	export default {
		name: 'index',
		directives: {
	    TransferDom
	  },
		components: { Scroller, Group, Cell, Swiper, SwiperItem, Card, Panel, Popup, XInput, XButton, 
			elTop, elTuijian, elImgText, elImgTextZhuanlan, elVideo, elCardMore, elCardMoreBlock, elImgTextNews, elImgTextColumn },
	  data () {
	    return {
	    	imgBanner: imgBanner,
	    	scrollerInfo: {
					offsetBottom: 94
				},
	    	bannerWidthHeight: this.wordBook.bannerWidthHeight,
	      bannerTopDatas: [],
	      bannerCenterDatas: {},
	      bannerBottomDatas: [],
	      entryDatas: getterIndex.entryDatas,
	      coursePreview: {
	      	title: "课程预告",
	      	url: {
	      		name: "courseNav"
	      	},
	      	text: '更多',
	      	list: []
	      },
	      tuijianAudioDatas: {
	      	title: "音频",
	      	url: {
	      		name: 'rankList',
	      		params: {
		      		type: 'audio'
		      	}
	      	},
	      	text: '查看更多',
	      	list: []
	      },
	      tuijianVideoDatas: {
	      	title: "视频",
	      	url: {
	      		name: 'rankList',
	      		params: {
		      		type: 'video'
		      	}
	      	},
	      	text: '查看更多',
	      	list: []
	      },
	      indexNewsList: {
	      	title: '培训头条',
	      	newsTop: {
	      		title: "",
	      		id: ""
	      	},
	      	url: {
	      		name: 'news'
	      	},
	      	text: '查看更多',
	      	list: [],
	      	timeout: ''
	      },
	      specialColumn: {
	      	title: "专栏订阅",
	      	url: {
	      		name: "specialColumn"
	      	},
	      	text: "查看更多",
	      	list: []
	      },
	      entranceData: [
		      {
		      	title: "赚钱风口",
		      	titleEn: "Make money outlet",
		      	img: "outlet"
		      },{
		      	title: "平台服务",
		      	titleEn: "Platform services",
		      	img: "service"
		      },{
		      	title: "招商融资",
		      	titleEn: "Investment financing",
		      	img: "investment"
		      },{
		      	title: "技术支持",
		      	titleEn: "Technical support",
		      	img: "support"
		      }
		    ]
	    }
	  },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    watch: {
    	bannerTopDatas: (newValue, oldValue) => {
    		console.log(1)
    		// alert(0)
    	}
    },
	  mounted () {
	  	this.fetchData();
	  },
	  methods: {
	  	fetchData	() {
	  		let _this = this;
	  		// 获取所有数据
	  		_this.getBanner(0);
	  		_this.getCourse();
	  		_this.getAudio();
	  		_this.getVideo();
	  		_this.getNews();
	  		// _this.getAd();
	  		_this.getColumn();
	  	},
	  	getAd () {
	  		let _this = this;
  		 	_this.$http.post('/api/goods/recommend'
	  			).then(function(e) {
	  				if(e.data.code == 200) {

	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  				_this.resetView();
	  			});
	  	},
	  	getBanner (type) {
	  		let _this = this;
  		 	_this.$http.post('/api/index/advertisement',
	  				this.qs.stringify({
							type: type
						})
	  			).then(function(e) {
	  				let resData = e.data.data,
	  						topList = [],
	  						midList = [];
	  				if(e.data.code == 200) {
	  					if(resData.adTopList.length > 0) {
		  					topList = resData.adTopList.map(function(item, index){
		  						return {
		  							url: item.adLinked,
									  img: item.adImage
		  						}
		  					});
	  					}
	  					_this.bannerTopDatas = topList;

	  					if(resData.adMidList.length > 0) {
		  					_this.bannerCenterDatas = resData.adMidList[0];
	  					}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  				_this.resetView();
	  			});
	  	},
	  	getAudio () {
	  		let _this = this;
  		 	_this.$http.post('/api/product/online/list',
	  				_this.qs.stringify({
							onlineType: 0, // 音频
							topTag: 1,
							freeStatus: '',
							showRankingStatus: '',
							productId: "",
							pageNum: 1,
							pageSize: 4,
							customerId: ''
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data,
	  							list = [];
	  					
	  					if(res.result.length > 0) {
	  						list = res.result.map(function(item, index){
	  							return {
										id: item.id,
										src: item.images,
										name: item.name,
										originalPrice: item.originalPrice,
										price: item.price,
										desc: item.subscribeStatus,
										type: 'audio'
									}
								})

								_this.tuijianAudioDatas.list = list;
	  					}

	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  				_this.resetView();
	  			});
	  	},
	  	getVideo () {
	  		let _this = this;
  		 	_this.$http.post('/api/product/online/list',
	  				this.qs.stringify({
							onlineType: 1, // 视频
							topTag: 1,
							freeStatus: '',
							showRankingStatus: '',
							productId: "",
							pageNum: 1,
							pageSize: 4,
							customerId: ''
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data,
	  							list = [];
	  					
	  					if(res.result.length > 0) {
	  						list = res.result.map(function(item, index){
	  							return {
										id: item.id,
										src: item.images,
										name: item.name,
										originalPrice: item.originalPrice,
										price: item.price,
										desc: item.subscribeStatus,
										type: 'video'
									}
								})

								_this.tuijianVideoDatas.list = list;
	  					}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  				_this.resetView();
	  			});
	  	},
	  	getNews () {
	  		let _this = this;
  		 	_this.$http.post('/api/news/list',
	  				this.qs.stringify({
							"topTag": 1,
							"pageNum": 1,
							"pageSize": 4,
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data,
	  							list = [];
	  					if(res.result && res.result.length > 0) {
	  						list = res.result.map(function(item, index){
	  							if(index == 0) {
			  						_this.indexNewsList.newsTop = {
			  							id: item.id,
			  							title: item.title,
			  							ind: index
			  						};
	  							}
	  							return {
										time: item.updateTime || item.createTime,
										desc: item.content,
										id: item.id,
										readCount: item.readCount,
										img: _this.resolveImg(item.images),
										title: item.title,
										ind: index
									}
	  						});
	  						_this.indexNewsList.list = list;
	  					}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  				_this.resetView();
	  			});
	  	},
	  	updateNews () {
				// // 定时更新显示的广告
	  	// 	let _this = this;
				// if(_this.indexNewsList.timeout) 
				// 	clearTimeout(_this.indexNewsList.timeout);
				// let newsTop = _this.indexNewsList.newsTop,
				// 	newsTopList = _this.indexNewsList.list,
				// 	ind = newsTop.ind;
				// if(ind == 3) {
				// 	_this.indexNewsList.newsTop = {
				// 		id: newsTopList[0].id,
				// 		title: newsTopList[0].title,
				// 		ind: 0
				// 	}
				// } else {
				// 	_this.indexNewsList.newsTop = {
				// 		id: newsTopList[ind+1].id,
				// 		title: newsTopList[ind+1].title,
				// 		ind: newsTopList[ind+1].ind
				// 	}	
				// }
				// _this.indexNewsList.timeout = setTimeout(_this.updateNews(), 10000);
	  	},
	  	getCourse () {
	  		let _this = this;

	  		_this.$http.post('/api/curriculum/curriculumList',
					_this.qs.stringify({
						type: "",
						pageNum: 1,
						pageSize: 4
					})).then(function(e) {
						if(e.data.code == 200) {
							let list = [];
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, ind){
									return {
										id: item.periodsId,
										img: item.authorImages,
										author: item.authorName,
										name: item.name,										
										endDate: item.endDate,
										date: item.startDate
									}
								});
							}
							_this.coursePreview.list = list;
						}	else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
	  				_this.resetView();
					});
	  	},
	  	getColumn () {
	  		let _this = this;
	  		_this.$http.post(
          "/api/product/term/list",
          _this.qs.stringify({
            pageNum: 1,
            pageSize: 4,
            topTag: 1
          })
        ).then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (e.data.data && e.data.data.result && e.data.data.result.length > 0) {
              list = e.data.data.result.map(function(item, ind) {
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
                };
              });
            }
            _this.specialColumn.list = list;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
  				_this.resetView();
        });
	  	},
	  	entry (url, type) {
	  		this.$router.push({ name: url, params: { type: type }})
	  	},
	  	videoAudioDetail (url, id) {
	  		this.$router.push({ name: url, params: { id: id }})
	  	},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();

          setTimeout(()=>{
	          this.$nextTick(() => {
	          	this.$refs.scrollerBottom.reset();
	          })
          }, 1000)
        })
			}
	  }
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/entry';
	@import '~assets/css/form';
	
	$playImgW: 60px;
	$playBtnW: 30px;

	.index {
		height: 100%;
		width: 100%;
		padding-top: $indexTopH;
		// padding-bottom: 30px;
	}

	.ad {
		margin: 0 auto;
	}

	.banner-img {
		width: 100%;
		height: 100%;
		background: no-repeat;
		background-size: cover;
		background-position: center;
	}

	.course-others {
		@extend %clearfix;
		padding: $padding;

		a {
			float: left;
			width: 50%;
			display: block;

			&:nth-child(odd) {
				padding-right: 5px;
			}

			&:nth-child(even) {
				padding-left: 5px;
			}
		}

		img {
			width: 100%;
		}
	}
	
	.tuijian-data {		    
		img {
			border-radius: $tuijianImgW
		}
	}

	.card-block {
		.card-block-header {
			position: relative;
			padding: 0 $padding;
			@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
			line-height: 50px;

			h5 {
				font-size: $fontSizeH4;
				color: $fontColorBlack;
			}

			.link {
				position: absolute;
				top: 0;
				right: $padding;

				span {
					margin-left: .5em;
				}
			}
		}

		.card-block-content {
			padding: 0 $padding;
		}
	}

	.quotation-index {
		padding: $padding 0;
		display: flex;

		.quotation-index-img {
			width: 102px;
			height: 80px;
			background-size: cover;
		}

		p {
			flex: 1;
			padding-left: 1em;
			line-height: 2;
			@include ellipsisMore(3);
		}
	}

	// 推荐banner
	.tuijian-banner {
		@include uiBorderTop();
 		padding: $padding;
    display: block;

 		img {
 			width: 100%;
 		}
	}

	// 培训头条新闻
	.peixun-news {
		padding: 0;

		.img-text {
			padding-left: 0;
			padding-right: 0;
		}
		
		.peixun-block {
			position: relative;
			@include ellipsisOne;
			line-height: 30px;
			text-indent: 20px;

			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 0;
		    height: 0;
		    border-top: 5px solid transparent;
		    border-left: 10px solid $fontColorGray;
		    border-bottom: 5px solid transparent;
		    margin-top: 10px;
			}
		}
	}

	.card-more-content {
		padding-top: 15px;
	}

	.card-more-content-slot {
		padding: $uiMarginH 0;
	}

	.card-more-padding {
		border-right: 5px solid transparent;
		
		&:nth-child(even) {
			border-left: 5px solid transparent;
			border-right: 0;	
		}
	}

	.join-in {
		width: 100%;
		line-height: 34px;
		padding: $uiMarginH $padding;
		font-size: $fontSizeH5;
		display: flex;

		label {
			@include ellipsisOne();
			flex: 1;
			display: block;
		}

		.join-btn {
			padding: 0 .8em;
			background-color: #b72d20;
			border-radius: 34px;
			color: #fff;
		}
	}

	.course-preview {
		width: 180%;
		margin-left: -$padding;
		padding: 0;
		padding: $padding 0;
	}

	.course-preview-block {
		float: left;
		width: 25%;
		padding: 0 $padding;
		line-height: 1.75;
		border-right: 1px solid $borderColor;
		text-align: center;

		&:last-child {
			border-right-width: 0;
		}

		.course-preview-header {
			position: relative;
			width: $tuijianImgW + 36px;
			margin: 0 auto;
			text-align: center;
			display: flex;

			img {
				width: $tuijianImgW;
				height: $tuijianImgW;
				margin: 0 auto;
				border-radius: $tuijianImgW;
			}

			span {
				width: 20px;
				line-height: 1.35;
				margin: 0 auto;
				margin-left: 1em;
				color: $fontColorGray;
				word-break: break-all;
				white-space: normal;
    		display: flex;
		    align-items: center;
			}
		}

		& > p {
			@include ellipsisOne();
			width: 90%;
			color: $fontColorBlack;
		}

		& > span {
			color: $fontColorGray;
		}
	}

	.index-news {
		@include uiBorderTop();
		height: 48px + $uiMarginH;
		padding: $uiMarginH $padding;
		line-height: 48px - $uiMarginH*2;
		display: flex;

		.index-news-title {
			width: 7em;
			font-size: $fontSizeH3;
			color: $fontColorBlack;
			font-weight: bolder;

			span {
				position: relative;
				width: 3em;
				height: 30px;
				margin-left: .3em;
				font-size: inherit;
				color: #fff;
				text-align: center;
				background: #b72d20;
				border-radius: $borderRadius;
				display: inline-block;

				&:before {
					content: "";
					position: absolute;
					top: 0;
					right: -20px;
					width: 20px;
					height: 100%;
					background: url(~assets/img/index/index-news.png) no-repeat;
					background-position: left;
					background-size: auto 100%;
				}
			}
		}

		.index-news-msg {
			flex: 1;
			height: 99%;
			margin-right: 1em;
			overflow: hidden;

			p {
				@include ellipsisMore(1);
				font-size: $fontSizeH5;
			}
		}
		
		.index-news-btn {
			position: relative;
			width: 3em;
			color: $fontColorGray;
			text-indent: .5em;
			@include halfpxline(0, $fontColorGray, 0, 0, 0, 2px);

			&:after {
				content: "";
				position: absolute;
				top: 50%;
				left: 0;
				height: $fontSizeH5 * 2;
				width: 1px;
				margin-top: - $fontSizeH5/2;
			}
		}
	}

	@keyframes changeNews {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-32px);
		}
	}
	
</style>