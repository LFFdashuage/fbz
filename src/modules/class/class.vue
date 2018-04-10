<!-- 
  我的班级
 -->
<template>
  <div>
    <div class="class-header">
      
      <div class="header-top">
        <span @click="goPage('classList')">设置背景</span>
        <span class="class-search " @click="setFocus"></span>
      </div>

      <div class="header-search"  :class="{ 'footer-icon' : !discountIcon, 'footer-icon-tow': discountIcon}">
       <search
          @result-click="resultClick"
          @on-change="getResult"
       
          v-model="searchValue"
          position="absolute"
          auto-scroll-to-top top="0px"
          @on-cancel="onCancel"
          @on-submit="onSubmit"
          ref="search"
          placeholder="请输入关键字！"
         >
          </search>
        </div>

      <div class="class-img">
        <img src="~assets/img/audio.png" alt="">
      </div>

      <p class="class-name">{{classinfo.className}}</p>
      <p class="class-num"><span class="classmate">同学：{{classinfo.studentCount}}</span><span class="class-money">班费：{{classinfo.classMoney | numToCash}}</span></p>
      <p class="class-introduction">简介：{{classinfo.introduction}}</p>
    </div>

    <div class="tab">
	    <tab v-model="tabSelected">
	      <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" :key="index">{{ item.title }}</tab-item>
	    </tab>

	    <div class="content">
          
        <!-- 主页 -->
	      <template v-if="tabSelected == 0">
          <div>
            {{searchValue}}
             <el-home :info-data="classinfo"></el-home>     
          </div>
	    	</template>
	        
        <!-- 动态 -->
	      <template v-if="tabSelected == 1">
					<div class="dynamic">
            <el-tab-dynamic></el-tab-dynamic> 
          </div>
	      </template>

         <!-- 相册 -->
	      <template v-if="tabSelected == 2">
					<div>
              <el-album></el-album>
              <el-album></el-album>
              <el-album></el-album>
          </div>
	      </template>
	    </div>

	  </div>
  </div>
</template>

<script>
import { Tab, TabItem, Search } from "vux";
import elHome from "components/class/home-page/home";
import elTabDynamic from "components/class/home-page/tab-dynamic";
import elAlbum from "components/class/home-page/album";
export default {
  name: "class",
  components: {
    Tab, TabItem, Search,
    elHome, elTabDynamic, elAlbum
  },
  data() {
    return {
      results: [],
      searchValue: "",
      discountIcon: false,
      money: 0,
      tabSelected: 0,
      tabDatas: [
        {
          value: "income",
          title: "主页"
        },
        {
          value: "purchase",
          title: "动态"
        },
        {
          value: "puse",
          title: "相册"
        }
      ],
      classinfo: {
        classId: 1, //	班级id
        headerUrl: "", //	班级头像
        backgroudUrl: "", // 背景图片地址
        className: "上海六年六班", //班级名
        studentCount: 35, //	同学数量
        classMoney: 2342, //	班费
        introduction: "狭路相逢，勇者胜！", //班级简介
        hotNumber: 33, //热度
        monitorHeader: "~assets/img/audio.png", //	班长头像
        monitorId: 190, //班长id
        monitorName: "窜天猴", //班长名
        monitorCompanyInfo: "中国移动CEO", //	班长公司信息
        createTime: "2018-02-12", //	班级创建时间
        profile: "共同学习，共同进步，共同发展！", //	班级介绍
        tagTypeList: [
          {
            tagTypeId: 1, //	班级标签id
            tagTypeName: "勤奋" //	班级标签名
          },
          {
            tagTypeId: 2,
            tagTypeName: "勇敢"
          },
          {
            tagTypeId: 3,
            tagTypeName: "好学"
          },
          {
            tagTypeId: 4,
            tagTypeName: "力行"
          }
        ]
      }
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    //取消搜索
    onCancel() {
      this.discountIcon = false;
    },
    // 搜索图标带出搜素框
    setFocus() {
      this.$refs.search.setFocus();
      this.discountIcon = true;
    },
    // 搜索提交
    onSubmit(val) {
      this.$vux.alert.show({
        content: val
      });
    },
    // 输入文字变化时触发
    getResult(val) {
      console.log(val);
      // this.results = val ? getResult(this.searchValue) : []
    },
    resultClick(item) {
      window.alert("you click the result item: " + JSON.stringify(item));
    },
    // 获取班级详情
    fetchData() {
      let _this = this;
      _this.$http
        .post(
          "/api/class/details",
          this.qs.stringify({
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            let res = e.data.data;
            console.log(res);
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
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

.header-search {
  .weui-search-bar {
    // background-color: #8D6F4C;
    background: #BB9D7A url(~assets/img/class/class-bg.png)no-repeat;
    background-size: 100% 100%;
    background-position: auto;
  }

  .weui-search-bar__label {
    background-color: #BB9D7A;
    border-radius: 15px;
  }

  .weui-search-bar__cancel-btn {
    color: #fff;
  }

  .weui-search-bar__box {
    background-color: #f1f1f1;
    border-radius: 15px;
    border: 0;
  }

  .weui-search-bar__form:after {
    border: 0;
  }

  .weui-search-bar__form:after{
    // background-color: #BB9D7A;
    background: #BB9D7A url(~assets/img/class/class-bg.png)no-repeat;
    background-size: 100% 100%;
    background-position: auto;
  }

  .weui-search-bar__form {
    // background-color: #BB9D7A;
        background: #BB9D7A url(~assets/img/class/class-bg.png)no-repeat;
    background-size: 100% 100%;
    background-position: auto;
  }
}
</style>


<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.class-header {
  padding: $padding;
  color: #fff;
  text-align: center;
  // background: #907351;
  background: #fff url(~assets/img/class/class-bg.png)no-repeat;
  background-size: 100% 100%;
  background-position: auto;
  // height: 150px;

  .header-top {
    display: flex;
    justify-content: space-between;
    font-size: $fontSizeTips;

    .class-search {
      display: inline-block;
      padding: 10px 20px;
      background: url(~assets/img/icon/search.png)no-repeat;
      background-size: 30%;
      background-position: 50% 2px;
    }
  }

  .class-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;
    margin: 13px auto;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .class-name {
    font-size: $fontSizeH4;
    margin: 8px 0 0;
  }

  .class-num {
    font-size: $fontSize;

    .classmate {
      display: inline-block;
      padding: 0 $padding;
      text-align: right;
      width: 50%;
      @include halfpxline(0, #fff, 0 , 2px, 0, 0);
    }

    .class-money {
      display: inline-block;
      padding: 0 $padding;
      text-align: left;
      width: 50%;
    }
  }

  .class-introduction {
    font-size: $fontSize;
    padding: 0 $padding;
    @include ellipsisMore(1);
  }
}

.dynamic {
  background-color: $bgGray;
}

.footer-icon {
  width: 100%;
  position: absolute;
  left: -1000px;
}

.footer-icon-tow {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
