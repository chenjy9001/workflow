$(function() {
	var bt = new baothink();
	// 把默认的ID换成实际功能需要的ID
	bt.config.id = "id";
	bt.config.url.namespace = "/sx/msgSend/";
	bt.config.toolbar.search = "短信内容/手机";
	bt.config.datatables.multiSelect = true;// 是否多选
	bt.config.datatables.scrollX = true;
	bt.config.toolbar.query = {// 配置高级查询
		phone : function() {
			return $("#search_phone").val();
		}
	};

	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_retry",
		text : "重发",
		icon : "fa-pencil",
		visible : true,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				top.layer.alert("请选择您要重发的数据！", {
					icon : 0,
					title : "提示"
				});
				return;
			}
			var indexs = top.layer.msg('正在重发中', {
				icon : 16,
				shade : 0.3,
				time : 0
			});
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgSend/retrySend.htm',
				dataType : "json",
				data : {
					"ids" : ids
				},
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					top.layer.close(indexs);
					if (data.success) {
						if (data.data == -1) {
							top.layer.alert("重发失败，请选择您要重发的数据！", {
								icon : 3,
								title : "提示"
							});
							return;
						} else if (data.data > 0) {
							top.layer.alert("重发完成，其中有" + data.data + "条数据重发失败！", {
								icon : 0,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
							return;
						} else if (data.data == 0) {
							top.layer.alert('重发成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
					} else {
						top.layer.alert("重发失败，请稍后重试！", {
							icon : 3,
							title : "提示"
						});
						return;
					}
				}
			});
		}
	}, {
		id : "btn_countView",
		text : "余额查询",
		icon : "fa-search",
		visible : true,
		click : function(data) {
			var indexs = top.layer.msg('查询中', {
				icon : 16,
				shade : 0.3,
				time : 0
			});
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgSend/getSmsCount.htm',
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					top.layer.close(indexs);
					if (data.success) {
						top.layer.alert("您的短信余额：" + data.data + "条", {
							icon : 1,
							title : "余额查询"
						});
					}
				}
			});
		}
	} ]

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'msmType',
		title : '短信类型',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "个人注册";
			} else if (data == "11") {
				return "企业注册";
			} else if (data == "20") {
				return "找回密码";
			} else if (data == "90") {
				return "其他";
			} else {
				return data;
			}
		}
	}, {
		data : 'phone',
		title : '手机',
		className : "text-center",
	}, {
		data : 'msgContent',
		title : '短信内容',
		width : '600px',
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
		className : "text-center",
		width : '150px',
	}, {
		data : 'lastFailSendTime',
		title : '最后发送失败时间',
		width : '150px',
		className : "text-center",
	}, {
		data : 'sendFailCount',
		title : '发送失败次数',
		className : "text-center",
	}, {
		data : 'sendResultCode',
		title : '发送失败代码',
		className : "text-center",
		width : '90px',
	}, {
		data : 'sendResultMsg',
		title : '发送失败描述',
		width : '120px',
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
	});

});
