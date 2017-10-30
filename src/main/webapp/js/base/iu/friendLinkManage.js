var adsCode = "${adsCode}";
$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/iu/friendLink/";
	bt.config.toolbar.search = "标题/网址";// 右上角搜索框的提示语句
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.fixedParam = {
			adsCode : function() {
			return adsCode;
		}
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq,  {
		data : 'adType',
		title : '广告类型'
	}, {
		data : 'adTitle',
		title : '标题'
	}, {
		data : 'attachmentId',
		title : '图片',
		width : "100px",
		render : function(data, type, row, meta) {
			var imgHtml = '';
			imgHtml += '<div style="height:60px;"><img src="' + basePath + 'fileserver/loadImage/' + data + '" style="height: 60px;max-width:100px;"></div>';
			return imgHtml;
		}
	}, {
		data : 'url',
		title : '网址'
	}, {
		data : 'notes',
		title : '备注',
	}, {
		data : 'createEName',
		title : '创建人'
	}, {
		data : 'createDate',
		title : '创建时间'
	}, {
		data : 'updateEName',
		title : '修改人'
	}, {
		data : 'updateDate',
		title : '修改时间'
	} ];
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "文字";
			} else if (data == "20") {
				return "图片";
			}else {
				return "";
			}
		},
		targets : [ 3 ]
	} ];
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '700px', '470px' ], $("#add_data_div").html(), function(layero, index) {
				$("#adsCode", layero).val(adsCode);
				
				// 点击广告类型显示或隐藏上传图片
				$("#adType2", layero).on('ifChecked', function(event) {
					$("#pic", layero).removeClass("hide");
					$("#pic", layero).find("input[type=hidden]").removeAttr("disabled");
					
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				});
				$("#adType1", layero).on('ifChecked', function(event) {
					$("#pic", layero).addClass("hide");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				});
				
				// 判断初始化时选中的广告类型
				$("#pic", layero).removeClass("hide");
				$("#adTitle", layero).removeAttr("required");
				$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				
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
						top.layer.alert(result.errorMsg);
					}
				}, true);
			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '700px', '560px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$(".fileinput-return", layero).append('<img src="' + basePath + 'fileserver/loadImage/' + data.attachmentId + '" style="height: 100px;width:120px;" class="img-thumbnail">');
				$("#adsCode", layero).val(adsCode);
				
				// 点击广告类型显示或隐藏上传图片
				$("#adType2", layero).on('ifChecked', function(event) {
					$("#pic", layero).removeClass("hide");
					$("#pic", layero).find("input[type=hidden]").removeAttr("disabled");
					
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				});
				$("#adType1", layero).on('ifChecked', function(event) {
					$("#pic", layero).addClass("hide");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				});
				
				// 判断初始化时选中的广告类型
				if ($("#adType2", layero).is(':checked')) {
					$("#pic", layero).removeClass("hide");
					$("#adTitle", layero).removeAttr("required");
					$("#adTitle", layero).parent().parent().find("label").removeClass("required");
				} else if ($("#adType1", layero).is(':checked')) {
					$("#pic", layero).addClass("hide");
					$("#attachmentId", layero).val("");
					$("#pic", layero).find("input[type=hidden]").attr("disabled", "disabled");
					
					$("#adTitle", layero).attr("required", "required");
					$("#adTitle", layero).parent().parent().find("label").addClass("required");
				}
				
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
						top.layer.alert(result.message);
					}
				});
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false
	}, {
		id : "btn_up",
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
						url : basePath + "iu/adMaterial/changeOrderNo.htm",
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
						url : basePath + "iu/adMaterial/changeOrderNo.htm",
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
	function fromSubmit(from, submifun, isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"adTitle" : {
					maxlength : 40
				},
				"url" : {
					required : true,
					maxlength : 200
				}
			},
			messages : {
				"adTitle" : {
					required : "标题不允许为空",
					minlength : "标题不能超过40个字符"
				},
				"url" : {
					required : "网址不允许为空",
					minlength : "网址不能超过200个字符"
				},
				"attachmentId" : {
					required : "图片不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["adTitle"].remote = {
				url : basePath + "iu/friendLink/checkTitle.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["adTitle"].remote = "标题不允许重复，请重新录入";
		}

		return from.validate(v);
	}

});
