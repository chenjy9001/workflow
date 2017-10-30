$(function() {
	var bt = new baothink();
	var obj = new modelObj();
	bt.config.url.namespace = "/sx/sysMsgSend/";// url命名空间
	bt.config.url.loadListByPage = "loadListByPage.htm?isRead=" + isRead;// 分页查询的url
	bt.config.toolbar.search = "消息标题/消息内容";// 右上角搜索框的提示语句
	// 配置部件是否可见
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false

	bt.config.datatables.fixedParam = {
		isRead : function() {
			return isRead;
		},
		receiveEntCode : function() {
			return receiveEntCode;
		},
		receiveEmpCode : function() {
			return receiveEmpCode;
		}
	};

	bt.config.toolbar.query = {// 配置高级查询
		msgTitle : function() {
			return $("#search_msgTitle").val();
		},
		msgContent : function() {
			return $("#search_msgContent").val();
		},
		readEmpId : function() {
			return $("#search_readEmpId").val();
		},
		readTime : function() {
			return $("#search_readTime").val();
		},
		sendTime : function() {
			return $("#search_sendTime").val();
		}
	};

	if (isRead == "all" || isRead == "0") {
		// 工具栏按钮配置
		bt.config.toolbar.btn = [ {
			id : "btn_markRead",
			text : "全部标为已读",
			icon : "fa-pencil",
			visible : true,
			click : function() {
				// 询问框
				top.layer.confirm('是否全部标为已读？', {
					btn : [ '是', '否' ],
					icon : 3,
					title : "提示"
				}, function(index, layero) {
					top.layer.close(index);
					var indexs = top.layer.msg('请稍候', {
						icon : 16,
						shade : 0.3,
						time : 0
					});
					$.ajax({
						type : 'POST',
						url : basePath + "sx/sysMsgSend/changeAllRead.htm",
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							top.layer.close(indexs);
							$("#dataTable").find("tr td span").css("font-weight", "normal");
						},
					});
				}, function(index, layero) {
					top.layer.close(index);
				});
			}
		} ]
	}

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'msgTitle',
		title : '消息标题'
	}, {
		data : 'msgContent',
		title : '消息内容'
	}, {
		className : "text-center",
		data : 'isRead',
		title : '是否阅读'
	}, {
		data : 'readEmpId',
		title : '阅读人'
	}, {
		data : 'readTime',
		title : '阅读时间',
		width : '150px'
	}, {
		data : 'sendTime',
		title : '接收时间',
		width : '150px'
	} ];

	// 把未读的tr行标记为字体加粗
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (meta.col == 5) {
				if (row.isRead == "0") {
					data = "未读";
				} else {
					data = "已读";
				}
			}
			if (row.isRead == "0") {
				return "<span style='font-weight:bold;'>" + data + "</span>";
			} else {
				return data;
			}
		},
		targets : [ 3, 4, 5, 6, 7, 8 ]
	} ];

	// 重写datatables点击事件，如果点击未读消息，则去掉加粗字体并设为已读
	bt.event.rowClick = function(tr, rowData) {
		bt.fn.tableRowClick(tr, rowData);
		obj.singleClick(tr, rowData);
	}

	// 初始化所有元素
	bt.fn.init(function(table) {
	});
});

/**
 * 数据操作对象
 */
var modelObj = function() {
	var obj = {
		singleClick : function(tr, rowData) {
			if (rowData.isRead == "0") {
				$.ajax({
					type : 'POST',
					url : basePath + "sx/sysMsgSend/changeIsRead.htm",
					dataType : "json",
					data : {
						"id" : rowData.id
					},
					success : function(data, textStatus, jqXHR) {
						$(tr).find("span").css("font-weight", "normal");
					},
				});
			}
		}
	}
	return obj;
}
