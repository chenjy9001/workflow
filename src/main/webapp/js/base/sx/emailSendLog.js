$(function() {
	var bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "sx/email/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : false,
		disable : false,
		click : function() {}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : false,
		disable : false,
		click : function(data) {}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : false,
		disable : false,
		click : function(ids) {}
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '800px' ], $("#view_data_div").html(), data, function(layero, index) {
				
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
				//设置高度
				var height = $(layero).find("div[class=layui-layer-content]").height();
				$(layero).find("div[class=layui-layer-content]").height(height-28);
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
	bt.config.toolbar.search = "发送邮箱/接收邮箱/邮件标题";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
			sendEmail : function() {
				return $("#search_sendEmail").val();
			},
			receiveEmail : function() {
				return $("#search_receiveEmail").val();
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
		title : "发送邮箱",
		data : 'sendEmail',
	}, {
		title : "接收邮箱",
		data : 'receiveEmail',
	}, {
		title : "邮件标题",
		data : 'msgTitle',
	}, {
		title : "发送状态",
		data : 'sendStatus',
		className : "text-center",
		format : {
			1:"发送中",
			2:"发送成功",
			3:"发送失败",
			"":"发送中"
		}
	}, {
		title : "发送时间",
		data : 'sendTime',
		className : "text-center",
	}, {
		title : "最后发送失败时间",
		data : 'lastFailSendTime',
		className : "text-center",
	} ,{
		title : "发送失败次数",
		data : 'failSendCount',
		className : "text-center"
	}   , {
		title : "发送失败代码",
		data : 'sendResultCode',
	}   , {
		title : "发送失败描述",
		data : 'sendResultMsg',
	}];
	
	// 初始化所有元素
	bt.fn.init(function(table) {

	});
});
