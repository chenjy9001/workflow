var btSub = new baothink();
$(function() {
	//把默认的ID换成实际功能需要的ID
	btSub.config.id="id";
	// btSub.config.url.namespace = "/userDemo/";
	// btSub.config.datatables.dt = $("#dataTable");//配置承载datatable的容器
	// btSub.config.toolbar.tb = $("#toolbar");// 配置承载toolbar的容器
	btSub.config.datatables.dt = $("#dataTableSub"),
	btSub.config.toolbar.tb = $("#toolbarSub"),
	btSub.config.url.loadListByPage = "getGroupUsersAsync.htm";
	btSub.config.toolbar.search = "用户代码/名称";
	btSub.config.datatables.multiSelect = true;// 是否多选
	btSub.config.toolbar.query = {// 配置高级查询
		sysId : function() {
			return $("#search_sysId").val();
		},
		ptId : function() {
			return $("#search_ptId").val();
		},
		groupName : function() {
			return $("#search_groupName").val();
		}
	};
	btSub.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, btSub.datatables.columns.cs, btSub.datatables.columns.seq, {
		data : 'empCode',
		title : '用户代码',
		width : "100px",
		className : "text-center"
	}, {
		data : 'empName',
		title : '用户名称',
		width : "100px",
		className : "text-center"
	}, {
		data : 'sex',
		title : '性别',
		width : "100px",
		className : "text-center"
	}, {
		data : 'ptId',
		title : '平台代码',
		width : "100px",
		className : "text-center"
	}];
	btSub.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (row.sex == "1") {
				return "男";
			} else if (row.sex == "0") {
				return "女";
			} 
		},
		targets : [ 5 ]
	}];
	// 初始化所有元素
	btSub.fn.init(function() {
	});
	
	//隐藏工具栏 按钮
	$('#toolbar_btn').css('visibility','hidden');

});

function getselectId(value){
	var ids = btSub.fn.getSelectIds();
	if (ids == 0) {
		parent.layer.alert("请选择1条数据！", {
			icon : 0,
			title : "提示"
		});
		return;
	}
	return ids[0];
}

