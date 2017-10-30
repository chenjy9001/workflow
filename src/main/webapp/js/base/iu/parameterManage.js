$(function() {
	// 模块代码
	var moudleCodeValue = "";
	// 参数代码
	var paramCodeValue = ""
	var bt = new baothink();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/iu/parameter/";// url命名空间
	bt.config.visible.splitter = false; // 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		paramMoudle : "text",
		paramType : "id"
	}

	bt.fn.initTree();
	bt.fn.relayout();
	bt.fn.initSplitter();
	renderHtml();
	
	/**
	 * 重写树的点击事件 创建人: 梁涛洽 创建时间:2016年10月31日15:22:21
	 */
	bt.event.treeClick = function(node) {
		var paramType = '';
		var moudleCode = '';
		if (node.id) {
			var arr = node.id.split("_");
			paramType = arr[0];
			moudleCode = arr[1];
		}
		if(moudleCode == undefined){
			moudleCode = "";
		}
		// 重新渲染页面
		renderHtml(paramType, moudleCode);
	}
	loadtoken();
});

/**
 * 手动获取token的值 创建人:梁涛洽 创建时间:2016年11月14日15:17:10
 */
function loadtoken() {
	$.ajax({
		type : 'POST',
		url : basePath + "loadToken.htm",
		success : function(data, textStatus, jqXHr) {
			$("#saveIdAndValueFrom").find("input[name=token]").val(data.data);
		},
		dataType : 'json',
		traditional : true
	});
}

/**
 * from表单提交方法 创建人: 梁涛洽 创建时间:2016年11月14日15:09:51
 */
function saveReport() {

	var $input = $("#saveIdAndValueFrom").find("input[type=text]");
	if ($input) {
		var idAndValue = '';
		$.each($input, function(index, value) {
			idAndValue += (value.id + "," + $(this).val() + "-");
		});
	}

	$("#idAndValue").val(idAndValue);
	$("#saveIdAndValueFrom").ajaxSubmit(function(object) {
		loadtoken();
		var jsonObject = JSON.parse(object);
		if (jsonObject.success == true) {
			// 保存成功
			var tip = jsonObject.data;
			parent.layer.alert(tip, {
				icon : 1,// 0(感叹号),1(打钩),2(X),3(?)
				title : "提示"
			}, function(index, layero) {
				// bt.fn.reload(true);// 刷新数据源
				parent.layer.close(index);
			});
		} else if (jsonObject.success == false) {
			// 保存失败, 其中有多少条失败
			var tip = jsonObject.errorMsg;
			top.layer.alert(tip, {
				icon : 0,
				title : "提示"
			}, function(index) {
				top.layer.close(inex);
				loadtoken();
			});
		}
	});
	return false;
}

/**
 * 渲染页面
 * 
 * @param paramType
 * @param moudleCode
 */
function renderHtml(paramType, moudleCode) {
	if(moudleCode != "" && moudleCode == undefined){
		moudleCode = flag;
	}
	$.ajax({
		type : 'POST',
		url : basePath + "iu/parameter/loadListByPage.htm",
		dataType : 'json',
		data : {
			"paramType" : paramType,
			"moudleCode" : moudleCode
		},
		traditional : true,
		success : function(data, textStatus, jqXHr) {
			$("#saveIdAndValueFrom").html("");
			if (data.data.length > 0) {
				$.each(data.data, function(index, value) {
					var html = '';
					if (index == 0) {
						html += '<div style="overflow: auto;border: 1px solid #e7e7e7;border-right: none;">';
					} else {
						html += '<div style="overflow: auto;border: 1px solid #e7e7e7;border-top: none;border-right: none;">';
					}
					html += '<style type="text/css">';
					html += '	table.sub tbody tr:HOVER{background: white;}';
					html += '	table.sub tbody th{font-weight: normal;text-align: right}';
					html += '</style>';
					html += '<table class="table table-bordered sub" style="table-layout: fixed;margin: -1px;">';
					html += '<tbody id="tableBody">';
					html += '<tr>';
					html += '<th style="width:200px">' + value.paramName + '</th>';
					html += '<td><input type="text" class="form-control" value="' + value.paramValue + '" id="' + value.id + '"/></td>';
					if (value.notes != "") {
						html += '<td>(' + value.notes + ')</td>';
					} else {
						html += '<td></td>';
					}
					html += '</tr>';
					html += '</tbody>';
					html += '</table>';
					html += '</div>';
					$("#saveIdAndValueFrom").append(html);
				});
				var htmls = '';
				htmls += '<input id="idAndValue" name="idAndValue" type="hidden" />';
				htmls += '<input type="hidden" name="token"/>';
				$("#saveIdAndValueFrom").append(htmls);
				loadtoken();
			}
		}
	});
}
