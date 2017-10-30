$(function() {

	var bt = new baothink();
	bt.config.url.namespace = "/iu/basis/sccj/";
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '600px','400px;' ], $("#add_data_div").html(), function(layero, index) {
				$("#sccjName",layero).keyup(function(){
					var sccjName = $.trim($(this).val());
					if (sccjName!="") {
						$.ajax({
							url : basePath+ "iu/basis/sccj/getPinyinByName.htm",
							data : {"chinese":sccjName},
							type : 'POST',
							dataType : 'json',
							success : function(data) {
								if (data && data.success) {
									$("#pinyinName",layero).val(data.data);
								}
							}
						});
					}else{
						$("#pinyinName",layero).val("");
					}
				});
				
				fromSubmit($("#add_data_form", layero), function(data) {
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(aindex, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(aindex);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
						top.layer.close(index);
					}
				},true);
			});
		}
	}, {
		id : "btn_modify",
		visible : true,
		click : function(data) {
			var rows = bt.fn.getSelectRows();
			bt.fn.showModify('修改数据 ', [ '700px', '500px' ], $("#modify_data_div").html(), data, [ '保存', '关闭' ], function(layero, index) {
				$("#sccjName",layero).keyup(function(){
					var sccjName = $.trim($(this).val());
					if (sccjName!="") {
						$.ajax({
							url : basePath+ "iu/basis/sccj/getPinyinByName.htm",
							data : {"chinese":sccjName},
							type : 'POST',
							dataType : 'json',
							success : function(data) {
								if (data && data.success) {
									$("#pinyinName",layero).val(data.data);
								}
							}
						});
					}else{
						$("#pinyinName",layero).val("");
					}
				});
				fromSubmit($("#modify_data_form", layero), function(data) {
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(aindex, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(aindex);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
						top.layer.close(index);
					}
				});
			});
		}
	}, {
		id : "btn_delete"
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '600px', '470px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#viewImg",layero).attr("src",""+basePath+"fileserver/loadImage/"+data.sccjLogo+"");
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "oftenUseFlag":
							switch (value) {
							case "10":
								$input.text("常用");
								break;
							case "20":
								$input.text("不常用");
								break;
							}
							break;
						case "validFlag":
							switch (value) {
							case "0":
								$input.text("禁用");
								break;
							case "1":
								$input.text("启用");
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
		id : "btn_refresh",
		text : "刷新",
		icon : "fa-refresh",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.reload(false);
		}
	} ];
	bt.config.toolbar.search = "钢厂代码/钢厂名称/钢厂拼音";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		sccjCode : function() {
			return $("#search_sccjCode").val();
		},
		sccjName : function() {
			return $("#search_sccjName").val();
		},
		pinyinName : function() {
			return $("#search_pinyinName").val();
		},
	};
	bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.multiSelect = true;// 是否允许选择多行，默认false
	bt.config.datatables.fixedParam = {// 固定默认查询条件
		userType : "10"
	}
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'sccjLogo',
		title : 'Logo',
		className : "text-center",
		width:"4%",
		render : function(data, type, row, meta){
			return '<div style="border-radius: 100%;width: 40px;height:40px;margin:0 0;overflow:hidden"><img src="'+basePath+'fileserver/loadImage/'+data+'" style="width:40px;height:40px;"/></div>';
		}
	},{
		data : 'sccjCode',
		title : '钢厂代码',
		className : "text-center",
		width:"23%",
		required : true
	}, {
		data : 'sccjName',
		title : '钢厂名称',
		className : "text-center",
		width : "25%",
		required : true
	}, {
		data : 'pinyinName',
		title : '钢厂拼音',
		className : "text-center",
		width : "20%"
	}, {
		data : 'oftenUseFlag',
		title : '是否常用',
		width : "10%",
		className : "text-center",
		format : {
			10 : "常用",
			20 : "不常用",
			"" : "不常用"
		},
		exportIgnore : true
	}, {
		data : 'validFlag',
		title : '是否启用',
		width : "10%",
		className : "text-center",
		format : {
			1 : "启用",
			0 : "禁用",
			"" : "禁用"
		},
		exportIgnore : true
	}];

	bt.config.form = {
		data : {
			oftenUseFlag : {
				list : [ {
					id : '10',
					text : "常用"
				}, {
					id : '20',
					text : "不常用"
				} ],
				value : '10'
			},
			validFlag : {
				list : [ {
					id : '1',
					text : "启用"
				}, {
					id : '0',
					text : "禁用"
				} ],
				value : '1'
			}
		}
	};
	// 初始化所有元素
	bt.fn.init(function(table) {
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
	function fromSubmit(from, submifun,isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				sccjCode : {
					required : true,
					maxlength : 20
				},
				sccjName : {
					required : true,
					maxlength : 40
				},
				pinyinName : {
					maxlength : 100
				},
				notes : {
					maxlength : 400
				}
			},
			messages : {
				"sccjCode" : {
					required : "钢厂代码不允许为空",
					maxlength : "钢厂代码不能超过20个字符"
				},
				"sccjName" : {
					required : "钢厂名称不允许为空",
					maxlength : "钢厂名称不能超过40个字符"
				},
				"pinyinName" : {
					maxlength : "钢厂拼音不能超过100个字符"
				},
				"notes" : {
					maxlength : "备注不能超过400个字符"
				}
			}
		};
		if(isAdd == true){
			v.rules["sccjCode"].remote = {
					url : basePath + "iu/basis/sccj/checkSccjCode.htm",
					type : "post",
					dataType : "json"
			};
			v.messages["sccjCode"].remote = "钢厂代码不允许重复";
		}
		return from.validate(v);
	}
});