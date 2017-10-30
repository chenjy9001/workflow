var initValueFlag;
$(function() {
	var bt = new baothink();
	var toolSub = new toolSubppert();
	bt.config.url.namespace = "/iu/doccode/";// url命名空间
	bt.config.visible.splitter = true;
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.search = "规则代码/单据名称";// 右上角搜索框的提示语句
	bt.config.datatables.pageLength = 20; // 每页记录数，默认10
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
			bt.fn.showAdd('新增数据 ', [ '650px', '370px' ], $("#add_data_div").html(), function(layero, index) {
				
				// 预览单据编号
				toolSub.preview(layero);
				
				toolSub.previewContents(layero);
				
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
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
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			
			bt.fn.showModify('修改数据 ', [ '700px', '460px' ], $("#modify_data_div").html(), data, function(layero, index) {
				
				// 预览单据编号
				toolSub.preview(layero);
				
				if($("#prefix", layero).val() && $("#initValue", layero).val() && $("#itemLength", layero).val()){
					toolSub.previewContents(layero);
				}
				
				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
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
				}, false, data.id);
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
			bt.fn.showView('查看数据 ', [ '700px', '460px' ], $("#view_data_div").html(), data, function(layero, index) {
				
				toolSub.previewContent = data.prefix;
				toolSub.dateTypeJudge(data.dateType);
				toolSub.addDigit(data.itemLength, data.currentValue.toString());
				$("#preview", layero).html(toolSub.previewContent);
				
				$("#notes", layero).val(data.notes);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						if (name == "dateType") {
							$input.text(toolSub.getDataById(value));
						} else {
							$input.val(value);
						}
					}
				});
			});
		}
	} ];
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'rulesCode',
		title : '规则代码',
		className : "text-center"
	}, {
		className : "text-center",
		data : 'itemName',
		sTitle : '单据名称'

	}, {
		data : 'prefix',
		title : '编码前缀',
		className : "text-center"

	}, {
		data : 'initValue',
		sTitle : '初始值',
		className : "text-center"
	}, {
		data : 'currentValue',
		sTitle : '当前值',
		className : "text-center"
	}, {
		className : "text-center",
		data : 'dateType',
		title : '日期类型',
		render : function(data, type, row, meta) {
			return toolSub.getDataById(data);
		}
	}, {
		className : "text-center",
		data : 'itemLength',
		title : '流水号长度'
	}, {
		className : "text-center",
		data : 'notes',
		title : '备注'
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
	});

	// 初始化数据字典数据
	toolSub.init();

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun, isAdd, id) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"rulesCode" : {
					required : true,
					maxlength : 20,
					code : true
				},
				"prefix" : {
					required : true,
					maxlength : 20,
					code : true
				},
				"itemName" : {
					required : true,
					maxlength : 40
				},
				"initValue" : {
					required : true,
					digits : true,
					maxlength : 9
				},
				"itemLength" : {
					required : true,
					digits : true,
					maxlength : 9
				}
			},
			messages : {
				"rulesCode" : {
					required : "规则代码不允许为空",
					maxlength : "规则代码不能超过20个字符",
					code : "只允许录入字母和数字"
				},
				"prefix" : {
					required : "编码前缀不允许为空",
					maxlength : "编码前缀不能超过20个字符",
					code : "只允许录入字母和数字"
				},
				"itemName" : {
					required : "单据名称不允许为空",
					maxlength : "单据名称不能超过40个字符"
				},
				"initValue" : {
					required : "初始值不允许为空",
					digits : "请输入正确的数字",
					maxlength : "初始值不能超过9个字符"
				},
				"itemLength" : {
					required : "单号长度不允许为空",
					digits : "请输入正确的数字",
					maxlength : "单号长度不能超过9个字符"
				}
			}
		};
		if (isAdd == true) {
			v.rules["rulesCode"].remote = {
				url : basePath + "iu/doccode/checkrulesCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["rulesCode"].remote = "规则代码不允许重复";
		} else{
			v.rules["initValue"].remote = {
				url : basePath + "iu/doccode/checkInitValue.htm?id="+id+"",
				type : "post",
				dataType : "json"
			};
			v.messages["initValue"].remote = "初始值不能小于当前值";
		}
		return from.validate(v);
	}
});

/**
 * 数据字典对象<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月26日13:27:25<br>
 */
var toolSubppert = function() {
	var toolS = {
		// 记录list数据
		data : null,
		// 预览数据
		previewContent : null,
		// 初始化
		init : function() {
			$.ajax({
				type : "POST",
				url : basePath + "iu/dict/getKeyTable.htm",
				dataType : "json",
				success : function(response) {
					if (response.result != null && response.result.length > 0) {
						toolS.data = response.result;
					}
				}
			});
		},
		// 根据日期类型获取文本值
		getDataById : function(id) {
			if (id == null || id == "" || id == undefined) {
				return "";
			}
			if (toolS.data == null) {
				return "";
			}
			for (var i = 0; i < toolS.data.length; i++) {
				if (toolS.data[i].id == id) {
					return toolS.data[i].name;
				}
			}
			return "";
		},
		// 预览单据编号
		preview : function(layero, fun){
			// if($("#prefix", layero).val() && $("#initValue", layero).val() && $("#itemLength", layero).val()){
				toolS.previewContents(layero);
				$("#preview", layero).val(toolS.previewContent);
				$(("#prefix", layero), ("#initValue", layero), ($("#itemLength").val())).bind("keyup", function(data){
					toolS.previewContents(layero);
					$("#preview", layero).val(toolS.previewContent);
				});
				$("#dateType",layero).change(function(data){
					toolS.previewContents(layero);
					$("#preview", layero).val(toolS.previewContent);
				});
			// }
		},
		// 预览内容
		previewContents : function(layero){
			toolS.previewContent = $("#prefix", layero).val();
			toolS.dateTypeJudge($("select", layero).val());
			if(Number($("#initValue", layero).val()) >= Number($("#currentValue", layero).val())){
				toolS.addDigit($("#itemLength", layero).val(), $("#initValue", layero).val());
			}else if(!$("#currentValue", layero).val() && $("#initValue", layero).val()){
				toolS.addDigit($("#itemLength", layero).val(), $("#initValue", layero).val());
			}else {
				toolS.addDigit($("#itemLength", layero).val(), $("#currentValue", layero).val());
			}
		},
		// 判断流水号长度是否大于当前值长度
		addDigit : function(itemLength, value){
			if(itemLength && value){
			    if(Number(itemLength) == Number(value.length) || Number(itemLength) < Number(value.length)){
			    	toolS.previewContent += value;
			    }else if(Number(itemLength) > Number(value.length)){
			    	var flag = Number(itemLength) - Number(value.length);
			    	for (var i = 0; i < flag; i++) {
			    		value = "0" + value;
			    	}
			    	toolS.previewContent += value;
			    }
			}
		},
		// 判断日期类型显示预览
		dateTypeJudge : function(flag){
			if(flag == "%Y%m%d"){
				var nowDate = moment();
				toolS.previewContent += nowDate.year();
				toolS.previewContent += nowDate.format('MM', nowDate.month());
				toolS.previewContent += nowDate.format('DD', nowDate.date());
			}else if(flag == "%y%m%d"){
				var nowDate = moment();
				toolS.previewContent += nowDate.format('YY',moment().year());
				toolS.previewContent += nowDate.format('MM', nowDate.month());
				toolS.previewContent += nowDate.format('DD', nowDate.date());
			}else if(flag == "%Y%m"){
				var nowDate = moment();
				toolS.previewContent += nowDate.year();
				toolS.previewContent += nowDate.format('MM', nowDate.month());
			}else if(flag == "%y%m"){
				var nowDate = moment();
				toolS.previewContent += nowDate.format('YY',moment().year());
				toolS.previewContent += nowDate.format('MM', nowDate.month());
			}else if(flag == "%Y"){
				var nowDate = moment();
				toolS.previewContent += nowDate.year();
			}else if(flag == "%y"){
				var nowDate = moment();
				toolS.previewContent += nowDate.format('YY',moment().year());
			}else if(flag == "%H%i%s"){
				var nowDate = moment();
				toolS.previewContent += nowDate.format('HH', nowDate.hour());
				toolS.previewContent += nowDate.format('mm', nowDate.minute());
				toolS.previewContent += nowDate.format('ss', nowDate.second());
			}
		}
	}
	return toolS;
}
