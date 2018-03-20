<!-- 
	筛选资料
 -->

<template>
	<div class="filter-file">
		<div class="filter-file-block" v-for="(item, index) in filterData" :key="index">
			<div :class="['filter-file-block-title', 'fa', item.status ? 'fa-angle-up' : 'fa-angle-down']" @click="item.status = !item.status;">{{ item.name }}</div>
			<div class="filter-file-block-content" v-show="item.status">
				<div @click="setSelectedId(it)" :class="['filter-file-block-cell', {'active': selectedId == it.id }]" v-for="(it, ind) in item.list" :key="ind">	<span>{{ it.name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Group, Cell, CellBox, Search, Popup, XSwitch } from 'vux'

	export default {
		name: "filterFile",
		directives: {
	    TransferDom
	  },
		components: { Group, Cell, CellBox, Search, Popup, XSwitch },
		props: ['filterData'],
		data () {
			return {
				saixuan: false,
				selectedId: '',
				list: [
					// {
					// 	name: "政策法规",
					// 	id: "zhengche",
					// 	status: false,
					// 	list: [
					// 		{
					// 			name: "金融资本",
					// 			id: "jinrong"
					// 		},{
					// 			name: "股权融资",
					// 			id: "jinrong"
					// 		},{
					// 			name: "经典管理",
					// 			id: "jinrong"
					// 		},{
					// 			name: "行业资料",
					// 			id: "jinrong"
					// 		},{
					// 			name: "其他资金",
					// 			id: "jinrong"
					// 		},{
					// 			name: "教育",
					// 			id: "jinrong"
					// 		},{
					// 			name: "股权类",
					// 			id: "jinrong"
					// 		},{
					// 			name: "期权类",
					// 			id: "jinrong"
					// 		},
					// 	]
					// },{
					// 	name: "合同条款",
					// 	id: "zhengche",
					// 	status: false,
					// 	list: [
					// 		{
					// 			name: "金融资本",
					// 			id: "jinrong"
					// 		},{
					// 			name: "股权融资",
					// 			id: "jinrong"
					// 		},{
					// 			name: "经典管理",
					// 			id: "jinrong"
					// 		},{
					// 			name: "行业资料",
					// 			id: "jinrong"
					// 		},{
					// 			name: "其他资金",
					// 			id: "jinrong"
					// 		},{
					// 			name: "教育",
					// 			id: "jinrong"
					// 		},{
					// 			name: "股权类",
					// 			id: "jinrong"
					// 		},{
					// 			name: "期权类",
					// 			id: "jinrong"
					// 		},
					// 	]
					// }
				]
			}
		},
		watch: {
			selectedId (newValue, oldValue) {
				this.$emit('on-selected-change', newValue)
			}
		},
		methods: {
			showAll (obj) {
				obj.show = !obj.show;
			},
			setSelectedId(data) {
				this.selectedId = data.id;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$filterW: 6em;
	$filterPadding: 1.2em;

	.filter-file {
		width: $filterW;
		text-align: left;
		-webkit-overflow-scrolling: touch;
		// color: #fff;
	}

	.filter-file-block {
		
	}

	.filter-file-block-title {
		@include halfpxline(0, #fff, 0 , 0, 1px, 0);
		width: 100%;
		padding: $filterPadding 0;
		text-indent: .5em;
		display: none;

		&:before {
			padding-right: .5em;
		}
	}

	.filter-file-block-cell {
		padding: $filterPadding 0;
		@include halfpxline(0, #fff, 0 , 0, 1px, 0);
		// text-indent: 1.6em;
		text-align: center;
		background: #f8f8f8;
		line-height: 1;

		&.active {
			background: #fff;
			color: $colorYellowEasy;

			&:before {
				content: "";
				position: absolute;
				top: 50%;
				left: .4em;
				width: 2px;
				height: 1em;
				margin-top: -.5em;
				background: $colorYellowEasy;
			}
		}
	
		// span {
		// 	@include halfpxline(0, red, 0 , 0, 0, 2px);
		// 	position: relative;
		// 	display: block;

		// 	&:after {

		// 	}
		// }
	}
</style>