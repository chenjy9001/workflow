var typeCodeJS;
var typeNameJS;
var typeLeave;
$(function() {
	var bt = new baothink();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "is/basis/type/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			if(!typeLeave){parent.layer.alert("请选择左侧菜单树所需添加的品种", {icon : 0,title : "提示"});
				return false;
			}else if(typeLeave == "4"){
				parent.layer.alert("小品种不能添加子项", {icon : 0,title : "提示"});
				return false;
			}else if(typeLeave == "3"){
				$("#bigType").css("display","none").find("#bigCode").attr("disabled",true);
				$("#bigType").find("#bigName").attr("disabled",true);
				$("#midType").css("display","none").find("#midCode").attr("disabled",true);
				$("#midType").find($("#midName")).attr("disabled",true);
				$("#smallType").css("display","").find("#smallCode").attr("disabled",false);
				$("#smallType").find("#smallName").attr("disabled",false);
			}else if(typeLeave == "2"){
				$("#midType").css("display","").find("#midCode").attr("disabled",false);
				$("#midType").find("#midName").attr("disabled",false);
				$("#bigType").css("display","none").find("#bigCode").attr("disabled",true);
				$("#bigType").find("#bigName").attr("disabled",true);
				$("#smallType").css("display","none").find("#smallCode").attr("disabled",true);
				$("#smallType").find("#smallName").attr("disabled",true);
			}else if(typeLeave == "1"){
				$("#bigType").css("display","").find("#bigCode").attr("disabled",false);
				$("#bigType").find("#bigName").attr("disabled",false);
				$("#midType").css("display","none").find("#midCode").attr("disabled",true);
				$("#midType").find($("#midName")).attr("disabled",true);
				$("#smallType").css("display","none").find("#smallCode").attr("disabled",true);
				$("#smallType").find("#smallName").attr("disabled",true);
			}
			bt.fn.showAdd('新增数据 ', [ '600px', '320px' ], $("#add_data_div").html(), function(layero, index) {
				$("#addParentCode",layero).val(typeCodeJS);
				$("#addTypeLeave",layero).val(typeLeave);
				$("#addParentName",layero).val(typeNameJS);
				if(typeLeave == "1"){
					getSccjPinyinByName("bigName",layero,"pinyinName");
				}else if(typeLeave == "2"){
					getSccjPinyinByName("midName",layero,"pinyinName");
				}else if(typeLeave == "3" || typeLeave == "4"){
					getSccjPinyinByName("smallName",layero,"pinyinName");
				}
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
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			if(data.bigCode && data.midCode && data.smallCode){
				$("#editSmallType").css("display","").find("#smallCode").attr("disabled",false);
				$("#editSmallType").find("#smallName").attr("disabled",false);
				$("#editBigType").css("display","none").find("#bigCode").attr("disabled",true);
				$("#editBigType").find("#bigName").attr("disabled",true);
				$("#editMidType").css("display","none").find("#midCode").attr("disabled",true);
				$("#editMidType").find($("#midName")).attr("disabled",true);
			}else if(data.bigCode && data.midCode && !data.smallCode){
				$("#editBigType").css("display","none").find("#bigCode").attr("disabled",true);
				$("#editBigType").find("#bigName").attr("disabled",true);
				$("#editMidType").css("display","").find("#midCode").attr("disabled",false);
				$("#editMidType").find("#midName").attr("disabled",false);
				$("#editSmallType").css("display","none").find("#smallCode").attr("disabled",true);
				$("#editSmallType").find("#smallName").attr("disabled",true);
			}else if(data.bigCode && !data.midCode && !data.smallCode){
				$("#editBigType").css("display","").find("#bigCode").attr("disabled",false);
				$("#editBigType").find("#bigName").attr("disabled",false);
				$("#editMidType").css("display","none").find("#midCode").attr("disabled",true);
				$("#editMidType").find("#midName").attr("disabled",true);
				$("#editSmallType").css("display","none").find("#smallCode").attr("disabled",true);
				$("#editSmallType").find("#smallName").attr("disabled",true);
			}
			bt.fn.showModify('修改数据 ', [ '600px', '390px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$("#editTypeLeave",layero).val(typeLeave);
				if(typeLeave == "1"){
					getSccjPinyinByName("bigName",layero,"pinyinName");
				}else if(typeLeave == "2"){
					getSccjPinyinByName("midName",layero,"pinyinName");
				}else if(typeLeave == "3" || typeLeave == "4"){
					getSccjPinyinByName("smallName",layero,"pinyinName");
				}
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
			if(data.bigCode && data.midCode && data.smallCode){
				$("#viewBigType").css("display","none");
				$("#viewMidType").css("display","none");
				$("#viewSmallType").css("display","");
			}else if(data.bigCode && data.midCode && !data.smallCode){
				$("#viewBigType").css("display","none");
				$("#viewMidType").css("display","");
				$("#viewSmallType").css("display","none");
			}else if(data.bigCode && !data.midCode && !data.smallCode){
				$("#viewBigType").css("display","");
				$("#viewMidType").css("display","none");
				$("#viewSmallType").css("display","none");
			}
			bt.fn.showView('查看数据 ', [ '600px', '390px' ], $("#view_data_div").html(), data, function(layero, index) {
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
	} ];
	bt.config.toolbar.search = "代码/名称";// 右上角搜索框的提示语句
	bt.config.datatables.fixedParam = {// 固定默认查询条件
		userType : "10"
	}
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'typeCode',
		className : "text-center",
		title : '代码'
	}, {
		data : 'typeName',
		className : "text-center",
		title : '名称'
	}, {
		data : 'typeLeave',
		className : "text-center",
		title : '类型'
	}];
	bt.config.form = {};
	// 行选中事件
	bt.event.rowClick = function(row) {
	}
	bt.config.datatables.paging = false;// 是否分页，默认true
	//点击左侧菜单树
	bt.event.treeClick = function(node){
		if(node){
			var value = {"treeNodeId":node.id,"treeNodeType":node.parents.length};
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
				"bigCode" : {
					required : true,
					maxlength : 20
				},
				"bigName" : {
					required : true,
					maxlength : 40
				},
				"midCode" : {
					required : true,
					maxlength : 20
				},
				"midName" : {
					required : true,
					maxlength : 40
				},
				"smallCode" : {
					required : true,
					maxlength : 20
				},
				"smallName" : {
					required : true,
					maxlength : 40
				},
				"pinyinName" : {
					maxlength : 40
				},
				"notes" : {
					maxlength : 400
				}
			},
			messages : {
				"bigCode" : {
					required : "大品种代码不允许为空",
					maxlength : "不能超过20个字符"
				},
				"bigName" : {
					required : "大品种名称不允许为空",
					maxlength : "不能超过40个字符"
				},
				"midCode" : {
					required : "中品种代码不允许为空",
					maxlength : "中品种代码不能超过20个字符"
				},
				"midName" : {
					required : "中品种名称不允许为空",
					maxlength : "中品种名称不能超过40个字符"
				},
				"smallCode" : {
					required : "小品种代码不允许为空",
					maxlength : "小品种代码不能超过20个字符"
				},
				"smallName" : {
					required : "小品种名称不允许为空",
					maxlength : "小品种名称不能超过40个字符"
				},
				"pinyinName" : {
					maxlength : "拼音不能超过40个字符"
				},
				"notes" : {
					maxlength : "备注不能超过400个字符"
				}
			}
		};
		if(isAdd == true){
			if(typeLeave == "1"){
				v.rules["bigCode"].remote = {
						url : basePath + "is/basis/type/checkBigCode.htm",
						type : "post",
						dataType : "json"
				};
				v.messages["bigCode"].remote = "大品种代码不允许重复";
			}else if(typeLeave == "2"){
				v.rules["midCode"].remote = {
						url : basePath + "is/basis/type/checkMidCode.htm",
						type : "post",
						dataType : "json"
				};
				v.messages["midCode"].remote = "中品种代码不允许重复";
			}else{
				v.rules["smallCode"].remote = {
						url : basePath + "is/basis/type/checkSmallCode.htm",
						type : "post",
						dataType : "json"
				};
				v.messages["smallCode"].remote = "小品种代码不允许重复";
			}
		}
		return from.validate(v);
	}
});
/**
 * 根据中文名称赋值拼音
 * @param obj:名称输入框ID
 * @param layero：弹出层对象
 * @param pinyin：拼音输入框ID
 */
function getSccjPinyinByName(obj,layero,pinyin){
	$("#"+obj,layero).keyup(function(){
		var name = $.trim($(this).val());
		if (name!="") {
			$.ajax({
				url : basePath+ "is/basis/type/getPinyinByName.htm",
				data : {"chinese":name},
				type : 'POST',
				dataType : 'json',
				success : function(data) {
					if (data && data.success) {
						$("#"+pinyin,layero).val(data.data);
					}
				}
			});
		}else{
			$("#"+pinyin,layero).val("");
		}
	});
}