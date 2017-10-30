$(function() {
	var bt = new baothink();
	var recordTop;// 记录置顶状态
	var recordStatus = "";// 记录数据的状态
	bt.config.url.namespace = "/iu/notice/";
	bt.config.toolbar.search = "标题";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
		title : function() {
			var title = $("#search_title").val()
			return title;
		},
		rank : function() {
			return $("#search_rank").val();
		},
		releaseDate : function() {
			var releaseDate = $("#search_releaseDate").val();
			return releaseDate;
		},
		matureDate : function() {
			var matureDate = $("#search_matureDate").val();
			return matureDate;
		},
		status : function() {
			return $("#search_status").val();
		}
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'title',
		className : "text-center",
		title : '公告标题'
	}, {
		data : 'status',
		title : '状态',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "10") {
				recordStatus = "录入";
				return "录入";
			} else if (data == "20") {
				recordStatus = "发布";
				return "发布";
			} else if (data == "00") {
				recordStatus = "作废";
				return "作废";
			} else {
				recordStatus = "";
				return "";
			}
		}
	}, {
		data : 'rank',
		sTitle : '级别',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "紧急";
			} else if (data == "20") {
				return "重要";
			} else if (data == "30") {
				return "一般";
			} else {
				return "";
			}
		}
	}, {
		data : 'topFlag',
		sTitle : '置顶',
		className : "text-center",
		render : function(data, type, row, meta) {
			recordTop = data;
			if (data == "1") {
				return "是";
			} else if (data == "0") {
				return "否";
			} else {
				return "";
			}
		}
	}, {
		data : 'announceReleaseMan',
		title : '发布人',
		className : "text-center"
	}, {
		data : 'releaseDate',
		title : '发布日期',
		className : "text-center"
	}, {
		className : "text-center",
		data : 'matureDate',
		title : '到期日期'
	}, {
		className : "text-center",
		data : 'createEName',
		title : '创建人'
	}, {
		className : "text-center",
		data : 'createDate',
		title : '创建时间'
	}, {
		className : "text-center",
		title : "操作",
		render : function(data, type, row, meta) {
			var html = '';
			var name = "";
			if (recordStatus == "发布") {
				if (recordTop == "1") {
					name = "取消置顶";
					html += '<a class="btn btn-primary btn-xs" data-type="cancle" onClick="topSetOrCancle(this);" >';
				} else {
					name = "置顶";
					html += '<a class="btn btn-primary btn-xs" data-type="set" onClick="topSetOrCancle(this);" >';
				}
				html += name;
				html += '</a> ';
			}
			return html;
		}
	} ];
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增公告 ', [ '700px', '540px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
							icon : 1
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg);
					}
				});
			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			var $tr = null;
			$("tr[role=row]").each(function() {
				if ($(this).hasClass("selected")) {
					$tr = $(this);
					return false;
				}
			});
			if ($tr == null) {
				top.layer.alert("至少选择一条数据！", {
					icon : 0
				});
			}
			var noticeStatus = $tr.find("td:first").next().next().next().text();
			if (noticeStatus == "发布") {
				top.layer.alert('该公告已发布，不允许修改', {
					icon : 0
				});
				return;
			}

			bt.fn.showModify('修改公告', [ '700px', '640px' ], $("#modify_data_div").html(), data, function(layero, index) {
				var $input_topFlag = layero.find("input[name=" + "topFlag" + "]");
				layero.find("[name=" + "rank" + "]").val(data.rank);
				if (data.topFlag == "1") {
					$input_topFlag.iCheck('check');
				} else {
					$input_topFlag.iCheck('uncheck');
				}
				var $status = layero.find("[name=" + "status" + "]");
				if ($status == "录入") {
					$input_topFlag.attr("disabled");
				}
				var content = data.content;
				$(layero).find("textarea[name=content]").val(content);

				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg);
					}
				});
			});
		}
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看公告 ', [ '700px', '350px' ], $("#view_data_div").html(), data, function(layero, index) {
				if (data.status == "10") {
					$(layero).find("span[name=status]").text("录入");
				}
				if (data.status == "20") {
					$(layero).find("span[name=status]").text("发布");
				}
				if (data.status == "30") {
					$(layero).find("span[name=status]").text("作废");
				}
				if (data.rank == "10") {
					$(layero).find("span[name=rank]").text("紧急");
				}
				if (data.rank == "20") {
					$(layero).find("span[name=rank]").text("重要");
				}
				if (data.rank == "30") {
					$(layero).find("span[name=rank]").text("一般");
				}
				if (data.topFlag == "1") {
					$(layero).find("span[name=topFlag]").text("是");
				}
				if (data.topFlag == "0") {
					$(layero).find("span[name=topFlag]").text("否");
				}
			});
		}
	}, {
		id : "btn_publish",
		icon : "fa-leanpub",
		text : "发布",
		visible : true,
		disable : false,
		click : function(data) {
			// 获取选中的id
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				top.layer.alert("请选择您要发布的公告！", {
					icon : 0
				});
				return;
			} else if (ids.length > 1) {
				top.layer.alert("对不起，只能选择一行公告进行修改！", {
					icon : 0
				});
				return false;
			}
			var selectIds = [];
			// 所有的checkbox按钮
			var $selectCheck = $("#dataTable_wrapper .selected");
			if ($selectCheck && $selectCheck.length > 1 || $selectCheck.length == 0) {
				top.layer.alert("只能选择一条公告！", {
					icon : 1
				});
				return false;
			} else {
				if ($selectCheck.find("td:eq(3)").html() == "发布") {
					top.layer.alert("该公告已发布！", {
						icon : 0
					});
					return false;
				} else {
					layer.confirm('您是否要发布该公告？', {
						btn : [ '确定', '取消' ],
						icon : 3
					}, function(index) {
						layer.close(index);
						ajaxToNoticeReLoad("announcementAsync.htm", ids, "发布");
					}, function(index) {
						layer.close(index);
					});
				}
			}
		}
	}, {
		id : "btn_undo",
		text : "撤销发布",
		icon : "fa-strikethrough",
		visible : true,
		disable : false,
		click : function(data) {
			// 获取选中的id
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				top.layer.alert("请选择您要撤销发布的公告！", {
					icon : 0
				});
				return;
			} else if (ids.length > 1) {
				top.layer.alert("对不起，只能选择一行公告进行操作！", {
					icon : 0
				});
				return false;
			}
			var selectIds = [];
			// 所有的checkbox按钮
			var $selectCheck = $("#dataTable_wrapper .selected");
			if ($selectCheck && $selectCheck.length > 1 || $selectCheck.length == 0) {
				top.layer.alert("只能选择一条公告！", {
					icon : 1
				});
				return false;
			} else {
				if ($selectCheck.find("td:eq(3)").html() == "录入") {
					top.layer.alert("该公告已录入，不允许撤销发布！", {
						icon : 3
					});
					return false;
				} else {
					layer.confirm('您是否要对该公告撤销发布？', {
						btn : [ '确定', '取消' ],
						icon : 3
					}, function(index) {
						layer.close(index);
						ajaxToNoticeReLoad("cancelAnnouncementAsync.htm", ids, "撤销发布");
					}, function(index) {
						layer.close(index);
					});
				}
			}
		}
	}, {
		id : "btn_invalid",
		text : "作废",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(data) {

			// 获取选中的id
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				top.layer.alert("请选择您要作废的公告！", {
					icon : 0
				});
				return;
			} else if (ids.length > 1) {
				top.layer.alert("对不起，只能选择一行公告进行修改！", {
					icon : 0
				});
				return false;
			}
			var selectIds = [];
			// 所有的checkbox按钮
			var $selectCheck = $("#dataTable_wrapper .selected");
			if ($selectCheck && $selectCheck.length > 1 || $selectCheck.length == 0) {
				top.layer.alert("只能选择一条公告！", {
					icon : 1
				});
				return false;
			} else {
				if ($selectCheck.find("td:eq(3)").html() == "发布") {
					top.layer.alert("该公告已发布，不允许作废！", {
						icon : 0
					});
					return false;
				} else {
					layer.confirm('您是否要作废此公告？', {
						btn : [ '确定', '取消' ],
						icon : 3
					}, function(index) {
						layer.close(index);
						ajaxToNoticeReLoad("setNoticCacnelAsync.htm", ids, "作废");
					}, function(index) {
						layer.close(index);
					});
				}
			}

		}
	}, {
		id : "btn_preview",
		text : "预览",
		icon : "fa-eye",
		visible : true,
		disable : false,
		click : function(data) {
			// 获取选中的id
			var sid = bt.fn.getSelectIds();
			if (sid.length == 0) {
				top.layer.alert("请选择您要预览的公告！", {
					icon : 0
				});
				return;
			}
			// iframe层
			top.layer.open({
				type : 2,
				title : '预览公告',
				shadeClose : true,
				shade : 0.8,
				maxmin : true,
				area : [ '700px', '500px' ],
				content : 'iu/notice/noticePreview.html?sid=' + sid + '',
				success : function(layero, index){
					$(".layui-layer-min", layero).addClass("hide");
				}
			});
		}
	} ];
	// 初始化所有元素
	bt.fn.init(function() {
	});

	/**
	 * 请求方法<br>
	 * 
	 * @author 陈培坤<br>
	 *         2016年10月19日19:22:12<br>
	 */
	function ajaxToNoticeReLoad(url, ids, operate) {
		$.ajax({
			type : 'POST',
			url : url,
			data : {
				"id" : ids
			},
			dataType : "json",
			traditional : true,
			success : function(data, textStatus, jqXHR) {
				if (data.success) {
					// 刷新数据源
					bt.fn.reload(true);
					top.layer.alert(operate + "成功！", {
						icon : 1
					}, function(index, layero) {
						parent.layer.close(index);
					});
				} else {
					top.layer.alert(data.errorMsg, {
						icon : 2
					});
				}
			}
		});
	}

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
				"title" : {
					required : true,
					maxlength : 40
				},
				"content" : {
					required : true
				},
				"rank" : {
					required : true
				},
				"notes" : {
					maxlength : 200
				},
				"matureDate" : {
					required : true
				}
			},
			messages : {
				"title" : {
					required : "公告标题不能为空",
					maxlength : "公告标题不能超过40个字符"
				},
				"content" : {
					required : "公告内容不能为空"
				},
				"rank" : {
					required : "公告级别不能为空",
				},
				"notes" : {
					required : "公告备注不能为空",
					maxlength : "公告备注不能超过200个字符"
				},
				"matureDate" : {
					required : "到期日期不能为空"
				}
			}
		});
	}
});

/**
 * 置顶的判断<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月19日21:35:19<br>
 */
function topSetOrCancle(obj) {
	var id = $(obj).parent().parent().find("td:first").find("input").attr("value");
	var handle = $(obj).attr("data-type");
	if (handle == "cancle") {// 取消操作
		layer.confirm('您是否要对该公告取消置顶？', {
			btn : [ '确定', '取消' ],
			icon : 3
		}, function(index) {
			layer.close(index);
			ajaxToNotice("cancelTopAsync.htm", id, "取消置顶", obj, "cancleHandle");
		}, function(index) {
			layer.close(index);
		});
	} else if (handle == "set") {// 置顶操作
		layer.confirm('您是否要置顶该公告？', {
			btn : [ '确定', '取消' ],
			icon : 3
		}, function(index) {
			layer.close(index);
			ajaxToNotice("setTopAsync.htm", id, "置顶", obj, "setHandle");
		}, function(index) {
			layer.close(index);
		});
	}
}

/**
 * 请求公告方法<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月19日19:22:12<br>
 */
function ajaxToNotice(url, ids, operate, obj, status) {
	$.ajax({
		type : 'POST',
		url : url,
		data : {
			"id" : ids
		},
		dataType : "json",
		traditional : true,
		success : function(data, textStatus, jqXHR) {
			if (data.success) {
				top.layer.alert(operate + "成功！", {
					icon : 1
				}, function(index, layero) {
					top.layer.close(index);
				});
				if (obj != null) {
					if (status == "cancleHandle") {
						$(obj).attr("data-type", "set");
						$(obj).text("置顶");
						$(obj).parent().parent().find("td:first").next().next().next().next().next().text("否");
					} else if (status == "setHandle") {
						$("tr[role=row]").each(function() {
							if ($(this)[0] != ($(obj).parent().parent())[0]) {
								$(this).find("td:first").next().next().next().next().next().text("否");
								if ($(this).find("td:first").next().next().next().text() == "发布") {
									$(this).find("td:last").find("a").attr("data-type", "set");
									$(this).find("td:last").find("a").text("置顶");
								} else {
									$(this).find("td:last").empty();
								}
							}
						});
						$(obj).attr("data-type", "cancle");
						$(obj).text("取消置顶");
						$(obj).parent().parent().find("td:first").next().next().next().next().next().text("是");
					}
				}

			} else {
				top.layer.alert(data.errorMsg, {
					icon : 2
				});
			}
		}
	});
}
