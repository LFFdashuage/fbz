<!-- 
	班级主页
 -->
<template>
	<div class="home" v-cloak>
    <p class="home-tip">基本信息</p>
		<div class="header-box">
      <div class="monitor">
        <div class="monitor-img">
          <img src="~assets/img/audio.png" alt="">
        </div>
        <div class="monitor-info">
          <p>{{monitorName}}</p>
          <p>{{monitorCompanyInfo}}</p>
        </div>
      </div> 
      <div class="conter">
        <p class="createTime"> 创建时间：{{createTime}}</p>
        <div class="tag-type">
          标签：<span class="tag-type-name" v-for="(item, index) in tagTypeList" :key="index">{{item.tagTypeName}}</span>
        </div>
      </div>
      <div class="class-introduction">
        <p>
          <span>班级介绍：</span>
          <span>{{profile}}</span>
        </p>
        <div class="tag-type">
          标签：<span class="tag-type-name" v-for="(item, index) in tagTypeList" :key="index">{{item.tagTypeName}}</span>
        </div>
      </div>

      <div class="footer-btn">
        申请加入
      </div>

		</div>
	</div>
</template>

<script type="text/babel">
export default {
  name: "elHome",
  props: ["infoData"],
  data() {
    return {
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
          // },
          // {
          //   tagTypeId: 4,
          //   tagTypeName: "力行"
          // },
          // {
          //   tagTypeId: 4,
          //   tagTypeName: "力行"
          // },
          // {
          //   tagTypeId: 4,
          //   tagTypeName: "力行"
          // },
          // {
          //   tagTypeId: 4,
          //   tagTypeName: "力行"
          // },
          // {
          //   tagTypeId: 4,
          //   tagTypeName: "力行"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.home {
  width: 100%;
  position: absolute;
  .home-tip {
    padding: 5px;
    text-align: left;
    font-size: $fontSize;
    @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  }
  .header-box {
    padding: 0 $padding;

    .monitor {
      padding: $padding 0;
      display: flex;
      flex-direction: row;
      @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);

      .monitor-img {
        width: $quotationUserImgW+14px;
        height: $quotationUserImgW+14px;
        margin: 0 $padding 0 0;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .monitor-info {
        line-height: 1.9;
      }
    }
    .conter {
      padding: $padding 0;
      // margin-bottom: 15px;
      @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
      .createTime {
        margin-bottom: 30px;
      }
    }
    .class-introduction {
      padding: $padding 0;
      @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
      p {
        margin-bottom: $padding;
      }
    }
  }
  .footer-btn {
    position: relative;
    left: 25%;
    top: 50px;
    width: 200px;
    padding: 10px 0;
    border-radius: 30px;
    color: #fff;
    font-size: $fontSizeH4;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #907351;
  }
}

.tag-type {
  width: 100%;
  .tag-type-name {
    display: inline-block;
    padding: 1px 10px;
    background-color: $borderColor;
    margin: 5px 5px;
    border-radius: 20px;
  }
}

.img-text-box {
  height: 80px;
  width: 100%;
  @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
  display: flex;
  color: $fontColorBlack;

  .conte {
    flex: 1;
    display: flex;
    align-items: center;

    p {
      @include ellipsisMore(1);
      font-size: $fontSize;
    }
  }

  .money {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: $fontSizeH4;
  }
}
</style>