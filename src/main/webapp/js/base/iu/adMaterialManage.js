var adsWidthInit;
var adsHeightInit;
var adsNameInit;
$(function() {
	var bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/iu/adMaterial/";// url命名空间
	bt.config.visible.searchbar = false;// 默认为true
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.toolbar.btnGroup = true;// 按钮是否组合,默认false
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		aid : "sub_btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			if (bt.fn.getMainSelectRows() == undefined) {
				top.layer.alert("请先选择广告位", {
					icon : 0
				});
				return;
			}

			var adCount = bt.fn.getMainSelectRows().adCount;
			if ($("#dataTable tbody tr").length >= adCount && adCount != 0) {
				top.layer.alert("对不起，无法新增广告，该广告位的广告个数最大为" + adCount + "个！", {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增广告物料 ', [ '700px', '560px' ], $("#add_data_div").html(), function(layero, index) {

				// 点击广告类型显示或隐藏上传图片
				$("#adType2", layero).on('ifChecked', function(event) {
					$("#pic", layero).removeClass("hide");
					$("#pic", layero).find("input[type=hidden]").removeAttr("disabled");
					
					$("#size", layero).removeClass("hide");
					$("#adWidth", layero).removeAttr("disabled");
					$("#adHeight", layero).removeAttr("disabled");
					
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				});
				$("#adType1", layero).on('ifChecked', function(event) {
					$("#pic", layero).addClass("hide");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#size", layero).addClass("hide");
					$("#adWidth", layero).attr("disabled", "disabled");
					$("#adHeight", layero).attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				});
				
				// 判断初始化时选中的广告类型
				if ($("#adType2", layero).is(':checked')) {
					$("#pic", layero).removeClass("hide");
					$("#size", layero).removeClass("hide");
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				} else if ($("#adType1", layero).is(':checked')) {
					$("#pic", layero).addClass("hide");
					$("#attachmentId", layero).val("");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#size", layero).addClass("hide");
					$("#adWidth", layero).attr("disabled", "disabled");
					$("#adHeight", layero).attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				}

				// 获取主表广告位代码
				var adsCode = bt.fn.getMainSelectRows().adsCode;
				var adsName = bt.fn.getMainSelectRows().adsName;
				$("#adsCode", layero).val(adsCode);
				$("#adsName", layero).val(adsName);

				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 3,
							title : "提示"
						});
					}
				}, true, adsCode, null, bt.fn.getMainSelectRows().adsWidth, bt.fn.getMainSelectRows().adsHeight);
			});
		}
	}, {
		id : "btn_modify",
		aid : "sub_btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改广告物料 ', [ '700px', '650px' ], $("#modify_data_div").html(), data, function(layero, index) {

				if(bt.fn.getMainSelectRows()){
					adsNameInit = bt.fn.getMainSelectRows().adsName;
					adsWidthInit = bt.fn.getMainSelectRows().adsWidth;
					adsHeightInit = bt.fn.getMainSelectRows().adsHeight;
				}
				$("#adsName", layero).val(adsNameInit);

				// 点击广告类型显示或隐藏上传图片
				$("#adType2", layero).on('ifChecked', function(event) {
					$("#pic", layero).removeClass("hide");
					$("#pic", layero).find("input[type=hidden]").removeAttr("disabled");
					
					$("#size", layero).removeClass("hide");
					$("#adWidth", layero).removeAttr("disabled");
					$("#adHeight", layero).removeAttr("disabled");
					
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				});
				$("#adType1", layero).on('ifChecked', function(event) {
					$("#pic", layero).addClass("hide");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#size", layero).addClass("hide");
					$("#adWidth", layero).attr("disabled", "disabled");
					$("#adHeight", layero).attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				});
				
				// 判断初始化时选中的广告类型
				if ($("#adType2", layero).is(':checked')) {
					$("#pic", layero).removeClass("hide");
					$("#size", layero).removeClass("hide");
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				} else if ($("#adType1", layero).is(':checked')) {
					$("#pic", layero).addClass("hide");
					$("#attachmentId", layero).val("");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#size", layero).addClass("hide");
					$("#adWidth", layero).attr("disabled", "disabled");
					$("#adHeight", layero).attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				}
				// 判断是否有图片，有则显示
				if (data.attachmentId) {
					$(".fileinput-return", layero).append('<img src="' + basePath + 'fileserver/loadImage/' + data.attachmentId + '" style="height: 100px;width:120px;" class="img-thumbnail">');
				}

				$("#notes", layero).val(data.notes);
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
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
				}, false, data.adsCode, data.adTitle, adsWidthInit, adsHeightInit);
			});
		}
	}, {
		id : "btn_delete",
		aid : "sub_btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false
	}, {
		id : "btn_view",
		aid : "sub_btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看广告物料详细信息 ', [ '700px', '630px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				
				if(bt.fn.getMainSelectRows()){
					adsNameInit = bt.fn.getMainSelectRows().adsName;
				}
				$("#adsName", layero).html(adsNameInit);
				if (data.adType == "10") {
					$("#pic", layero).addClass("hide");
					$("#size", layero).addClass("hide");
				} else if (data.adType == "20") {
					$("#img", layero).attr("src", "" + basePath + "fileserver/loadImage/" + data.attachmentId + "");
				}
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "adType":
							switch (value) {
							case "10":
								$input.text("文字");
								break;
							case "20":
								$input.text("图片");
								break;
							}
							break;
						default:
							$input.val(value);
						}
					}
				});
			});
		}
	}, {
		id : "btn_up",
		aid : "sub_btn_up",
		text : "上移",
		icon : "fa-level-up",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要移动的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (ids.length > 1) {
				var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，一次只能移动一行数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}

			var rowIndex = bt.config.datatables.tag.find("input[type=checkbox].trCheck:checked").attr("data-row");
			if (rowIndex == 0) {
				return;
			}

			// 加载数据
			$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
				"id" : ids[0]
			}, function(result, textStatus, jqXHR) {
				if (result.success) {
					$.ajax({
						type : 'POST',
						url : "changeOrderNo.htm",
						data : {
							"id" : result.data.id,
							"flag" : "up",
							"index" : rowIndex
						},
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							if (data.success) {
								// 刷新数据源
								bt.fn.reload(true);
							}
						}
					});
				} else {
					top.layer.alert(result.errorMsg, {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	}, {
		id : "btn_down",
		aid : "sub_btn_down",
		text : "下移",
		icon : "fa-level-down",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要移动的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (ids.length > 1) {
				var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，一次只能移动一行数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			var rowIndex = bt.config.datatables.tag.find("input[type=checkbox].trCheck:checked").attr("data-row");
			if ($("#dataTable tbody tr").length == Number(rowIndex) + 1) {
				return;
			}
			// 加载数据
			$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
				"id" : ids[0]
			}, function(result, textStatus, jqXHR) {
				if (result.success) {

					$.ajax({
						type : 'POST',
						url : "changeOrderNo.htm",
						data : {
							"id" : result.data.id,
							"flag" : "down",
							"index" : rowIndex
						},
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							if (data.success) {
								// 刷新数据源
								bt.fn.reload(true);
							}
						}
					});
				} else {
					top.layer.alert(result.errorMsg, {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	} ];
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'adType',
		title : '广告类型'
	}, {
		data : 'adTitle',
		title : '广告标题'
	}, {
		data : 'attachmentId',
		title : '广告图片',
		render : function(data, type, row, meta) {
			if (data) {
				return "<img src='" + basePath + "fileserver/loadImage/" + data + "' style='max-height:70px;' />";
			} else {
				return "";
			}
		}
	}, {
		data : 'adWidth',
		title : '广告宽度(px)'
	}, {
		data : 'adHeight',
		title : '广告高度(px)'
	}, {
		data : 'url',
		title : '点击链接'
	}, {
		data : 'notes',
		title : '备注'
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "文字";
			} else if (data == "20") {
				return "图片";
			}
		},
		targets : [ 3 ]
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
	});

	bt.event.mainDataTablesClick = function(tr, rowData) {
		adsWidthInit = tr.adsWidth;
		adsHeightInit = tr.adsHeight;
		adsNameInit = tr.adsName;
	};
	
	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun, isAdd, adsCode, initAdTitle, adsWidth, adsHeight) {
		var v = {
			submitHandler : function(form) {

				// 如果选择的广告类型是文字，则把附件id的值清空
				if ($(form[2]).is(':checked')) {
					$(form[7]).val("");
				}
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"adsCode" : {
					required : true
				},
				"adTitle" : {},
				"sort" : {
					required : true
				},
				"adWidth" : {
					digits : true,
					range : [1, Number(adsWidth)]
				},
				"adHeight" : {
					digits : true,
					range : [1, Number(adsHeight)]
				}
			},
			messages : {
				"adTitle" : {

				},
				"adWidth" : {
					range : "不能超过广告位宽度"
				},
				"adHeight" : {
					range : "不能超过广告位高度"
				}
			}
		};
		v.rules["adTitle"].remote = {
			url : basePath + "iu/adMaterial/judgeIsExists.htm?adsCode=" + adsCode + "&initAdTitle=" + initAdTitle + "",
			type : "post",
			dataType : "json"
		};
		v.messages["adTitle"].remote = "广告标题不允许重复";
		return from.validate(v);
	}
});

/**
 * 点击预览图片
 * 
 * @param data
 */
function preview(data) {
	top.layer.open({
		type : 1,
		title : false,
		closeBtn : 1,
		area : [ '700px', '450px' ],
		shadeClose : true,
		content : '<div style="width:100%;height:100%"><img src="' + data.src + '" style="width:100%;height:100%"/></div>'
	});
}
