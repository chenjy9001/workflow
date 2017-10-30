$(function() {
	// 10:已提交 20:已处理
	if (feedbackStatus == "10") {
		submit();
	} else if (feedbackStatus == "20") {
		handle();
	}
})

/**
 * 未处理
 */
function submit() {
	var bt = new baothink();
	bt.config.url.namespace = "iu/feedbask/";
	bt.config.url.loadListByPage = "loadListByPage.htm?feedbackStatus=10";// 分页查询的url
	bt.config.toolbar.search = "反馈单号/反馈标题/反馈人";
	bt.config.toolbar.btnGroup = false;

	bt.config.toolbar.query = {// 配置高级查询
		feedbackNo : function() {
			return $("#search_feedbackNo").val();
		},
		feedbackTitle : function() {
			return $("#search_feedbackTitle").val();
		},
		feedbackDate : function() {
			return $("#search_feedbackDate").val();
		},
		feedbackEName : function() {
			return $("#search_feedbackEName").val();
		}
	};
	bt.config.datatables.fixedParam = {
	    feedbackStatus : function() {
	    	return "10";
	    }
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		title : "意见反馈单号",
		data : 'feedbackNo',
	}, {
		title : "意见反馈标题",
		data : 'feedbackTitle',
	}, {
		title : "反馈人姓名",
		data : 'feedbackEName',
		width : '100px'
	
	}, {
		title : "反馈人电话",
		data : 'feedbackTel',
		className : "text-center",
		width : '150px'
	}, {
		title : "反馈时间",
		data : 'feedbackDate',
		className : "text-center",
		width : '150px'
	} ];

	bt.config.toolbar.btn = [ {
		id : "btn_modify",
		text : "意见处理",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		tips : {
		    notSelect : "请选择您要处理的数据！"
		},
		click : function(data) {
			if (data.feedbackStatus == "20") {
				top.layer.alert('此单据已经处理成功');
			} else {
				bt.fn.showModify('意见处理 ', [ '800px', '550px' ], $("#modify_data_div").html(), data, ['处理'], function(layero, index) {

					$("#feedbackContent", layero).val(data.feedbackContent);
					
					if (data.fileType == null || data.fileType == "") {
						$("#attachment", layero).parent().parent().remove();
					} else {
						if (data.fileType.indexOf("image") > -1) {
							$("#attachment", layero).append(data.fileName);
							var filepath = basePath + "fileserver/loadImage/" + data.attachmentId;
							$("#hideImg", layero).find("img").attr("src", filepath);
							$("#attachment", layero).click(function() {
								top.layer.open({
									type : 1,
									title : false,
									closeBtn : 1,
									area : '700px',
									shadeClose : true,
									content : $("#hideImg", layero).html()
								});
							});
						} else {
							var html = "<a href='" + basePath + "fileserver/downloadFile/" + data.attachmentId + "' target='_blank'>" + data.fileName + "</a>";
							$("#attachment", layero).html(html);
						}
					}
					fromSubmit($("#modify_data_form", layero), function(data) {
						top.layer.close(index);
						var result = JSON.parse(data);
						if (result.success) {
							top.layer.alert('处理成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						} else {
							top.layer.alert(result.errorMsg, {
								icon : 2,
								title : "提示"
							});
						}
					});
				});
			}
		}
	}];

	// 初始化所有元素
	bt.fn.init(function() {
	});

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun) {
		return from.validate({
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"handleResult" : {
					required : true,
					maxlength : 200
				}
			},
			messages : {
				"handleResult" : {
					required : "请输入处理意见",
					maxlength : "处理意见不能超过200个字符"
				}
			}
		});
	}

};

/**
 * 已处理
 */
function handle() {
	var bt = new baothink();
	bt.config.url.namespace = "iu/feedbask/";
	bt.config.toolbar.search = "反馈单号/反馈标题/反馈人/处理人";
	bt.config.url.loadListByPage = "loadListByPage.htm?feedbackStatus=20";// 分页查询的url
	bt.config.toolbar.btnGroup = false;

	bt.config.toolbar.query = {// 配置高级查询
		feedbackNo : function() {
			return $("#search_feedbackNo").val();
		},
		feedbackTitle : function() {
			return $("#search_feedbackTitle").val();
		},
		feedbackDate : function() {
			return $("#search_feedbackDate").val();
		},
		handleDate : function() {
			return $("#search_handleDate").val();
		},
		feedbackEName : function() {
			return $("#search_feedbackEName").val();
		}
	};
	bt.config.datatables.fixedParam = {
		    feedbackStatus : function() {
		    	return "20";
		    }
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		title : "意见反馈单号",
		data : 'feedbackNo',
		width : '150px'
	}, {
		title : "意见反馈标题",
		data : 'feedbackTitle',
		width : '200px'
	}, {
		title : "反馈人姓名",
		data : 'feedbackEName',
		width : '100px'
	}, {
		title : "反馈人电话",
		data : 'feedbackTel',
		className : "text-center",
		width : '200px'
	}, {
		title : "反馈时间",
		data : 'feedbackDate',
		className : "text-center",
		width : '150px'
	}, {
		title : "处理意见",
		data : 'handleResult',
		width : '150px'
	}, {
		title : "处理人姓名",
		data : 'handleEName',
		width : '150px'
	}, {
		title : "处理时间",
		data : 'handleDate',
		width : '150px'
	} ];

	bt.config.toolbar.btn = [ {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '800px','550px' ], $("#view_data_div1").html(), data, function(layero, index) {
				$("#feedbackContent", layero).val(data.feedbackContent);
				if (data.fileType == null || data.fileType == "") {
					$("#attachment", layero).parent().parent().remove();
				} else {
					if (data.fileType.indexOf("image") > -1) {
						$("#attachment", layero).append(data.fileName);
						var filepath = basePath + "fileserver/loadImage/" + data.attachmentId;
						$("#hideImg", layero).find("img").attr("src", filepath);
						$("#attachment", layero).click(function() {
							top.layer.open({
								type : 1,
								title : false,
								closeBtn : 1,
								area : '700px',
								shadeClose : true,
								content : $("#hideImg", layero).html()
							});
						});
					} else {
						var html = "<a href='" + basePath + "fileserver/downloadFile/" + data.attachmentId + "' target='_blank'>" + data.fileName + "</a>";
						$("#attachment", layero).html(html);
					}
				}
				$("#handleResult", layero).html(data.handleResult);
				$("#feedbackContent", layero).html(data.feedbackContent);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					var $textarea = layero.find("textarea[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "feedbackStatus":
							switch (value) {
							case "10":
								$input.text("未处理");
								break;
							case "20":
								$input.text("已处理");
								break;
							}
							break;
						}
					}
				});
			});
		}
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
	});

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun) {
		return from.validate({
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			}
		});
	}
}
