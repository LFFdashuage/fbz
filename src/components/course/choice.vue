<!-- 
筛选
 -->
 
<template>
<div class="content-block" @click="choiceCheck(choiceData.id)" v-cloak>
		  <span>{{ choiceData.name }}</span>
</div>
    
</template>

<script type="text/babel">
	export default {
		name: "searchHint",
		props: ["choiceData"],
		data () {
			return {
				chdata: {
					name: '',
          id:''
				}
			}
		},
		methods: {
      choiceCheck(event){
      var somedata = event;
      this.$emit('some',somedata);
    },
		}
	}

</script>

<style scoped>
.content-block {
  /*display: inline-block;*/
  background-color: #F2F2F2;
  color:black;
  height: 30px;
	padding: 5px;
	text-align: center;
	font-size: 12px;
  border-radius: 5px;
  margin: 5px;
}
span{
  font-size:15px;
}
</style>