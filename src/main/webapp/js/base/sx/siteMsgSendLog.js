$(function() {
	var bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "sx/siteMsg/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '800px', '560px' ], $("#view_data_div").html(), data, function(layero, index) {
				
				if(data.failSendCount == null){
					$("#failSendCount", layero).html("0");
				}
				
				var  sendStatusval = "";
				if(data.sendStatus == "1" || data.sendStatus == ""){
					sendStatusval = "发送中";
				}
				if(data.sendStatus == "2"){
					sendStatusval = "发送成功";
				}
				if(data.sendStatus == "3"){
					sendStatusval = "发送失败";
				}
				$(layero).find("span[name=sendStatus]").text(sendStatusval);
				var  isReadval = "";
				if(data.isRead == "0" ){
					isReadval = "否";
				}
				if(data.sendStatus == "1"){
					isReadval = "是";
				}
				$(layero).find("span[name=isRead]").text(isReadval);
			});
		}
	}, {
		id : "btn_refresh",
		text : "刷新",
		icon : "fa-refresh",
		visible : false,
		disable : false,
		click : function() {
			bt.fn.reload(true);
		}
	} ];
	bt.config.toolbar.search = "消息标题/收件人个人名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
			receiveEmpName : function() {
				return $("#search_receiveEmpName").val();
			},
			receiveEntName : function() {
				return $("#search_receiveEntName").val();
			},
			msgTitle : function() {
				return $("#search_msgTitle").val();
			},
			sendStatus : function() {
				return $("input[name=sendStatus]:checked").val();
			},
			sendTime:function(){
				var sendTime = $("#search_sendTime").val();
				return sendTime;
			}
	};
	bt.config.datatables.columns = [{// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	},  bt.datatables.columns.cs, bt.datatables.columns.seq, {
		title : "收件人企业代码",
		data : 'receiveEntCode',
	}, {
		title : "收件人企业名称",
		data : 'receiveEntName',
	}, {
		title : "收件人个人代码",
		data : 'receiveEmpCode',
	}, {
		title : "收件人个人名称",
		data : 'receiveEmpName',
	}, {
		title : "消息标题",
		data : 'msgTitle',
		width : '300px'
	}, {
		title : "发送状态",
		data : 'sendStatus',
		className : "text-center"
	}   , {
		title : "是否阅读",
		data : 'isRead',
		className : "text-center"
	}  , {
		title : "发送时间",
		data : 'sendTime',
		className : "text-center",
		width : '150px'
	}  , {
		title : "阅读时间",
		data : 'readTime',
		className : "text-center",
		width : '150px'
	} , {
		title : "阅读人",
		data : 'readEmpId',
	} , {
		title : "最后发送失败时间",
		data : 'lastFailSendTime',
		className : "text-center",
		width : '150px'
	}  , {
		title : "发送失败次数",
		data : 'failSendCount',
		className : "text-center"
	}   , {
		title : "发送失败代码",
		data : 'sendResultCode',
	}   , {
		title : "发送失败描述",
		data : 'sendResultMsg',
	} ];
	
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "是";
			} else {
				return "否";
			}
		},
		targets : [ 9 ]
	},{
		render : function(data, type, row, meta) {
			if (data == "2") {
				return "发送成功";
			} else if(data == "3"){
				return "发送失败";
			}else{
				return "发送中";
			}
		},
		targets : [ 8 ]
	} ];
	
	// 初始化所有元素
	bt.fn.init(function(table) {

	});
});
