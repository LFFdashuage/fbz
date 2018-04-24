<!-- 
	筛选资料
 -->

<template>
  <div class="filter-file-box" >
    <div class=" clearfix" v-for="(item, index) in filterData" :key="index">
  
      <div v-show="item.status" class="filter-file-img-text">
        <div  @click="setSelectedId(item)" :class="['filter-file-block-cell', {'active': selectedId == item.id }]" class="filter-filter" v-for="(item, index) in filterData" :key="index" >
          <img src="~assets/img/download/download1.png" alt="">
          <span>{{ item.name }}</span>
        </div>
      </div>

		</div>
  </div>
</template>

<script type="text/babel">
import { TransferDom, Group, Cell, CellBox, Search, Popup, XSwitch } from "vux";

export default {
  name: "filterFile",
  directives: {
    TransferDom
  },
  components: { Group, Cell, CellBox, Search, Popup, XSwitch },
  props: ["filterData"],
  data() {
    return {
      saixuan: false,
      selectedId: "",
      list: []
    };
  },
  watch: {
    selectedId(newValue, oldValue) {
      this.$emit("on-selected-change", newValue);
    }
  },
  methods: {
    showAll(obj) {
      obj.show = !obj.show;
    },
    setSelectedId(data) {
      this.selectedId = data.id;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

$filterW: 6em;
$filterPadding: 1em;

.filter-file-block-title {
  @include halfpxline(0, #fff, 0 , 0, 1px, 0);
  width: 100%;
  padding: $filterPadding 0;
  text-indent: 0.5em;
  display: none;

  &:before {
    padding-right: 0.5em;
  }
}

.filter-file-block-cell {
  width: 50px;
  height: 50px;
  padding: $filterPadding 0;
  @include halfpxline(0, #fff, 0 , 0, 1px, 0);
  // text-indent: 1.6em;
  text-align: center;
  // background: #f8f8f8;
  background: #fff;
  line-height: 1;

  &.active {
    // background: #fff;
     background: #f8f8f8;
    color: $colorYellowEasy;

    // &:before {
    //   content: "";
    //   position: absolute;
    //   bottom: -7px;
    //   left: 3.3em;
    //   width: 3px;
    //   height: 2em;
    //   margin-top: -0.5em;
    //   transform: rotate(90deg);
    //   background: #9fcfe3;
    // }
  }
}

.filter-file-box {
  width: 100%;
  height: 80px;
  // background-color: #888;
  -webkit-overflow-scrolling: touch;
}
.filter-file-img-text {
  display: flex;
}
.filter-filter {
  // flex-direction:column;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 80px;
  height: 80px;
  // padding: 20px;
  display: inline-block;
}

.clearfix {
  display: flex;
}
img {
  height: 40px;
  margin: 0 auto;
  margin-bottom: 6px;
}
</style>