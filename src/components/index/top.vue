<!-- 
	首页头部搜索
 -->

<template>
	<div class="top">
		<div class="top-container">			
			<div class="top-msg" @click="goPage({'name': 'msg'})">
				<span v-if="msgNum > 0">{{ msgNum | numMaxToChange }}</span>
			</div>

			<!-- <div class="top-search" ></div> -->
			<div class="top-search" @click="goPage({'name': 'courseNav'})">
				<search
			    position="absolute"
			    @on-focus="onFocus"
			    ref="search"></search>
			</div>

			<div class="top-add" @click="goPage({'name': 'share'})"></div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Search } from "vux"

	export default {
		name: "elTop",
		components: {
			Search
		},
		data () {
			return {
				msgNum: 0
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				this.$http.post('/api/tidings/unreadMessageCount',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						_this.msgNum = e.data.data.allMessage || 0;
				})
			},
			onFocus () {

			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.top .top-search {
		.weui-search-bar {
			padding: 0;
			border-radius: 15px;
			border:0;

			&:before, &:after {
				display: none;
			}
		}

		.weui-search-bar__form {
			border-radius: $borderRadius;
		}
		.weui-search-bar__form:after{
			border:0;
		}
		.weui-search-bar__label {
			text-align: left;
			padding-left:$padding;
			background-color: #f1f1f1;
			border-radius: 15px;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$topH: $indexTopH; // 40px
	$topMsgW: 26px;
	$topAddW: 26px;

	.top {
		height: $topH;
	}

	.top-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: $topH;
		padding: ($topH - $topMsgW)/2 $padding;
		background-color: #fff;
		display: flex;
		z-index: 9;
    /* 使之可以滚动 */
    overflow-y: scroll;
    /* 增加该属性，可以增加弹性 */
    -webkit-overflow-scrolling: touch;
	}

	.top-msg {
		position: relative;
		width: $topMsgW;
		height: 100%;
		// margin-left: -10px;
		background: url(~assets/img/index/top-msg.png) no-repeat;
		background-size: 90%;
		background-position: bottom;

		& > span {
			position: absolute;
			top: -3px;
			left: 50%;
			// width: 2em;
			padding: 0 .4em;
			line-height: 1.5em;
			text-align: center;
			font-size: $fontSizeTips;
			background-color: $colorRedDeep;
			// background-color: #c7000b;
			color: #fff;
			border-radius: 2em;
		}
	}

	.top-search {
		position: relative;
		flex: 1;
		height: 100%;
		margin: 0 20px;
		// background: $bgGray url(~assets/img/index/top-search.png) no-repeat;
		// background-size: 100%;
		// background-position: center;
		// border-radius: $borderRadius;
		// opacity: 0;
	}

	.top-add {
		width: $topAddW;
		height: 100%;
		background: url(~assets/img/index/top-add.png) no-repeat;
		background-size: 90%;
		background-position: center right;
	}

</style>