<!-- 
  班费明细
 -->
<template>
  <div class="class-list">
    <div v-if="isShow==true">
      <div class="top-search">
        <search
            @result-click="resultClick"
            @on-change="getResult"
            v-model="searchValue"
            position="absolute"
            auto-scroll-to-top top="0px"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search"
          >
        </search>
      </div>

      <div class="class-box" >
        <div class="class-img">
          <img src="~assets/img/audio.png" alt="">
        </div>

        <div class="class-info">
          <p class="name">上海六年六班</p>
          <p class="classmate"><span>同学：89</span><span>班费：8888</span></p>
          <p class="remark">共同学习，共同进步，共同发展！</p>
        </div>

        <div class="class-btn">
          <div class="btn">
            退出
          </div>
        </div>
      </div>
    </div>

    
      <div class="top-header-search">
        
        <div class="search-box">
        <search
            @result-click="resultClick"
            @on-change="getResult"
            v-model="searchValue"
            position="absolute"
            auto-scroll-to-top top="0px"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search"
          >
        </search>
        </div>

        <div class="establish-btn">创建</div>

      </div>
      
      <div class="class-info-box">
        <scroller lock-y scrollbar-x>
          <div class="box1">
            <div class="box1-item" v-for="(item, index) in 7" :key="index">
              <div class="class-img">
                <img src="~assets/img/audio.png" alt="">
              </div>
              <span>上海六年六班</span>
            </div>
          </div>
        </scroller>
      </div>

    <div class="tab">
      <p class="tab-tips">活跃榜</p>
	    <tab v-model="tabSelected">
	      <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" :key="index">{{ item.title }}</tab-item>
	    </tab>

	    <div class="content">
          
        <!-- 主页 -->
	      <template v-if="tabSelected == 0">
          <div>

            <div class="tag-type">
              <span class="tag-type-name" v-for="(item, index) in tagTypeList" :key="index">{{item.tagTypeName}}</span>
            </div>
            <div v-for="(item, index) in 2" :key="index">
              <el-img-text-class :type-data="typeData"></el-img-text-class>
            </div>
          </div>
	    	</template>
	        
        <!-- 动态 -->
	      <template v-if="tabSelected == 1">
					  <div class="tag-type">
              <span class="tag-type-name" v-for="(item, index) in tagTypeList" :key="index">{{item.tagTypeName}}</span>
            </div>
            <div v-for="(item, index) in 4" :key="index">
              <el-img-text-class></el-img-text-class>
            </div>
	      </template>

       
	    </div>

	  </div>
  </div>
</template>

<script>
import { Tab, TabItem, Search, Scroller } from "vux";
import elHome from "components/class/home-page/home";
import elDynamic from "components/class/home-page/dynamic";
import elAlbum from "components/class/home-page/album";
import elImgTextClass from "components/class/class-list/img-text-class-list";
export default {
  name: "classMoney",
  components: {
    Tab,
    TabItem,
    Search,
    Scroller,
    elImgTextClass,
    elHome,
    elDynamic,
    elAlbum
  },
  data() {
    return {
      typeData: 1,
      type: 0,
      isShow: false,
      searchValue: "",
      tabSelected: 0,
      tabDatas: [
        {
          value: "wholeCountry",
          title: "全国"
        },
        {
          value: "local",
          title: "本地"
        }
      ],
      tagTypeList: [
        {
          tagTypeId: 1,
          tagTypeName: "金融资本"
        },
        {
          tagTypeId: 2,
          tagTypeName: "企业管理轻模式"
        },
        {
          tagTypeId: 3,
          tagTypeName: "区块链"
        },
        {
          tagTypeId: 4,
          tagTypeName: "经济"
        },
        {
          tagTypeId: 4,
          tagTypeName: "力行"
        },
        {
          tagTypeId: 4,
          tagTypeName: "力行"
        }
      ]
    };
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    //取消搜索
    onCancel() {},
    // 搜索图标带出搜素框
    setFocus() {
      this.$refs.search.setFocus();
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
    },
    // 输入框获取到焦点时触发
    onFocus() {},
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
    }
  }
};
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.top-header-search .search-box{
		.weui-search-bar {
			padding: 0;
			border-radius: $borderRadius;

			&:before, &:after {
				display: none;
			}
		}

		.weui-search-bar__form {
			border-radius: $borderRadius;
		}

		.weui-search-bar__label {
			background-color: #f1f1f1;
		}
	}
</style>
<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
 

.class-list {
  position: absolute;
  width: 100%;

  .top-search {
    width: 100%;
    position: relative;
    top: 0;
    display: flex;
    justify-content: flex-start;
    border-bottom: $borderColor solid 1px;
    .search-box {
      flex: 1;
    }

    .establish-btn {
      display: flex;
      width: 30px;
      justify-content: center;
      align-items: center;
    }
  }
  
.top-header-search {
    width: 100%;
    position: relative;
    top: 0;
    display: flex;
    justify-content: flex-start;
    border-bottom: $borderColor solid 1px;
    .search-box {
      // position: absolute;
      // top: 0;
      flex: 1;
      height: 100%;
      margin: 0 36px;
    }

    .establish-btn {
      display: flex;
      width: 30px;
      justify-content: center;
      align-items: center;
    }
  }

  .class-box {
    background: #907351;
    padding: $padding;
    display: flex;
    align-items: center;
    // justify-content: flex-start;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

    .class-img {
      width: $quotationUserImgW+14px;
      height: $quotationUserImgW+14px;
      // margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .class-info {
      padding-left: $padding;
      flex: 1;
      flex-direction: row;
      align-items: center;
      position: relative;
      color: #fff;

      .name {
        font-size: $fontSizeH4;
        @include ellipsisMore(1);
      }

      .classmate {
        font-size: $fontSize;
        line-height: 1.75;

        span {
          margin-right: 20px;
        }
      }

      .remark {
        @include ellipsisMore(1);
        font-size: $fontSizeTips;
        line-height: 1.75;
      }
    }

    .class-btn {
      width: 100px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color:#333;

      .btn {
        width: 80px;
        background-color: #fff;
        // padding: 5px 0;
        color: #333;
        border-radius: 15px;
        text-align: center;
      }
    }
  }
  .tab-tips {
    padding: 5px $padding;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
}
.tag-type {
  width: 100%;
  padding: 5px $padding;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  .tag-type-name {
    display: inline-block;
    padding: 0 15px;
    background-color: $borderColor;
    margin: 5px 10px;
    border-radius: 20px;
    color: #ac9374;
  }
}
.class-info-box {
  margin-top: 10px;
  border-bottom: $borderColor solid 5px;
  padding-bottom: 5px;
}
.box1 {
  height: 100px;
  position: relative;
  width: 900px;
  padding: 5px 0;
}
.box1-item {
  width: 100px;
  height: 100px;
  // background-color: #ccc;
  display: inline-block;
  margin-left: 5px;
  float: left;
  text-align: center;
  @include halfpxline(0, $borderColor, 0 , 2px, 0, 0);
  .name {
    font-size: $fontSizeH4;
    @include ellipsisMore(1);
  }
  .class-img {
    width: $quotationUserImgW+14px;
    height: $quotationUserImgW+14px;
    margin: 10px auto;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.box1-item:first-child {
  margin-left: 0;
}
</style>
