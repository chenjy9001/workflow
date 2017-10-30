var treeSub;
var bt;
var record;
$(function() {
	bt = new baothink();
	treeSub = new treeSubppert();
	bt.config.url.namespace = "/iu/deskwork/";
	bt.config.pageType = '11';
	bt.config.toolbar.search = "标题";
	bt.config.visible.splitter = true;
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
		data : function() {
			var dataVal = "";
			$(".jstree-anchor").each(function() {
				if ($(this).hasClass("jstree-clicked")) {
					dataVal = $(this).parent().attr("id");
				}
			});

			return dataVal;
		}
	};
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		serType : "id"
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		className : "text-center",
		data : 'serTypeName',
		title : '文案类型'
	}, {
		className : "text-center",
		data : 'serName',
		title : '标题'
	}, {
		className : "text-center",
		data : 'isShow',
		title : '是否启用',
		render : function(data, type, row, meta) {
			record = data;
			if (data == "1") {
				return "是";
			} else if (data == "0") {
				return "否";
			}
		}
	},{
		className : "text-center",
		title : "操作",
		render : function(data, type, row, meta) {
			var html = '';
			var name = "";
			if (record == "1") {
				name = "禁用";
				html += '  <a class="btn btn-primary btn-xs" data-type="false" onClick="treeSub.setIsShow(this);" >';
			} else {
				name = "启用";
				html += '  <a class="btn btn-primary btn-xs" data-type="true" onClick="treeSub.setIsShow(this);" >';
			}
			html += name;
			html += '</a>';
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

			var node = bt.fn.getSelectTreeNodes();
			if (!node || !node[0] || node[0].parent == "#") {
				top.layer.alert("请选择文案类型！", {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增文案 ', [ '750px', '600px' ], $("#add_data_div").html(), function(layero, index) {

				// 赋值文案类型和代码
				$("#code", layero).val(node[0].id);
				$("#name", layero).val(node[0].text);

				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						if (result.data && result.data.hasFlag == false) {
							top.layer.confirm("保存成功！相同类型的文案只能有一个为启用状态，是否启用当前文案？", {
								btn : [ '是', '否' ],
								icon : 1
							}, function() {
								// 启用方法
								treeSub.changeIsFlag(result.data.id);
							}, function() {
								// 禁用方法
								treeSub.changeOwnFlag(result.data.id);
							});
						} else {
							top.layer.alert('保存成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新树的数据
								treeSub.bettering();
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
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
			bt.fn.showModify('修改文案 ', [ '750px', '600px' ], $("#modify_data_div").html(), data, function(layero, index) {
				// 赋值文案类型和代码
				$("#code", layero).val(data.code);
				$("#name", layero).val(data.name);
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						if (result.data && result.data.hasFlag == false) {
							top.layer.confirm("修改成功！相同类型的文案只能有一个为启用状态，是否启用当前文案？", {
								btn : [ '是', '否' ],
								icon : 1
							}, function() {
								// 启用方法
								treeSub.changeIsFlag(result.data.id);
							}, function() {
								// 禁用方法
								treeSub.changeOwnFlag(result.data.id);
							});
						} else {
							top.layer.alert('修改成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新树的数据
								treeSub.bettering();
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
					} else {
						top.layer.alert(result.errorMsg);
					}
				});
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(ids) {
			/**
			 * 重写删除方法,原有方法增加刷新树数据<br>
			 * 
			 * @author 陈培坤 2016年10月22日10:44:37
			 */
			top.layer.confirm("您确认要删除这" + ids.length + "条数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + bt.config.url.deleteAsync,
					data : {
						"ids" : ids
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.alert("删除成功！", {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新树的数据
								treeSub.bettering();
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						} else {
							top.layer.alert(data.errorMsg, {
								icon : 2,
								title : "删除失败"
							});
						}
					},
					dataType : "json",
					traditional : true
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
			bt.fn.showView('查看文案 ', [ '700px', '300px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#name", layero).val(data.name);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isShow":
							switch (value) {
							case "1":
								$input.text("启用");
								break;
							case "0":
								$input.text("禁用");
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
		id : "btn_preview",
		text : "预览",
		icon : "fa-eye",
		visible : true,
		disable : false,
		click : function(data) {
			// 获取选中的id
			var sid = bt.fn.getSelectIds();
			if (sid.length == 0) {
				top.layer.alert("请选择您要预览的文案！", {
					icon : 0
				});
				return;
			}
			// iframe层
			top.layer.open({
				type : 2,
				title : '预览文案',
				shadeClose : true,
				shade : 0.8,
				maxmin : true,
				area : [ '700px', '500px'],
				content : 'iu/deskwork/deskworkPreview.html?sid=' + sid + '',
				success : function(layero, index) {
					$(".layui-layer-min", layero).addClass("hide");
				}
			});
		}
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
	});
	// 初始化树控制对象
	treeSub.init();

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
				"serName" : {
					required : true,
					maxlength : 40
				},
				"serContent" : {
					required : true
				},
				"name" : {
					required : true
				}
			},
			messages : {
				"serName" : {
					required : "标题不允许为空",
					maxlength : "标题不能超过40个字符"
				},
				"serContent" : {
					required : "内容不允许为空"
				},
				"name" : {
					required : "文案类型不允许为空"
				}
			}
		});
	}
});

/**
 * 树控制对象<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月21日11:52:41<br>
 */
var treeSubppert = function() {
	var treeS = {
		// 记录一级和二级菜单的所有list数据
		copyData : null,
		// 一级菜单的数据
		parentData : null,
		// 二级菜单的数据
		childerData : null,
		// 初始化
		init : function() {
			$.ajax({// 获取二级菜单内容
				type : "POST",
				url : basePath + "iu/deskwork/getDataDiction.htm",
				dataType : "json",
				success : function(response) {
					if (response.success && response.data != null && response.data.length > 0) {
						treeS.copyData = response.data;
					}
				}
			});
		},
		// 刷新树数据
		bettering : function() {
			$("#btn_refresh_tree").trigger('click');
		},
		changeIsFlag : function(id) {
			$.ajax({
				type : 'POST',
				url : basePath + 'iu/deskwork/changeIsFlag.htm',
				data : {
					"id" : id
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						top.layer.alert("启用成功！", {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							treeS.bettering();
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
						});
					} else {
						top.layer.alert("启用失败！", {
							icon : 2,
							title : "提示"
						});
					}
				}
			});
		},
		changeOwnFlag : function(id, flag) {
			$.ajax({
				type : 'POST',
				url : basePath + 'iu/deskwork/changeOwnIsFlag.htm',
				data : {
					"id" : id
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if(flag){
						top.layer.alert("禁用成功！", {
							icon : 1,
							title : "提示"
						}, function(index, layero){
							treeS.bettering();
							bt.fn.reload(true);
							top.layer.close(index);
						});
					}else{
						treeS.bettering();
						bt.fn.reload(true);
						top.layer.close();
					}
				}
			});
		},
		setIsShow : function(data){
			var id = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
			if($(data)[0].innerHTML == "启用"){
				top.layer.confirm("相同类型的文案只能有一个为启用状态，是否启用？", {
					icon : 3
				}, function() {
					// 启用方法
					treeS.changeIsFlag(id);
				});
			}else if($(data)[0].innerHTML == "禁用"){
				top.layer.confirm("是否禁用当前文案？", {
					icon : 3
				}, function() {
					// 禁用方法
					treeS.changeOwnFlag(id, true);
				});
			}
		}
	}
	return treeS;
}
