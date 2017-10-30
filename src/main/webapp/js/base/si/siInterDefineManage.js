$(function() {
	var bt = new baothink();
	//把默认的ID换成实际功能需要的ID
	bt.config.id="id";
	bt.config.url.namespace = "/si/siInterDefine/";
	bt.config.toolbar.search = "接口代码/接口名称";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
			
	};
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '750px','470px' ], $("#add_data_div").html(), function(layero, index) {
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
			bt.fn.showModify('修改数据 ', [ '750px','580px'  ], $("#modify_data_div").html(), data, function(layero, index) {
				if(data.isAuth=="1"){
					layero.find("input[name=isAuth]").attr("checked","checked");
				}
				
				if(data.validFlag=="1"){
					layero.find("input[name=validFlag]").attr("checked","checked");
				}
				
				if(data.interfaceType=="10"){
					layero.find("#interfaceType1").attr("checked","checked");
				}else{
					layero.find("#interfaceType2").attr("checked","checked");
				}
				if(data.requestMethod=="10"){
					layero.find("#requestMethod1").attr("checked","checked");
				}else{
					layero.find("#requestMethod2").attr("checked","checked");
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
						top.layer.alert(result.errorMsg);
					}
				},null);
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			var layeroData = null;
			bt.fn.showView('查看数据 ', [ '750px' ], $("#view_data_div").html(), data, function(layero, index) {
				layeroData = layero;
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isAuth":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "1":
								$input.text("是");
								break;
							}
							break;
						case "validFlag":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "1":
								$input.text("是");
								break;
							}
							break;
						case "interfaceType":
							switch (value) {
							case "10":
								$input.text("输入接口");
								break;
							case "20":
								$input.text("输出接口");
								break;
							}
							break;
						case "requestMethod":
							switch (value) {
							case "10":
								$input.text("GET");
								break;
							case "20":
								$input.text("POST");
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
	}];
	
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'sicode',
		title : '接口代码',
		className : "text-center"
	}, {
		data : 'siname',
		title : '接口名称',
		className : "text-center"
	}, {
		data : 'implementsClass',
		title : '接口组件名',
		className : "text-center"
	},  {
		data : 'isAuth',
		title : '是否身份验证',
		className : "text-center",
		render : function(data,type,row,meta){
			if(data=="1"){
				return "是";
			}else if(data=="0"){
				return "否";
			}else{
				return data;
			}
		}
	},{
		data : 'interfaceType',
		title : '接口类型',
		className : "text-center",
		render : function(data,type,row,meta){
			if(data=="10"){
				return "输入接口";
			}else if(data=="20"){
				return "输出接口";
			}else{
				return data;
			}
		}
	},{
		data : 'requestMethod',
		title : '请求方法',
		className : "text-center",
		render : function(data,type,row,meta){
			if(data=="10"){
				return "GET";
			}else if(data=="20"){
				return "POST";
			}else{
				return data;
			}
		}
	},{
		data : 'validFlag',
		title : '是否有效',
		className : "text-center",
		render : function(data,type,row,meta){
			if(data=="1"){
				return "是";
			}else if(data=="0"){
				return "否";
			}else{
				return data;
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
	function fromSubmit(from, submifun, isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"sicode" : {
					required : true,
					maxlength : 20,
					code : true
				},
				"siname" : {
					required : true,
					maxlength : 40
				},
				"implementsClass" : {
					required : true,
					maxlength : 200
				},
				"param1" : {
					maxlength : 50
				},
				"param2" : {
					maxlength : 50
				},
				"param3" : {
					maxlength : 50
				},
				"notes" : {
					maxlength : 400
				}
			},
			messages : {
				"sicode" : {
					required : "接口代码不能为空！",
					maxlength : "接口代码长度不能超过20个字符!",
					code : "只允许录入字母和数字"
				},
				"siname" : {
					required : "接口名称不允许为空!",
					maxlength : "接口名称不能超过40个字符"
				},
				"implementsClass" : {
					required : "接口组件名不能为空！",
					maxlength : '接口组件名长度不能超过200个字符',
				},
				"param1" : {
					maxlength : '扩展参数1长度不能超过50个字符',
				},
				"param2" : {
					maxlength : '扩展参数2长度不能超过50个字符',
				},
				"param3" : {
					maxlength : '扩展参数3长度不能超过50个字符',
				},
				"notes" : {
					maxlength : '备注长度不能超过400个字符',
				}
			}
		};
		if (isAdd == true) {
			v.rules["sicode"].remote = {
				url : basePath + "si/siInterDefine/checkSiCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["sicode"].remote = "接口代码不允许重复，请重新录入";
		}

		return from.validate(v);
	}
	
});


