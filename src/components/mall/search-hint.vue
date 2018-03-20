<!-- 
搜索提示
 -->

<template> 
  <div class="search-hint" v-if="searchHintData.list.length > 0">
    <div class="search-hint-title">{{searchHintData.title}}</div>

    <div class="search-hint-content">
      <div class="content-block" v-for="(item, index) in searchHintData.list" :key="index" @click="HotCheck(item.searchContent)" v-cloak>
        {{ item.searchContent }}
      </div> 
    </div>
    
  </div>
</template>

<script type="text/babel">
export default {
  name: "searchHint",
  props: ["searchHintData"],
  data() {
    return {
      hintData: {
        searchContent: ""
      }
    };
  },
  methods: {
    // this.$store.commit('updateLoadingStatus', {isLoading: true});
    // this.$router.push({name: 'mallDetail', query: { id: data }})
    HotCheck(event) {
      var somedata = event;
      console.log(somedata);
      this.$emit("hint", somedata);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.search-hint {
  padding: $padding;

  .search-hint-content {
    @extend %clearfix;
  }
}

.content-block {
  margin: 5px;
  padding: 0 1em;
  line-height: 1.75;
  border: 1px solid $borderColor;
  background-color: $colorGray;
  text-align: center;
  border-radius: $borderRadius;
  display: inline-block;
} 
</style>