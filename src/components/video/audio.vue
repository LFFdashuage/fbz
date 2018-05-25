
<!-- 
	音频播放
 -->

<template>
	<div class="audio" v-cloak>
    <h5>{{ baseData.name }}</h5>
    <div :class="['audio-image', { 'active': audioStatus }]">
      <div ref="img" class="audio-img" :style="{ backgroundImage: 'url(' + baseData.fileThumb + ')' }"></div>
    </div>

    <p>{{ baseData.childName }}</p>
    <span>讲师：{{ baseData.lecturer }}</span>

    <div class="audio-display">
      <div class="progress" @click="setCurrentTime" ref="audioProgress">
        <span class="progress-now" :style="{width: audioProgress + 'px'}"></span>
      </div>
      
      <div class="time">
        <span class="time-start">{{ currentTime | numToTime }}</span>
        <span class="time-end">{{ duration | numToTime }}</span>
      </div>

      <div class="audio-btns">
        <div @click="audioBtnLoop" class="audio-btn-loop"></div>
        <div @click="audioBtnChange('prev')" class="audio-btn-prev"></div>
        <div @click="playAudio" :class="['audio-btn-start', { 'stop': audioStatus }]"></div>
        <div @click="audioBtnChange('next')" class="audio-btn-next"></div>
      </div>

      <audio :title="baseData.name" ref="audio" preload="auto">
        <source :src="baseData.fileUrl" type="audio/mpeg" />
        <source :src="baseData.fileUrl" type="audio/mp4" />
      </audio>
    </div>
	</div>
</template>

<script type="text/babel">
  import imgPoster from "assets/img/audio.png";

  export default {
    name: "elAudio",
    components: {
      // VideoPlayer
    },
    props: ["audioData", "courseInfo"],
    data() {
      return {
        baseData: {},
        time: 60,
        audioStatus: false,
        player: "",
        status: true,
        currentTime: 0,
        audioProgress: 0,
        audioLoading: false,
        audioLength: 0,
        duration: 0,
        loop: false
      }
    },
    watch: {
      audioData (newValue, oldValue) {
        this.baseData = newValue;
      }
    },
    mounted() {
      this.baseData = this.audioData;
      this.initAudio();
    },
    methods: {
      initAudio () {
        let _this = this,
            $audio = this.$refs.audio;
        
        if(isNaN($audio.duration)){
          setTimeout(function() {
            _this.initAudio();
          }, 100);
        } else {
          $audio.play();
          _this.duration = $audio.duration;
          $audio.pause();
          $audio.play();
          // $audio.pause();
        }
      },
      playAudio () {
        let _this = this,
            $refs = _this.$refs,
            $audio = $refs.audio,
            $audioProgress = $refs.audioProgress,
            audioLength = $audioProgress.getBoundingClientRect().width;

        this.audioStatusChange(!this.audioStatus);

        if (this.audioStatus) {
          $audio.play();
          _this.audioLoading = true;
          setInterval(function(argument) {
            let currentTime = $audio.currentTime;
            let duration = $audio.duration;
            if($audio.currentTime > 0) {
              _this.audioLoading = false;
              _this.currentTime = currentTime;
              _this.audioLength = audioLength;
              _this.duration = duration;

              _this.audioProgress = currentTime/duration * audioLength;
            }
          }, 10);

          if (_this.audioData.hasBuy != 1) {
            _this.getCurrentTime();
          }
        } else {
          $audio.pause()
        }

        if(this.currentTime < 3) {
          this.addPlayCount(this.baseData.id);
        }
      },
      audioStatusChange (data) {
        let container = document.querySelector('.audio-image'),
            image = document.querySelector('.audio-img'),
            cTransform = getComputedStyle(container).transform,
            iTransform = getComputedStyle(image).transform;
        if(!data) {
          container.style.transform = cTransform === 'none'
           ? iTransform
           : iTransform.concat(' ', cTransform);
          this.audioStatus = false;
        } else { 
          this.audioStatus = true;
        }
      },
      audioBtnLoop () {
        this.loop = !this.loop;
      },
      audioBtnChange (data) {
        this.$emit('audio-btn-change', data);
      },
      getCurrentTime() {
        let _this = this,
            $audio = _this.$refs.audio;
        if ($audio.currentTime >= _this.time) {
          $audio.pause();
          _this.$refs.audio.src = "";
          _this.status = false;
          _this.$refs.audio.src = _this.baseData.fileUrl;

          _this.currentTime = 0;
          _this.audioProgress = 0;
          _this.audioStatusChange(false);
          _this.$vux.confirm.show({
            title: '提示',
            content: '该音频是付费音频，购买后可收听完整内容，确定去购买。',
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              _this.$emit('on-audio-buy');
            }
          });
        } else {
          setTimeout(function() {
            _this.getCurrentTime();
          }, 1000);
        }
      },
      setCurrentTime (e) {
        // let _this = this,
        //     offsetX = e.offsetX,
        //     audioLength = _this.$refs.audioProgress.getBoundingClientRect().width,
        //     $audio = _this.$refs.audio,
        //     duration = $audio.duration,
        //     currentTime = $audio.currentTime;
      },
      loadNext (data) {
        let _this = this;
        _this.currentTime = 0;
        _this.audioProgress = 0;
        _this.audioStatusChange(false);
        _this.$refs.audio.pause();
        _this.baseData = data;
        _this.$nextTick(function(){
          _this.$refs.audio.src = data.fileUrl;
          _this.playAudio();
        });
        // _this.playAudio();
        // {
        //   isBuy: , 
        //   name: ,
        //   childName: ,
        //   fileUrl: ,
        //   fileThumb: ,
        //   lecturer: 
        // }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~lib/sandal/core";
  @import "~assets/css/core/functions", "~assets/css/core/mixins", "~assets/css/core/vars";

  .audio {
    line-height: 2;
    text-align: center;
    @include halfpxline(0, $bgGray, 0, 0, 2px, 0);
    padding-bottom: $padding;
  }

  h5 {
    font-size: $fontSizeH4;
    color: $fontColorBlack;
  }

  p {
    height: 2em;
  }
  
  .audio-image {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 10px auto;
    border-radius: 60px;
  
    &:before {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid $borderColor;
      border-radius: 60px;
      z-index: 10;
    }

    &.active {
      .audio-img {
        animation: rotateImg 5s linear infinite;
      }
    }

    .audio-img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  p {
    font-size: $fontSize;
    color: $fontColorBlack;
  }

  span {
    font-size: $fontSizeTips;
  }
  
  $audioProgressColor: $borderColor;
  $audioProgressRateColor: $colorYellowEasy;
  $audioProgressH: 2px;
  $audioProgressRateCircleH: 8px;
  $audioTimeColor: $fontColorBlack;
  $audioTimeFontSize: $fontSize;
  $audioTimePadding: $padding;
  $audioBtnLoopLeft: $padding*2;
  $audioBtnH: 40px;


  .audio-display {
    padding-top: 10px;

    .progress {
      position: relative;
      width: 100%;
      height: $audioProgressH;
      background-color: $audioProgressColor;
    }

    .progress-now {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: $audioProgressH;
      background-color: $audioProgressRateColor;

      &:before {
        content: "";
        position: absolute;
        right: - $audioProgressRateCircleH/2;
        top: - ($audioProgressRateCircleH - $audioProgressH)/2;
        width: $audioProgressRateCircleH;
        height: $audioProgressRateCircleH;
        border-radius: $audioProgressRateCircleH;
        background-color: $audioProgressRateColor;
      } 
    }

    .time {
      @extend %clearfix;
      width: 100%;
      padding: 0 $audioTimePadding;
      color: $audioTimeColor;
      font-size: $audioTimeFontSize;

      .time-start {
        float: left;
      }

      .time-end {
        float: right;
      }
    }

    .audio-btns {
      position: relative;
      padding: 0;

      .audio-btn-loop {
        position: absolute;
        top: 50%;
        left: $audioBtnLoopLeft;
        width: 21px;
        height: 19px;
        margin-top: -10px;
        background: url(~assets/img/audio/loop.png) no-repeat;
        background-size: 100%;
        display: none;
      }

      .audio-btn-start {
        width: 36px;
        height: 36px;
        margin: 0 auto;
        background: $colorYellowEasy url(~assets/img/audio/stop.png) no-repeat;
        // background: $colorYellowEasy;
        background-size: 60%;
        background-position: center;
        border-radius: 100px;

        &.stop {
          background-image: url(~assets/img/audio/pause.png);
          background-color: #fff;
          background-size: 100%;
        }
      }

      .audio-btn-prev, .audio-btn-next {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 15px;
        margin-top: -8px;
        margin-left: - (16px + 40px);
        background: url(~assets/img/audio/prev.png) no-repeat;
        background-size: 100%;
      }

      .audio-btn-next {
        margin-left: 16px + 20px;
        margin-top: -9px;
        transform: rotate(180deg);
      }
    }

  }

  #audio {
    position: absolute;
    z-index: -999;
    opacity: 0;
  }
  

  @keyframes rotateImg {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg)
    }
  }


  @-moz-keyframes rotateImg {
    from {
      transform: rotate(0);
      -webkit-transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes rotateImg {
    from {
      transform: rotate(0);
      -webkit-transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  @-o-keyframes rotateImg {
    from {
      transform: rotate(0);
      -webkit-transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
</style>