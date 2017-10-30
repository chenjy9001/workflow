var typeCodeJS;
var typeNameJS;
var typeLeave;
$(function() {
	var bt = new baothink();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "iu/helpColumnContent/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			if(!typeLeave || typeLeave == "1"){
				parent.layer.alert("请选择需添加内容的栏目", {icon : 0,title : "提示"});
				return false;
			}else if(typeLeave == "3" || typeLeave == "2"){
				//需要判断是否在该2、3栏目下已存在内容，如果存在，则不允许在添加
				$.ajax({
					type : 'POST',
					dataType : "json",
					url : basePath+"iu/helpColumnContent/checkContentByCode.htm",
					data : {"columnCode" : typeCodeJS},
					success : function(data) {
						if(data.success){
							bt.fn.showAdd('新增数据 ', [ '650px', '570px' ], $("#add_data_div").html(), function(layero, index) {
								$("#columnCode",layero).val(typeCodeJS);
								fromSubmit($("#add_data_form", layero), function(data) {
									parent.layer.close(index);
									var result = JSON.parse(data);
									if (result.success) {
										parent.layer.alert('保存成功！', {
											icon : 1,
											title : "提示"
										}, function(index, layero) {
											// 刷新树的数据
											$("#btn_refresh_tree").trigger('click');
											bt.fn.reload(true);
											parent.layer.close(index);
										});
									} else {
										parent.layer.alert(result.errorMsg, {
											icon : 3,
											title : "提示"
										});
									}
								}, true);
							});
						}else{
							parent.layer.alert(data.errorMsg, {
								icon : 3,
								title : "提示"
							});
						}
					}
				});
			}
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '650px', '650px' ], $("#modify_data_div").html(), data, function(layero, index) {
				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新树的数据
							$("#btn_refresh_tree").trigger('click');
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						parent.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
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
		click : function(ids){
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
								$("#btn_refresh_tree").trigger('click');
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
			bt.fn.showView('查看数据 ', [ '600px', '350px' ], $("#view_data_div").html(), data, function(layero, index) {
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isShow":
							switch (value) {
							case "0":
								$input.text("隐藏");
								break;
							case "1":
								$input.text("显示");
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
				top.layer.alert("请选择您要预览的栏目内容！", {
					icon : 0
				});
				return;
			}
			// iframe层
			top.layer.open({
				type : 2,
				title : '预览栏目内容',
				shadeClose : true,
				shade : 0.8,
				maxmin : true,
				area : [ '700px', '500px'],
				content : 'iu/helpColumnContent/helpColumnContentPreview.html?id=' + sid + '',
				success : function(layero, index) {
					$(".layui-layer-min", layero).addClass("hide");
				}
			});
		}
	} ];
	bt.config.toolbar.search = "标题";// 右上角搜索框的提示语句
	bt.config.datatables.fixedParam = {// 固定默认查询条件
		userType : "10"
	}
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'title',
		className : "text-center",
		width:'60%',
		title : '标题'
	}, {
		data : 'isShow',
		className : "text-center",
		title : '是否显示',
		format : {
			0 : "隐藏",
			1 : "显示",
			"" : "隐藏"
		},
		exportIgnore : true
	}];
	bt.config.form = {};
	// 行选中事件
	bt.event.rowClick = function(row) {
	}
	bt.config.datatables.paging = true;// 是否分页，默认true
	//点击左侧菜单树
	bt.event.treeClick = function(node){
		if(node){
			var value = {"id":node.id};
			typeCodeJS = node.id;
			typeLeave = node.parents.length;
			typeNameJS = node.text;
			$.extend(value, {
				isHasChildNode : (node.children.length > 0)
			});
		}
		bt.fn.clearMainSelectRows();
		bt.fn.search(true, value);
		if (bt.config.pageType == '21') {
			bt.fn.reloadSubTab(true);
		}
	}
	
	bt.fn.init(function(table) {
	});

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 */
	function fromSubmit(from, submifun,isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"title" : {
					required : true,
					maxlength : 50
				},
				"content" : {
					required : true
				},
				"notes" : {
					maxlength:400
				}
			},
			messages : {
				"title" : {
					required : "标题不允许为空",
					maxlength : "标题不能超过50个字符"
				},
				"content" : {
					required : "内容不允许为空"
				},
				"notes" : {
					maxlength : "备注不能超过400个字符"
				}
			}
		};
		return from.validate(v);
	}
});