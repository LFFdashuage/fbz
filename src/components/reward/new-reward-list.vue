<!-- 
	打赏记录
 -->

<template>
	<div class="reward-list" v-cloak>
    <div class="table-content-title">
	    <span>打赏排行</span>
	  </div>

		<div class="reward-list-content">
			<template v-if="rewardData.list.length > 0">
				<div class="reward-block" v-for="(item, index) in rewardData.list" :key="index">

          <div class="serial-int">
            <img v-if="index+1==1" src="~assets/img/reward/Trophy.png" alt="">
            <img v-else-if="index+1==2" src="~assets/img/reward/Trophy2.png" alt="">
            <img v-else-if="index+1==3" src="~assets/img/reward/Trophy3.png" alt="">
            <img v-else src="~assets/img/reward/Hexagon.png" alt="">
            <span v-if="index+1==1||index+1==2||index+1==3" class="trophy-texte">{{index+1}}</span>
            <span v-else class="hexagon-texte">{{index+1}}</span>
          </div>

					<img :src="item.img" alt="">
					<div class="name"><label>{{ item.name }}</label></div>
          <p><span>¥{{ item.money.toFixed(2) }}</span></p>
				</div>

				<div @click="showMore" v-if="!rewardData.loadAll" class="show-more fa fa-angle-down">查看更多评论</div>
				<divider v-else>没有更多数据</divider>
			</template>
			
			<div v-else class="reward-block-none">快来打赏吧</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { LoadMore, Divider} from 'vux'
	export default {
		name: "newRewardList",
		components: {
			Divider
		},
		props: ["rewardInfo", "rewardRefreshStatus"],
		data () {
			return {
				rewardData: {
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: []
				},
			}
		},
		watch: {
			rewardRefreshStatus (newValue, oldValue) {
				if(newValue) {
					this.fetchData(1);
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData (pageNum) {
				let _this = this;
				
				this.$http.post('/api/product/spare/list',
					_this.qs.stringify({
						spareType: _this.rewardInfo.spareType,
						goodsId: _this.rewardInfo.goodsId,
						pageNum: pageNum || _this.rewardData.pageNum,
						pageSize: _this.rewardData.pageSize,
					})
					).then(function(e) {
						let list = [];
						if(e.data.code == 200) {
							if(e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index){
									return {
										img: item.headerUrl,
										name: item.customerName,
										money: item.payMoney,
										time: item.createTime
									}
								})

								if(_this.rewardData.pageNum == 1 || pageNum == 1) {
									_this.rewardData.list = list;
								} else {
									_this.rewardData.list = _this.rewardData.list.concat(list);
								}
							}

							if(pageNum) {
								_this.$emit('reward-done', true);
								_this.rewardData.pageNum = pageNum + 1;
							} else {
								_this.rewardData.pageNum++;
							}
							if(list.length < _this.rewardData.pageSize) {
								_this.rewardData.loadAll = true;
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.rewardData.onFetching = false;
					})
			},
			showMore () {
				let _this = this;
				if(_this.rewardData.onFetching || _this.rewardData.loadAll) {

				} else {
					_this.rewardData.onFetching = true;
					_this.fetchData();
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$rewardListH: 40px;
	$rewardListImgW: 28px;
	$rewardListImgH: 15px;
	$rewardListIconW: 30px;

	.reward-list {
    border-top: 5px solid $uiMarginBg;
    padding-top: $padding;
	}

	.reward-list-header {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: ($rewardListH - $rewardListImgH)/2 $padding;
		line-height: $rewardListImgH;
		font-size: $fontSizeH4;
		color: $fontColorBlack;
		text-align: left;
		text-indent: .5em;

		img {
    	float: left;
			width: $rewardListImgW;
			height: $rewardListImgH;
			display: block;
		}
	}

	.reward-list-content {

	}

	.reward-block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: $paddingTop $padding 0;
		display: flex;
		line-height: $rewardListIconW;
		font-size: $fontSizeTips;
		color: #999;

		&:last-child {
			padding-bottom: $paddingTop;
		}

		img {
			width: $rewardListIconW;
			height: $rewardListIconW;
      border-radius: $rewardListIconW/2;
      margin-left: 1em;
		}

		// div {
		// 	flex: 1;
    // }
    .name{
      flex: 1;
    }

		label, span {
			margin: 0 .2em;
		}
		
		label {
			float: left;
			@include ellipsisOne();
      max-width: 7em;
      text-indent:1em;
			color: #59748f;
			display: block;
		}

		span {
			color: $colorRedDeep;
		}

		p {
			width: 10em;
			text-align: right;
		}
	}

	.reward-block-none {
		padding: $paddingTop $padding $paddingTop+ 40px;
		text-align: center;
	}

	.show-more {
		width: 100%;
		text-align: center;
		padding: $paddingTop $padding $paddingTop+ 40px;
	}
  .table-content-title {
  padding: $padding/2 $padding 0;
  line-height: 1;
  font-size: $fontSizeH4;
  color: $fontColorBlack;

  span {
    @include halfpxline(0, $colorYellowEasy, 0, 0, 0, 6px);
    text-indent: 0.5em;
    display: block;
  }
}
.serial-int{
  display:inline-block;
  position: relative;
  img{
    margin: 0;
    display:inline-block;
  }
  .trophy-texte{
    position: absolute;
    left: 10px;
    top: -2px;
    color: $fontColorBlack;
  }
  .hexagon-texte{
    position: absolute;
    left: 10px;
    top: 2px;
    color: $fontColorBlack;
  }
}
</style>