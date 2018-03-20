<!-- 
	讲师详情
 -->

<template>
	<div class="author" v-cloak>
		<div class="author-detail" v-show="detail.img">
			<h3>讲师</h3>
			<div class="author-img">
				<img :src="detail.img" alt="头像">
				<div>
					<span>{{ detail.name }}</span>
					<label>{{ detail.label }}</label>
				</div>
			</div>
			<div class="rich-html" v-html="detail.content"></div>
		</div>

		<div class="author-company">
			<h3>机构</h3>
			<!-- 上传图片规格：300*140 -->
			<img class="company-img" :src="detail.companyImg" alt="">
			<div class="rich-html" v-html="detail.companyContent"></div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "elAuthor",
		props: ['authorData'],
		data () {
			return {
				detail: {
					img: "",
					name: "",
					label: "",
					quotation: "",
					companyName: "",
					companyContent: "",
					companyLogo: ""
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				_this.$http.post("/api/curriculum/authorsInfo",
						_this.qs.stringify({
							authorId: _this.authorData.authorId || "1",
							companyId: _this.authorData.companyId
						})
					).then(function(e) {
						let resData = e.data.data,
								list = [];
						if(e.data.code == 200) {
							if(resData.length > 0) {
								list = resData.map(function(item, index) {
									return {
										img: item.authorImg,
										name: item.authorName,
										label: item.authorRemark,
										content: item.authorContent,
										companyName: item.companyName,
										companyContent: item.companyContent,
										companyImg: item.companyImg
									}
								})
							}
							_this.detail = list[0];
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.author {
		padding: $padding $padding $padding*2;
	}

	.author-detail {
		@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		padding-bottom: $padding;
	}

	h3 {
		margin-bottom: $padding;
		font-size: $fontSizeH2;
		color: $fontColorBlack;
	}

	.author-img {
		@extend %clearfix;
		margin-bottom: $padding;
    display: flex;

		img {
			float: left;
			width: $headerH;
			height: $headerH;
			border-radius: $headerH;
		}

		div {
			flex: 1;
			float: left;
			padding-top: 10px;
			padding-left: 1em;
			line-height: 1.75;
		}

		span {
			color: $fontColorBlack;
			display: block;
		}
	}

	.rich-html {
		@include articleText();
	}

	.author-company {
		padding-top: $padding;
	}

	.company-img {
		height: 70px;
	}
</style>