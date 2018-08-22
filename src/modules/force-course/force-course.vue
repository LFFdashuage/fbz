<!-- 
	必修课程
 -->

<template>
	<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offset="200" v-cloak>
    <div>
       <el-img-text-course v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"  :type-data="1"></el-img-text-course>
       <el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
    </div>
	</scroller>
</template>

<script type="text/babel">
import { Scroller, Timeline, TimelineItem } from "vux";
import elLoadMore from "components/load-more/load-more";
// import elImgText from 'components/img-text/img-text-course'
import elImgTextCourse from "components/course/img-text-course";

export default {
  name: "forceCourse",
  components: {
    Scroller,
    Timeline,
    TimelineItem,
    elLoadMore,
    elImgTextCourse,
  },
  data() {
    return {
      scrollerInfo: {
        onFetching: false,
        loadAll: false,
        pageNum: 1,
        pageSize: this.wordBook.pageSize,
        offsetBottom: 2,
        list: []
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      if (_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;
      _this.scrollerInfo.onFetching = true;

      if(_this.$route.query.type == "course"){
        var query = {
            cityId: "", //开课城市
            companyId: "", //机构id
            authorId: _this.$route.query.id, //	讲师id
            courseTypeId: "", //课程类型id
            sort: "", //排序
            searchKeyword: "",
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize
        }
      }else{
          var query = {
            isRequired: 1, //是否为必修课程 0否 1是
            cityId: "", //开课城市
            companyId: "", //机构id
            authorId: "", //	讲师id
            courseTypeId: "", //课程类型id
            sort: "", //排序
            searchKeyword: "",
            pageNum: this.scrollerInfo.pageNum,
            pageSize: this.scrollerInfo.pageSize
        }
      }

      _this.$http
        .post(
          "/api/curriculum/allCourses",
          _this.qs.stringify(query)
        )
        .then(function(e) {
          if (e.data.code == 200) {
           let list = [];
            if (
              e.data.data &&
              e.data.data.lessons &&
              e.data.data.lessons.length > 0
            ) {
              list = e.data.data.lessons.map(function(item, ind) {
                return {
                  id: item.lessonsId,
                  img: item.images,
                  originalPrice: item.originalPrice,
                  price: item.price,
                  address: item.address,
                  title:item.lessonsName,
                  remark: item.remark,
                  surplus: item.remainingNumber,
                  time: item.startDate+"--"+item.endDate,
                  typeData:item.sellTicketState,
                };
              });
            }

            if (list.length < _this.scrollerInfo.pageSize) {
              _this.scrollerInfo.loadAll = true;
            }

            if (_this.scrollerInfo.pageNum == 1) {
              _this.scrollerInfo.list = list;
            } else {
              _this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
            }

            _this.scrollerInfo.pageNum++;
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }

          _this.resetView();
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
    // goPage(obj) {
    //   if (!this.isLogin()) return false;
    //   if (obj.remainingNumber <= 0) return;
    //   // this.$router.push({ name: 'courseOrder', query: { id: obj.id, type: 'course' } })
    //   this.$router.push({
    //     name: "curriculumOrder",
    //     query: { id: obj.id, type: "course" }
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

@import "~assets/css/course";

.container {
  padding-bottom: 100px;
}
</style>