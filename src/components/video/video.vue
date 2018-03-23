<!-- 
	视频播放
 -->

<template>
	<div class="video" v-cloak>
    <div v-if="status">    
      <div @click="videoClick" v-show="status" :class="['prism-player', {'hidden': !status}]" id="J_prismPlayer"></div>
    </div>
    <p v-show="false">{{ videoData }}</p>
    <div class="course-info" v-if="!status">
      <p>该视频是付费视频，订阅可观看全部视频</p>
    </div>
	</div>
</template>

<script type="text/babel">
  export default {
    name: "elVideo",
    components: {
      // VideoPlayer
    },
    props: ["videoData", "hasBuy"],
    data() {
      return {
        time: 60,
        player: "",
        status: true,
        playStatus: false // 是否增加点击数
      };
    },
    mounted() {
      this.$nextTick(function() {
        this.init();
        this.$on("initMethods");
      });
    },
    methods: {
      initMethods() {
        let _this = this;
        _this.player.play();
      },
      init() {
        let _this = this;
        // console.log(_this.videoData);
        this.player = new prismplayer({
          id: "J_prismPlayer",
          width: document.body.clientWidth,
          height: "260px",
          autoplay: true,
          preload: true,
          x5_type: 'h5',
          useH5Prism: true,
          playsinline: true,
          //支持播放地址播放,此播放优先级最高
          source: _this.videoData.fileUrl,
          // source : '播放url',
          //播放方式二：推荐
          // vid : "3165805f6ba34ba8a451b9ba592aba39" || _this.videoData.fileUrl,
          // playauth : '',
          cover: _this.videoData.fileThumb
        });
        document.querySelector(".video video").title = _this.videoData;

        // 自动播放无效
        // console.log(this.$wechat)
        // this.$wechat.ready(function() {
        //   // alert(1)
        //     _this.player.play();
        //   // _this.loadNext(_this.videoData.fileUrl);
        // })

        if (_this.hasBuy != 1) {
          _this.getCurrentTime();
        }
      },
      getCurrentTime() {
        let _this = this;
        if (_this.player.getCurrentTime() >= _this.time) {
          _this.player.pause();
          _this.status = false;
          setTimeout(function() {
            _this.getCurrentTime();
          }, 1000);
        } else {
          setTimeout(function() {
            _this.getCurrentTime();
          }, 1000);
        }
      },
      videoClick () {
        let _this = this;
        if(!this.playStatus && _this.player.getCurrentTime() < 3) {
          this.playStatus = true;
          this.addPlayCount(this.vidioData.id);
        } else {
          setTimeout(function() {
            _this.videoClick();
          }, 1000);
        }
      },
      loadNext(data) {
        if(this.status) {
          this.player.loadByUrl(data.src);
          this.player.play();
          this.addPlayCount(data.id);
        } else {        
          this.status = true;

          this.$nextTick(function(){
            this.init();
            this.player.loadByUrl(data.url);
            this.player.play();
            this.addPlayCount(data.id);
          })
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions",
    "~assets/css/core/mixins",
    "~assets/css/core/vars";

  .video {
    position: relative;
    height: 260px;
    width: 100%;
  }

  .course-info {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    margin: 0 auto;
    z-index: 100;
    background: #000;

    p {
      margin: 0 auto;
    }
  }
</style>