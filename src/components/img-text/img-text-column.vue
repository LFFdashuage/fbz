<!-- 
	专栏模块
 -->
<template>
	<div class="img-text img-text-column" @click="goPage({name: 'specialColumnDetail', query: {id: imgTextData.id}})" v-cloak>
		<div class="img-text-img">
			<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
		</div>
		<div class="text">
			<h5 class="title">{{ imgTextData.title }}</h5>
			<p>更新{{ imgTextData.upToDate }}期 | 共{{ imgTextData.totalTerm }}期</p>
			<div class="text-info">
				<p class="text-info-term">
					<i>￥</i>
					<span class="price">{{ imgTextData.price | numToCash }}</span>
					<span>/{{ imgTextData.totalTerm }}期</span>
				</p>
				<span v-if="imgTextData.readCount > 0">{{ imgTextData.readCount }}人浏览</span>
				<!-- <span v-if="imgTextData.readCount > 0">{{ imgTextData.readCount }}人订阅</span> -->
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: 'elImgTextColumn',
		props: ['imgTextData'],
		data () {
			return {
				list: {
					// img: '',
					// price: '',
					// time: '',
					// readCount: '', // 浏览次数
					// buyCount: '', // 购买数量
					// id: '', // id
					// desc: '以帮助学员实现梦想，突破发展瓶颈为己任，直指核心？',
					// code: '',
					// title: "总裁商业思维"
				}
			}
		},
		methods: {
			imgTextClick () {
				let _this = this;
					this.$router.push({name: 'columnDetail', query: { id: this.imgTextData.id }}) 
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text';
	
	.img-text-column {
		.title {
			@include ellipsisMore(1); 
		}

		.text {
			position: relative;
			line-height: 2;

			h5 {
				line-height: 2;
				font-size: $fontSizeH4;
				color: $fontColorBlack;
			}

			& > p {
				color: $colorYellowEasy;
				margin-top: 18px;
			}
		}

		.text-info {
			position: absolute;
			bottom: 0;
			width: 100%;
			line-height: $fontSizeH4;

			span {
				float: right;
				// padding-top: 10px;
				// padding-right: $padding;
				color: $fontColorGray;
			}

			.price, i {
				float: left;
				font-style: normal;
				color: $colorRedDeep;
			}

			.price {
				margin: 0 .4em 0 .2em;
				font-size: $fontSizeH4;
			}

			.text-info-term {
				float: left;
			}
		}
	}
	
</style>