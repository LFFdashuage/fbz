<!-- 
	筛选资料
 -->

<template>
  <div class="filter-file-box" >
    <div class=" clearfix" v-for="(item, index) in filterData" :key="index">
  
      <div v-show="item.status" class="filter-file-img-text">
        <div  @click="setSelectedId(item)" :class="['filter-filter', {'active': selectedId == item.id }]" v-for="(item, index) in filterData" :key="index" >
          <!-- <img src="~assets/img/download/download1.png" alt=""> -->
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

.filter-file-box {
  width: 100%;
  height: 70px;
  // background-color: #888;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;

  .clearfix {
    display: flex;
    .filter-file-img-text {
      display: flex;
    }
  }
}
.filter-filter {
  padding: $filterPadding * 2 0;
  flex-wrap: nowrap;
  width: 100px;
  height: 70px;
  display: inline-block;
  // @include halfpxline(0, #000, 0, 0, 1px, 0);
  background: #fff url("~assets/img/icon/download-bg.png") no-repeat;
  background-size: 100%;
  background-position: 50% 40%;
  color: $fontColor;
  margin: 0 $padding;
  text-align: center;
  line-height: 1;
  &.active {
    color: #fff;
    background: #fff url("~assets/img/icon/download-active-bg.png") no-repeat;
    background-size: 100%;
    background-position: 50% 47%;
  }
}

// img {
//   height: 40px;
//   margin: 0 auto;
//   margin-bottom: 6px;
// }
</style>