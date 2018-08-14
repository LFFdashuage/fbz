<!-- 
  班费明细
 -->
<template>
  <div class="class-money">
      <div class="wallet-header">
        <p>班费</p>
        <div class="money">{{ money | numToCash }}</div>
        <div class="wallet-btn" @click="getMoney">提现</div>
      </div>

    	<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" :key="index">{{ item.title }}</tab-item>
	      </tab>

	      <div class="content">
          
          <!-- 收入 -->
	      	<template v-if="tabSelected == 0">
            <div>
               
               <el-income></el-income>
            </div>
	      	</template>
	        
          <!-- 支出 -->
	        <template v-if="tabSelected == 1">
						<div>
                <el-expenditure> </el-expenditure>
            </div>
	        </template>
	      </div>

	    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import elExpenditure from "components/class/class-money/expenditure";
import elIncome from "components/class/class-money/income";
export default {
  name: "classMoney",
  components: {
    Tab, TabItem, Swiper, SwiperItem,
    elIncome, elExpenditure
  },
  data() {
    return {
      money:0,
      tabSelected: 0,
      tabDatas: [
        {
          value: "income",
          title: "收入"
        },
        {
          value: "purchase",
          title: "支出"
        }
      ]
    };
  },
 mounted() {
    this.fetchData();
  },
  methods: {
    // 获取班费
    fetchData(){
     	let _this = this;
  		_this.$http.post('/api/userInfo/userAttribute',
	  			this.qs.stringify({
						"customerId": _this.$store.state.user.userId
					})
	  		).then(function(e) {
	  			if(e.data.code == 200) {
	  				let res = e.data.data;
            
            _this.money =res.walletAmount || 0;

	  			} else {
	  				_this.$vux.alert.show({
	  					content: e.data.msg
	  				})
	  			}
	  		});
    },
    //提现
    getMoney(){
      console.log('提现')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~lib/sandal/core";
@import "~assets/css/core/functions",
  "~assets/css/core/mixins",
  "~assets/css/core/vars";
.wallet-header {
  position: relative;
  padding: 40px 0 20px;
  color: #fff;
  text-align: center;
  background: url(~assets/img/class/class-money-bg.png)no-repeat;
  background-size: 100% 80%;
  background-position:50% 100%;

  p {
    margin-bottom: 10px;
    font-style: 14px;
  }

  .money {
    font-size: 30px;
    margin-bottom: 10px;
  }

  .wallet-btn {
    position: absolute;
    right: 10px;
    top:30%;
    font-size: 12px;
    padding: 0 2em;
    line-height: 30px;
    // background-color: #999;
    color: #fff;
    // border-radius: 20px;
    display: inline-block;
  }
}
</style>
