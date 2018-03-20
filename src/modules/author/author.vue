<!-- 
	微信授权
 -->

<template>
	<div class="author" v-cloak>
		
	</div>
</template>

<script type="text/babel">
	import hold from 'src/commons/hold'
	
	export default {
		name: 'author',
		data () {
			return {

			}
		},
		mounted () {
			let _this = this,
					urlJson = _this.parseToJson(location.href),
					openId = "";

			if(urlJson) {
				openId = urlJson.openId;
				hold.storage.set("openId", openId);
				// hold.storage.set("userId", userId);
				_this.$store.commit("updateUserOpenId", { openId: openId });
				// _this.$store.commit("updateUserUserId", { userId: userId });
			}

			// alert(this.$route);

			if(!openId) {
				_this.$http.post('/api/wechat/getAuthorize',
  				_this.qs.stringify({
						data: _this.$route.query.uuid || openId
					})
  			).then(function(e) {
  				if(e.data.data)
  					window.location.href = e.data.data.authorUrl;
  			})
	    } else {
	    	let beforeLoginUrl = JSON.parse(hold.localStorage.get('beforeLoginUrl'));
	    	if(beforeLoginUrl) {
	    		_this.getUserInfo(openId, {name: beforeLoginUrl.name, query: beforeLoginUrl.query, params: beforeLoginUrl.params});
	    	} else {
		    	_this.getUserInfo(openId, {name: 'index', uuid: urlJson.uuid});
	    	}
	    }
		},
		methods: {
			parseToJson (url) {
				if(url != "" && url.indexOf("?") != -1){
					let	url_json = {};
					url = url.replace("#/author", "");
					url = url.split("?");
					url = url[1].split('&');
					for (let i = 0; i<url.length ; i++) {
				    let str = url[i].split('=');
				    url_json[str[0]]=str[1];
					}
					return url_json;
				} else {
					return "";
				}
			}
		}
	}
</script>