$(function() {
	var bt = new baothink();
	//bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	// bt.config.pageType='10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/mc/emp/";// url命名空间
	// bt.config.url.loadListByPage = "loadListByPage.htm";// 分页查询的url
	// bt.config.url.addAsync = "addAsync.htm";// 分页查询的url
	// bt.config.url.modifyAsync = "modifyAsync.htm";// 新增的url
	// bt.config.url.deleteAsync = "deleteAsync.htm";// 修改的url
	// bt.config.url.viewAsync = "viewAsync.htm";// 查看的url
	// 配置部件是否可见
	// bt.config.visible.toolbar = true; // 默认为true
	bt.config.visible.searchbar = false;// 默认为true
	// bt.config.visible.splitter = false; // 默认为false
	// 工具栏按钮配置
	// bt.config.toolbar.tag = $("#toolbar");// 配置承载toolbar的容器
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			if(bt.fn.getMainSelectRows() != null){
				bt.fn.showAdd('新增数据 ', [ '700px', '420px' ], $("#add_data_div").html(), function(layero, index) {
					$("#entCode",layero).val(bt.fn.getMainSelectRows().entCode);
					//
					fromSubmit($("#add_data_form", layero), function(data) {
						top.layer.close(index);
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
					},true,layero);
				});
			}else{
				parent.layer.alert("请先选择企业", {
					icon : 5,
					title : "提示"
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
			bt.fn.showModify('修改数据 ', [ '700px', '420px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$("#headImg",layero).attr("src",path+"/fileserver/loadImage/"+data.headImg);
				//
				$("#password1",layero).val(data.password);
				
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
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
				},true,layero);
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
			bt.fn.showView('查看数据 ', [ '600px', '450px' ], $("#view_data_div").html(), data, function(layero, index) {

				$("#headImg",layero).attr("src",path+"/fileserver/loadImage/"+data.headImg);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "sex":
							switch (value) {
							case "0":
								$input.text("保密");
								break;
							case "1":
								$input.text("男");
								break;
							case "2":
								$input.text("女");
								break;
							}
							break;
						case "empType":
							switch (value) {
							case "10":
								$input.text("个人用户");
								break;
							case "20":
								$input.text("企业用户");
								break;
							}
							break;
						case "isEntAdmin":
							switch (value) {
							case "0":
								$input.text("不是");
								break;
							case "1":
								$input.text("是");
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
	bt.config.toolbar.btnSize = 2;// 按钮大小(1：大按钮，2：小按钮，3：超小按钮),默认2
	bt.config.toolbar.btnGroup = true;// 按钮是否组合,默认false
	bt.config.toolbar.search = "账号/姓名/企业名称";// 右上角搜索框的提示语句
	
	// datatables配置
	// bt.config.datatables.tag = $("#dataTable");//配置承载datatable的容器
	// bt.config.datatables.pageLength = 10; //每页记录数，默认10
	bt.config.datatables.paging = false;
	// bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	// bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	// bt.config.datatables.multiSelect = false;// 是否允许选择多行，默认false
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'empCode',
		title : '账号',
		width : "100px",
	}, {
		data : 'empName',
		title : '姓名',
		width : "100px"
	}, {
		data : 'headImg',
		title : '头像',
		width : "52px"
	}, {
		data : 'sex',
		title : '性别',
	}, {
		data : 'phone',
		title : '手机',
		className : "text-center"
	}, {
		data : 'status',
		title : '用户状态',
		width : "100px",
		className : "text-center"
	}, {
		data : 'isEntAdmin',
		title : '是否管理员',
		width : "100px",
		className : "text-center"
	}, {
		width : "120px",
		className : "text-center",
		data : 'createDate',
		title : '创建时间'
	}, {
		width : "120px",
		className : "text-center",
		data : 'updateDate',
		title : '修改时间'
	} ];
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "男";
			} else if (data == "2") {
				return "女";
			} else {
				return "保密";
			}
		},
		targets : [ 6 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "正常";
			} else {
				return "冻结";
			}
		},
		targets : [ 8 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "是";
			} else {
				return "不是";
			}
		},
		targets : [ 9 ]
	} , {
		render : function(data, type, row, meta) {
			if (data != "") {
				return "<img onclick='javascript:showImg(this)' src='"+path+"/fileserver/loadImage/"+data+"' width=50 height=50/>";
			} else {
				return "";
			}
		},
		targets : [ 5 ]
	} ];
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
	function fromSubmit(from, submifun,isAdd,layero) {
		// 手机号码验证
		/*jQuery.validator.addMethod("mobile", function(value, element) {
			var length = value.length;
			var mobile = /^([1][3,4,5,8,7])\d{9}$/;
			// var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写手机号码");*/
		var v = {
				submitHandler : function(form) {
					/*var key;
					function bodyRSA() {
						setMaxDigits(130);
						key = new RSAKeyPair(
								"10001",
								"",
								"e871d2ec7a9f807ed40e17306be71a0782c8e1b56197f6f1af6ab1461172791e2e324a67ac3fc8802e4a15058878500985c3e1d5bf720485a7141a5c7b4c9e9f5dbc37098b7b75d2790ff581ee3e4668c54ed02c5b2c63312d4eb9a1284e20da098f1c60830bfbb24a6e2ee6a7fa9423bd414c4e4186e87ee1ce00173ea836af");
					}
					bodyRSA();
					// 加密登录信息(密码已md5加密)
					var pwd = encryptedString(key, encodeURIComponent($("#password")
							.val()));
					$("#password",layero).val(pwd);
					$("#password1",layero).val(pwd);*/
					$(form).ajaxSubmit(submifun);
					return false;
				},
			rules : {
				"empCode" : {
					required : true,
					maxlength : 30
				},
				"empName" : {
					required : true,
					maxlength : 10
				},
				"phone" : {
					required : true,
					mobile : true
				},
				"password" : {
					required : true
				},
				"password1" : {
					required : true,
					equalTo:"#password"
				}
			},
			messages : {
				"empCode" : {
					required : "账号不允许为空",
					minlength : "账号不能超过30个字符"
				},
				"empName" : {
					required : "姓名不允许为空",
					minlength : "姓名不能超过10个字符"
				},
				"phone" : {
					required : "手机号码不允许为空"
				},
				"password" : {
					required : "密码不能为空"
				},
				"password1" : {
					required : "确认密码不能为空",
					equalTo:'两次密码不一致'
				}
			}
		};

		if (isAdd == true) {
			v.rules["empCode"].remote = {
				url : basePath + "mc/emp/validateCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["empCode"].remote = "企业代码已存在，请重新弄输入";
		}

		return from.validate(v);
	}
});
function showImg(obj){
	$("#myimg").attr("src",$(obj).attr("src"));
	parent.layer.open({
		type: 1,
		  title: false,
		  closeBtn: 0,
		  area: ['800px','540px'],
		  skin: 'layui-layer-nobg', //没有背景色
		  shadeClose: true,
	      content: $("#showNumImg").html()
	    });
}