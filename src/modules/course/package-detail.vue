<!-- 
	套餐详情页
 -->
<template>
	<div class="detail" v-cloak> 
		<div class="header-info">
      <div class="info-img">
        <img :src="info.images" alt="">
      </div>
      <div class="info-conter">
        <p class="name"> {{info.name}}</p>
        <p class="content"> {{info.content}}</p>
        <p class="price-box"><span class="price">¥ {{info.price}}</span><span class="original-price">¥ {{info.originalPrice}}</span></p>
      </div>
    </div>
    <div class="package-list-box">
      <table class="package-list">
        <tr class="package-list-th">
      		<th><p>地址</p></th>
      		<th><p>时间</p></th>
          <th><p>地址</p></th>
      	</tr>

      	<tr class="package-list-tr" v-for="(item, index) in info.lessons" :key="index">
      		<td><p>{{item.lessonName}}</p></td>
          <td>{{item.time}}</td>
      		<td><p>{{item.address}}</p></td>
      	</tr>
      </table>
    </div>
    
    <div class="rich-html" v-html="info.ramk"></div>
	

    <!-- 底部按钮 -->
		<div v-transfer-dom>
			<div class="detail-btn-bottom">
        <div class="footer-collection"  :class="{ 'collection-icon' : isIcon, 'collection-icon-tow': !isIcon}" @click="collection">收藏</div>
				<!-- <div class="detail-bottom-btn buy" @click="goPage('courseOrder', { id: courseInfo.periodsId, type: 'course' })">马上订票</div> -->
        <div class="detail-bottom-btn buy" @click="goPage('curriculumOrder', { id: periodsId, type: 'package' })">马上订票</div>
			</div>
		</div>

	</div>
</template>

<script type="text/babel">
import { TransferDom } from "vux";

export default {
  name: "packageDetail",
  directives: {
    TransferDom
  },
  components: {},
  data() {
    return {
      isIcon: false,
      periodsId: this.$route.query.periodsId,
      info:{
        images:"",
        // name:"从零到亿，影响以上的财富课",
        // content:"逆向盈利+你想融资+逆向招商，三大课程首次打包",
        // price:7000,
        // originalPrice:8000,
        // ramk:"<p>翟山鹰先生在金融领域有20余年从业经验，历任银行、证券、基金等领域国内外著名公司高管，是中国金融领域罕见的实战派常青树，主导过建设银行、中兴通讯、蒙牛乳业、国美电器等108家著名企业上市工作</p><p>投融资总额超2000亿元，累计培养金融实战人才500万人，网络课程长期占据金融领域培训收视收听第一位。</p>",
        name:"",
        content:"",
        price:0,
        originalPrice:0,
        ramk:"",
       
        lessons:[
          // {
          //   lessonId:1,
          //   lessonName:"从零到亿，影响以上的财富课",
          //   time:"2018-02-13-11:20",
          //   address:"上海市虹桥路333号"
          // },
          // {
          //   lessonId:2,
          //   lessonName:"从零到亿，影响以上的财富课",
          //   time:"2018-02-13-11:20",
          //   address:"上海市虹桥路333号"
          // },{
          //   lessonId:3,
          //   lessonName:"从零到亿，影响以上的财富课",
          //   time:"2018-02-13-11:20",
          //   address:"上海市虹桥路333号"
          // },{
          //   lessonId:4,
          //   lessonName:"从零到亿，影响以上的财富课",
          //   time:"2018-02-13-11:20",
          //   address:"上海市虹桥路333号"
          // },
        ]
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      // _this.getRelate();
      _this.$http
        .post(
          "/api/curriculum/lessonsPackage/details",
          _this.qs.stringify({
            // lessonPackageId: _this.periodsId,
            lessonPackageId: 1,
            customerId: _this.$store.state.user.userId
          })
        )
        .then(function(e) {
          console.log(e)
          if (e.data.code == 200) {
            let resInfo = e.data.data;
            _this.info.images=resInfo.images;
            _this.info.discountId=resInfo.discountId;
            _this.info.name=resInfo.discountName;
            _this.info.price=resInfo.discountprice || 0;
            _this.info.originalPrice=resInfo.packagePrice || 0;
            _this.info.content=resInfo.content;
            _this.info.ramk=resInfo.remark;
            _this.info.lessons=resInfo.lessons;
            
            //  console.log(resInfo)
            if (resInfo.isCollection == 1) {
              _this.isIcon = true;
            }
          } else {
            _this.$vux.alert.show({
              content: e.data.msg
            });
          }
        });
    },

    goPage(url, query) {
      if (!this.isLogin()) return false;
      this.$router.push({ name: url, query: query });
    },

    // 收藏
    collection() {
      let _this = this;
      _this.$http
        .post(
          "/api/customer/collection",
          _this.qs.stringify({
            customerId: _this.$store.state.user.userId,
            goodsType: 5,
            goodsId: _this.$route.query.periodsId
          })
        )
        .then(function(e) {
          if (e.data.code == 200) {
            _this.$vux.toast.show({
              text: e.data.msg
            });
            _this.isIcon = !_this.isIcon;
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

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";

.detail {
  .header-info {
    .info-img {
      padding: $padding $padding 0 $padding;
      height: 129px;
      width: 100%;
      // background-color: #999;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .info-conter {
      height: 101px;
      box-shadow: 0px -8px 25px $bgGray;
      padding: $padding;
      @include halfpxline(0, $bgGray, 0, 0, 12px, 0);
      // background-color: #999;

      .name {
        font-size: $fontSizeH3;
        color: $fontColorBlack;
        text-align: center;
        @include ellipsisMore(1);
      }

      .content {
        margin-top: 3px;
        font-size: $fontSizeTips;
        color: $fontColorGray;
        text-align: center;
        @include ellipsisMore(1);
      }

      .price-box {
        margin-top: 3px;
        text-align: center;

        .price {
          font-size: $fontSizeH2;
          color: $colorRedDeep;
        }

        .original-price {
          margin-left: 5px;
          font-size: $fontSizeTips;
          color: $fontColorGray;
          text-decoration: line-through;
        }
      }
    }
  }
}
.detail-btn-bottom {
  @include halfpxline(0, $borderColor, 1px, 0, 0, 0);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 50px;
  text-align: center;
  background: $colorYellowEasy;
  color: #fff;
  font-size: $fontSizeH3;
  z-index: 500;
  display: flex;

  .footer-collection {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    width: 27%;
    padding-right: 25px;
    color: #333;
  }

  .collection-icon {
    background: $bgGray url(~assets/img/icon/redHeart.png) no-repeat;
    background-position: 13px center;
    background-size: auto 40%;
  }

  .collection-icon-tow {
    background: $bgGray url(~assets/img/icon/heart.png) no-repeat;
    background-position: 13px center;
    background-size: auto 40%;
  }

  .detail-bottom-btn {
    flex: 1;

    &.buy {
      background: $colorRedDeep;
    }
  }
}
.package-list-box{
 @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
 padding: 0 $padding $padding $padding;
}
.package-list {
  width: 100%;
  line-height: 40px;
  border-collapse: collapse;
  border-spacing: 0;
  text-align: center;
  .package-list-th {
    th {
       @include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
      p {
        width: 30%;
        margin: 0 auto;
        border-bottom: 1px solid $colorRed;
      }
    }
  }

  th,
  td {
    padding: 0;
    border: 0px;
    min-width: 4.5em;
    max-width: 4.5em;
    font-size: $fontSizeTips;
  }
  .package-list-tr {
    td {
      color: $fontColorGray;
      p {
        @include ellipsisMore(1);
      }
    }
  }
}
.rich-html{
  padding: $padding;
  font-size: $fontSize;
  color: $fontColorGray;
  text-indent:25px;
}
</style>