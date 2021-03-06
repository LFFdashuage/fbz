// 字典
import Vue from 'vue'
import nav from './nav.js';
import courseFilter from './course-filter.js';
import visitRouter from './visit-router.js';

Vue.prototype.wordBook = {
	nav: nav,
	courseFilter: courseFilter,
	visitRouter: visitRouter,
	pageSize: 20, // 分页条数
	tabChangeW: 160, // tab+swiper切换滚动多少距离切换，
	bannerWidthHeight: 320/751, // banner图片宽高比
	raterConfig: {
		activeColor: '#a18a5e',
		fontSize: 12,
		margin: 0,
		max: 5
	},
	urlLink: {
		// img: 'http://fbz.10-suns.com/',  // 图片域名地址拼接
		// richText: 'http://fbz.10-suns.com/', // 富文本内图片域名地址拼接
		// file: 'http://fbz.10-suns.com/', // 文件域名地址拼接
		// share: 'http://fbz.10-suns.com/' // 分享域名地址拼接

		signUrl: 'http://fbz3.10-suns.com/#', // 签名url
		
		// signUrl: 'http://zls.10-suns.com/#', // 签名url
		img: 'http://fubanzhang.10-suns.com:8081/',  // 图片域名地址拼接
		richText: 'http://fubanzhang.10-suns.com:8081/', // 富文本内图片域名地址拼接
		file: 'http://fubanzhang.10-suns.com:8081/', // 文件域名地址拼接
		share: 'http://fubanzhang.10-suns.com:8081/' // 分享域名地址拼接

	}
	// orderType: {}
}