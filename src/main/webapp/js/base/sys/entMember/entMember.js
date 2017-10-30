$(function() {
	var bt = new baothink();
	 bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '20';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "mc/ent/";// url命名空间
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '900px', '550px' ], $("#add_data_div").html(), function(layero, index) {
				$('#entCertificae',layero).on('ifChanged', function(event){
					if(this.checked){
						$("#oneDiv",layero).show();
						$("#socialCreditCode",layero).attr("class","form-control required");
						$("#taxNo",layero).attr("class","form-control");
						$("#licenceNo",layero).attr("class","form-control");
						$("#groupCode",layero).attr("class","form-control");
						$("#threeDiv",layero).hide();
					}else{
						$("#oneDiv",layero).hide();
						$("#socialCreditCode",layero).attr("class","form-control");
						$("#taxNo",layero).attr("class","form-control required");
						$("#licenceNo",layero).attr("class","form-control required");
						$("#groupCode",layero).attr("class","form-control required");
						$("#threeDiv",layero).show();
					}
				});
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
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '900px', '550px' ], $("#modify_data_div").html(), data, function(layero, index) {
				//$("#entNature",layero).select2().select2("val", 'entType_003');
				if(data.entStatus != '0' && data.entStatus != '2' ){//当会员状态不为新注册和提交失败时不能修改三证信息
					//$('#entCertificae',layero).iCheck('disable');
					$("#isThreeText",layero).html("");
					$("#isThreeText",layero).append("<input id='entCertificae' name='entCertificae' readonly='readonly' value='"+(data.entCertificae==20?"是":"不是")+"' class='form-control'></input>")
					var $file = $("#modify_data_form",layero).find("input[type = file]");
					for(var i = 0 ;i < $file.length;i++){
						$($file[i]).attr("disabled",true);
						$("#"+$($file[i]).next().attr("name").replace("Id",""),layero).attr("readonly",true);
					};
				}else{
					$('#entCertificae',layero).on('ifChanged', function(event){//改变三证合一状态是触发事件
						if(this.checked){
							$("#oneDiv",layero).show();
							$("#socialCreditCode",layero).attr("class","form-control required");
							$("#taxNo",layero).attr("class","form-control");
							$("#licenceNo",layero).attr("class","form-control");
							$("#groupCode",layero).attr("class","form-control");
							$("#threeDiv",layero).hide();
						}else{
							$("#oneDiv",layero).hide();
							$("#socialCreditCode",layero).attr("class","form-control");
							$("#taxNo",layero).attr("class","form-control required");
							$("#licenceNo",layero).attr("class","form-control required");
							$("#groupCode",layero).attr("class","form-control required");
							$("#threeDiv",layero).show();
						}
					});

					if(data.entCertificae == "20"){//控制三证合一
						$('#entCertificae',layero).iCheck('check');
					}else{
						$('#entCertificae',layero).iCheck('uncheck');;
					}

				}
				
				if(data.entCertificae == "20"){//控制三证合一
					$("#socialCreditCode",layero).attr("class","form-control required");
					$("#img1",layero).remove();
					$("#img2",layero).remove();
					$("#img3",layero).remove();
					$("#img0",layero).attr("src",path+"/fileserver/loadImage/"+data.socialCreditCodeId);
				}else{
					$("#oneDiv",layero).hide();
					$("#socialCreditCode",layero).attr("class","form-control");
					$("#taxNo",layero).attr("class","form-control required");
					$("#licenceNo",layero).attr("class","form-control required");
					$("#groupCode",layero).attr("class","form-control required");
					$("#threeDiv",layero).show();
					$("#img1",layero).attr("src",path+"/fileserver/loadImage/"+data.taxNoId);
					$("#img2",layero).attr("src",path+"/fileserver/loadImage/"+data.groupCodeId);
					$("#img3",layero).attr("src",path+"/fileserver/loadImage/"+data.licenceNoId);
					$("#img0",layero).remove();
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
								parent.layer.closeAll('dialog');
								bt.fn.reloadSubTab(true);
								bt.fn.reload(true);
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
		click : function(data) {//selectTab.baothink
			bt.fn.showView('查看数据 ', [ '900px', '550px' ], $("#view_data_div").html(), data, function(layero, index) {
				if(data.entCertificae == "20"){
					$("#img0",layero).attr("src",path+"/fileserver/loadImage/"+data.socialCreditCodeId);
					$("#oneDiv",layero).find("img").on("click",function(){
						$("#myimg").attr("src",$(this).attr("src"));
						parent.layer.open({
							type: 1,
							  title: false,
							  closeBtn: 0,
							  area: ['800px','540px'],
							  skin: 'layui-layer-nobg', //没有背景色
							  shadeClose: true,
						      content: $("#showNumImg").html()
						    });
					});
				}else{
					$("#threeDiv",layero).find("img").on("click",function(){
						$("#myimg").attr("src",$(this).attr("src"));
						parent.layer.open({
							type: 1,
							  title: false,
							  closeBtn: 0,
							  area: ['800px','540px'],
							  skin: 'layui-layer-nobg', //没有背景色
							  shadeClose: true,
						      content: $("#showNumImg").html()
						    });
					});
					$("#oneDiv",layero).hide();
					$("#threeDiv",layero).show();
					$("#img1",layero).attr("src",path+"/fileserver/loadImage/"+data.taxNoId);
					$("#img2",layero).attr("src",path+"/fileserver/loadImage/"+data.groupCodeId);
					$("#img3",layero).attr("src",path+"/fileserver/loadImage/"+data.licenceNoId);
				}
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "entCertificae":
							switch (value) {
							case "10":
								$input.text("不是");
								break;
							case "20":
								$input.text("是");
								break;
							case "":
								$input.text("不是");
								break;
							}
							break;
						case "entStatus":
							switch (value) {
							case "0":
								$input.text("新注册");
								break;
							case "1":
								$input.text("待审核");
								break;
							case "2":
								$input.text("审核未通过");
								break;
							case "3":
								$input.text("已审核");
								break;
							case "":
								$input.text("冻结");
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
		id : "btn_import",
		text : "导入",
		icon : "fa-file-excel-o",
		visible : true,
		disable : false,
		click : function() {
			var bt1 = getBaothinkObjectByBaothinkTab(bt.config.tab.tag, "subTab");
			bt1.fn.reload();
		}
	} ];
	bt.config.toolbar.search = "企业代码/企业名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		entCode : function() {
			return $("#search_entCode").val();
		},
		entName : function() {
			return $("#search_entName").val();
		},
		createDate : function() {
			return $("#search_createDate").val();
		}
	};
	bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'entCode',
		title : '企业代码',
		width : "100px",
	}, {
		data : 'entName',
		title : '企业名称',
		width : "250px",
	}, {
		data : 'entStatus',
		title : '状态',
		width : "100px",
	}, {
		data : 'provincename',
		title : '所在省',
		width : "100px",
	}, {
		data : 'cityname',
		title : '所在市',
		width : "100px",
	}, {
		data : 'districtname',
		title : '所在区县',
		width : "100px",
	}, {
		data : 'entAddress',
		title : '企业地址',
		width : "300px",
	}, {
		data : 'entNature',
		title : '企业性质',
		width : "100px",
	}, {
		data : 'lxrName',
		title : '联系人姓名',
		width : "100px",
		className : "text-center"
	}, {
		data : 'lxrPhone',
		title : '联系人电话',
		width : "100px",
		className : "text-center"
	}, {
		data : 'createDate',
		title : '注册时间',
		width : "150px",
		className : "text-center"
	} ];
	bt.config.datatables.columnDefs = [{
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "新注册";
			} else if (data == "1") {
				return "待审核";
			} else if (data == "2") {
				return "<span style='color:red'>审核未通过</span>";
			} else if (data == "3") {
				return "<span style='color:green'>已审核</span>";
			} else {
				return "冻结";
			}
		},
		targets : [ 5 ]
	}];

	bt.config.tab.tabs  = [ {
		id : "subTab1",
		title : "会员用户",
		url : "mc/emp/manage.html",
		query : [{
			entCode : "entCode"
		}]
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
		var v = {
				submitHandler : function(form) {
					$(form).ajaxSubmit(submifun);
					return false;
				},
			rules : {
				"entCode" : {
					required : true,
					maxlength : 20
				},
				"entName" : {
					required : true,
					maxlength : 200
				}
			},
			messages : {
				"entCode" : {
					required : "企业代码不允许为空",
					minlength : "企业代码不能超过20个字符"
				},
				"entName" : {
					required : "企业名不允许为空",
					minlength : "企业名不能超过200个字符"
				}
			}
		};

		if (isAdd == true) {
			v.rules["entCode"].remote = {
				url : basePath + "mc/ent/validateCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["entCode"].remote = "用户代码已存在，请重新弄输入";
		}

		return from.validate(v);
	}
});
