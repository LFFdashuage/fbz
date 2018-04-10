<!-- 
  同学列表
 -->
<template>
  <div class="class-mate">
    
      <div class="class-mate-search">
        <search
            @on-change="getResult"
            v-model="searchValue"
            position="relative"
            auto-scroll-to-top top="0px"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search"
            placeholder="请输入关键字！"
          >
        </search>
      </div>

      <!-- 同学列表 -->
      <div  class="class-mate-list">
        <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" v-cloak>
          <div>
            <el-img-text-class-mate v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index" :index-data="index" @deletebtn = "deletebtn"></el-img-text-class-mate>
            <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
          </div>
        </scroller>
      </div>                
  </div>
</template>

<script>
import { Search, Scroller } from "vux";
import elLoadMore from "components/load-more/load-more";
import elImgTextColumn from "components/img-text/img-text-column";
import elImgTextClassMate from "components/class/class-mate/img-text-class-mate";
export default {
  name: "classMate",
  components: {
    Search, Scroller,
    elLoadMore, elImgTextClassMate
  },
  data() {
    return {
      searchValue: "",
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 50,
        list: [
        {
          id: 3345,
          images: "",
          name: "刘备",
          position: "中国移动上海分公司CEO",
          remark: "共同学习，共同进步，共同发展！",
          follow:2
        },
        {
          id: 3876,
          images: "",
          name: "关羽",
          position: "联通上海分公司CEO",
          remark: "共同学习，共同进步，共同发展！",
          follow:1
        },
        {
          id: 3005,
          images: "",
          name: "刘备",
          position: "中国电信上海分公司CEO",
          remark: "共同学习，共同进步，共同发展！",
          follow:2
        },
        {
          id: 337765,
          images: "",
          name: "诸葛亮",
          position: "曼秀雷敦上海分公司CEO",
          remark: "共同学习，共同发展！",
          follow:1
        }
      ]
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取同学列表
    fetchData() {
      let _this = this;
      if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      _this.scrollerInfo.onFetching = true;

      _this.$http
        .post(
          "/api/xxx/xxx/xxx",
          _this.qs.stringify({
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize,
            search: this.searchValue //关键词
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let list = [];
            if (
              e.data.data &&
              e.data.data.result &&
              e.data.data.result.length > 0
            ) {
              list = e.data.data.result.map(function(item, ind) {
                return {
                  id: item.id,
                  img: item.images
                };
              });
            }
            // console.log(list)

            if (list.length < _this.scrollerInfo.pageSize) {
              _this.scrollerInfo.loadAll = true;
            }

            if (_this.scrollerInfo.pageNum == 1) {
              _this.scrollerInfo.list = list;
            } else {
              _this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
            }

            _this.scrollerInfo.pageNum++;
            _this.resetView();
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    resetView() {
      let _this = this;
      this.$nextTick(() => {
        this.scrollerInfo.onFetching = false;
        this.$refs.scrollerBottom.reset();
      });
    },

    loadMore() {
      if (this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {
        this.$refs.scrollerBottom.reset();
      } else {
        this.fetchData();
      }
    },

    //取消搜索
    onCancel() {},

    // 搜索提交
    onSubmit(val) {
      this.fetchData();
    },

    // 输入文字变化时触发
    getResult(val) {
      console.log(val);
    },

    //删除同学
    deletebtn(ind) {
      this.scrollerInfo.list.splice(ind, 1);
    },

    goPage(url) {
      // this.$router.push({ name: url, query: query })
      this.$router.push({ name: url });
    }
  }
};
</script>
<style lang="scss">
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
 
.class-mate-search {
   position:relative;
   top: 0;

  .weui-search-bar {
    background-color: #fff;
  }

  .weui-search-bar__label {
    background-color: #f1f1f1;
    border-radius: 15px;
  }

  .weui-search-bar__cancel-btn {
    color: #333;
  }

  .weui-search-bar__box {
    background-color: #f1f1f1;
    border-radius: 15px;
    border: 0;
  }

  .weui-search-bar__form:after {
    border: 0;
  }

  .weui-search-bar__form {
    background-color: #fff;
  }
}
</style>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
  
.class-mate-list {
  padding: 8px $padding;
}
</style>
