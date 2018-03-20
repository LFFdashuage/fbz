// 课程筛选

const courseFilter =  {
	all: {
		status: false,
		list: [
      { key: "0", value: "按老师排序" },
      { key: "1", value: "按机构排序" },
      { key: "2", value: "按时间排序" }
      // { key: "3", value: "热门课程" }
    ]
	},
	other: {
		status: false,
		list: [
		  {
		    name: "老师",
		    dataId: "",
		    list: []
		  },{
		    name: "机构",
		    dataId: "",
		    list: []
		  },{
		    name: "课程类型",
		    dataId: "",
		    list: []
		  },{
		    name: "行业类型",
		    dataId: "",
		    list: []
		  },{
		    name: "营业额",
		    dataId: "",
		    list: [
		      {
		        id: "M0L1000",
		        name: "0~1000万"
		      },{
		        id: "M1000L3000",
		        name: "1000~3000万"
		      },{
		        id: "M3000L6000",
		        name: "3000~6000万"
		      },{
		        id: "M6000L9000",
		        name: "6000~9000万"
		      },{
		        id: "M9000",
		        name: "9000万以上"
		      }
		    ]
		  },{
		    name: "公司人数",
		    dataId: "",
		    list: [
		      {
		        id: "M0L10",
		        name: "0~10人"
		      },{
		        id: "M10L50",
		        name: "10~50人"
		      },{
		        id: "M50L200",
		        name: "50~200人"
		      },{
		        id: "M200",
		        name: "200人以上"
		      }
		    ]
		  }
		]
	}
}

export default courseFilter;