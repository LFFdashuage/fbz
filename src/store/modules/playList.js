// 音频播放列表
import * as types from '../mutation-types'

export default {
  state: {
    audioList: [],
    videoList: [],
    columnAudioList: [],
    columnVideoList: []
    // {
    //   id: '',
    //   name: '',
    //   src: ''  
    // }
  },
  mutations: {
    updateAudioList (state, payload) {
      state.audioList = payload.audioList
    },
    updateAudioList (state, payload) {
      state.videoList = payload.videoList
    },
    updateColumnAudioList (state, payload) {
      state.columnAudioList = payload.columnAudioList
    },
    updateColumnVideoList (state, payload) {
      state.columnVideoList = payload.columnVideobList
    }
  }
}
