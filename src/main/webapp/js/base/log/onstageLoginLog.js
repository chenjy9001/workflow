$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/log/login/";// url命名空间
	bt.config.url.loadListByPage = "loadListByPage.htm";// 分页查询的url
	bt.config.toolbar.search = "用户代码/用户名称/客户端IP";// 右上角搜索框的提示语句
	// 配置部件是否可见
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false

	bt.config.toolbar.query = {// 配置高级查询
		clientIp : function() {
			return $("#search_clientIp").val();
		},
		empCode : function() {
			return $("#search_empCode").val();
		},
		empName : function() {
			return $("#search_empName").val();
		},
		loginTime : function() {
			return $("#search_loginTime").val();
		},
		logoutTime : function() {
			return $("#search_logoutTime").val();
		},
		loginResult : function() {
			return $("#search_loginResult").val();
		}
	};

	bt.config.datatables.fixedParam = {
		sysType : function() {
			return "10";
		}
	};

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'entCode',
		title : '企业代码',

	}, {
		data : 'entName',
		title : '企业姓名',

	}, {
		data : 'empCode',
		title : '用户代码',

	}, {
		data : 'empName',
		title : '用户名称',
	}, {
		data : 'loginTime',
		title : '登录时间',
	}, {
		data : 'logoutTime',
		title : '登出时间',
	}, {
		data : 'loginResult',
		title : '登录结果',
	}, {
		data : 'clientIp',
		title : '客户端IP',
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "登录成功";
			} else if (data == "1") {
				return "登录信息解密失败";
			} else if (data == "2") {
				return "企业代码错误";
			} else if (data == "3") {
				return "账户错误";
			} else if (data == "4") {
				return "账户已冻结";
			} else if (data == "5") {
				return "密码错误";
			}
		},
		targets : [ 9 ]
	} ];

	bt.config.form = {
		data : {
			loginResult : {
				list : [ {
					id : '0',
					text : "登录成功"
				}, {
					id : '1',
					text : "登录信息解密失败"
				}, {
					id : '2',
					text : "企业代码错误"
				}, {
					id : '3',
					text : "账户错误"
				}, {
					id : '4',
					text : "账户已冻结"
				}, {
					id : '5',
					text : "密码错误"
				} ]
			},
		}
	};

	// 初始化所有元素
	bt.fn.init(function(table) {
	});
});