$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "sx/appSend/";
	bt.config.toolbar.search = "企业代码/app消息标题/内容";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.datatables.scrollX = true;
	bt.config.toolbar.query = {// 配置高级查询
		entCode : function() {
			return $("#search_entCode").val();
		},
		appTitle : function() {
			return $("#search_appTitle").val();
		},
		appContent : function() {
			return $("#search_appContent").val();
		},
		sendStatus : function() {
			if ($('#search_sendStatus1').is(':checked')) {
				return "1";
			} else if ($('#search_sendStatus2').is(':checked')) {
				return "2";
			} else if ($('#search_sendStatus3').is(':checked')) {
				return "3";
			}
		},
		sendtime : function() {
			return $("#search_sendtime").val();
		},
		sendResultMsg : function() {
			return $("#search_sendResultMsg").val();
		}
	};

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'entCode',
		title : '企业代码',
	}, {
		data : 'appTitle',
		title : 'app消息标题',
		width : '110px'
	}, {
		data : 'appContent',
		title : 'app消息内容',
		width : '200px',
		render : function(data, type, row, meta) {
			return '<div style="word-wrap:break-word;" >' + data + '</div>';
		}
	}, {
		data : 'appContentType',
		title : 'app消息内容类型',
	}, {
		data : 'sendStatus',
		title : '发送状态',
		className : "text-center",
		width : '100px',
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "发送中";
			} else if (data == "2") {
				return "发送成功";
			} else if (data == "3") {
				return "发送失败";
			} else {
				return data;
			}
		}
	}, {
		data : 'sendTime',
		title : '发送时间',
		width : '180px'
	}, {
		data : 'failSendCount',
		title : '发送失败次数',
	}, {
		data : 'sendResultCode',
		title : '发送失败代码',
	}, {
		data : 'sendResultMsg',
		title : '发送失败描述',
	}, {
		data : 'lastFailSendTime',
		title : '最后发送失败时间',
		width : '180px'
	}, {
		data : 'appAudienceKey',
		title : '推送目标方式',
	}, {
		data : 'appAudienceValue',
		title : '推送目标方式值',
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
	});

});
