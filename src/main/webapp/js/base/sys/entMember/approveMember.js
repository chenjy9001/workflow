$(function() {
	var bt = new baothink();
	 bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "mc/ent/";// url命名空间
	bt.config.url.loadListByPage = "loadListByPageByStatus.htm";// 分页查询的url
	// bt.config.url.addAsync = "addAsync.htm";// 分页查询的url
	// bt.config.url.modifyAsync = "modifyAsync.htm";// 新增的url
	// bt.config.url.deleteAsync = "deleteAsync.htm";// 修改的url
	// bt.config.url.viewAsync = "viewAsync.htm";// 查看的url
	// 配置部件是否可见
	// bt.config.visible.toolbar = true; // 默认为true
	// bt.config.visible.searchbar=true;//默认为true
	// bt.config.visible.splitter = false; // 默认为false
	// 工具栏按钮配置
	// bt.config.toolbar.tag = $("#toolbar");// 配置承载toolbar的容器
	bt.config.toolbar.btn = [{
		id : "btn_approve",
 		text : "审核",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {//selectTab.baothink
			var selectIds = [];
			var $table = bt.config.datatables.tag;
			// 所有的checkbox按钮
			var $selectCheck = $table.find("input[type=checkbox].trCheck:checked");
			if ($selectCheck && $selectCheck.length > 0) {
				$selectCheck.each(function() {
					selectIds.push($(this).val());
				});
			}
			if(selectIds.length == 0){
				layer.alert('请选择一行数据',{title:'提示',icon:5});
			}else{
				top.layer.open({
					type : 1,
					area : ['900px','600px'],
					maxmin : true,
					shadeClose : true,
					title:'会员审核',
					btn:['通过','驳回','取消'],
					content : $('#view_data_div').html(),
					success : function(layero, index) {
						$.ajax({
							type : 'post',
							dataType : 'json',
							data : {
								id : selectIds.toString()
							},
							url : path + '/mc/ent/viewAsync.htm',
							success : function(data){
								var data = data.data;
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
								};
								$("#id",layero).val(data.id);
								$("#view_data_form",layero).find('span').each(function(){
									$(this).text(data[$(this).attr("name")]);
								});
								
							}
						});
						
						
						fromSubmit1($("#view_data_form",layero),function(data){

							top.layer.close(index);
							var data = JSON.parse(data);
							if(data.success){
								layer.alert("保存成功",{title:"提示",icon:1},function(index){
									layer.close(index);
									bt.fn.reload(true);
								})
							}else{
								layer.alert(data.errorMsg,{title:"提示",icon:3},function(index){
									layer.close(index);
									bt.fn.reload(true);
								})

							}
						},layero);
					},
					yes:function(index,layero){
						$("#entStatus",layero).val("3");
						$("#view_data_form", layero).submit();
					},
					btn2:function(index,layero){
						$("#entStatus",layero).val("2");
						$("#view_data_form", layero).submit();
						return false;
					},
					btn3:function(index,layero){
					},
				});
				
			}
		}
	}];
	// bt.config.toolbar.btnSize=2;//按钮大小(1：大按钮，2：小按钮，3：超小按钮),默认2
	// bt.config.toolbar.btnGroup=false;//按钮是否组合,默认false
	bt.config.toolbar.search = "企业代码/企业名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		entCode : function() {
			return $("#search_entCode").val();
		},
		entName : function() {
			return $("#search_entName").val();
		},
		checkSubmitDate : function() {
			return $("#search_checkSubmitDate").val();
		}
	};
	// datatables配置
	// bt.config.datatables.tag = $("#dataTable");//配置承载datatable的容器
	// bt.config.datatables.pageLength = 10; //每页记录数，默认10
	// bt.config.datatables.paging = true;// 是否分页，默认true
	//bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	// bt.config.datatables.multiSelect = false;// 是否允许选择多行，默认false
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
		width : "200px",
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
		width : "200px",
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
	} , {
		data : 'checkSubmitDate',
		title : '提交审核时间',
		width : "150px",
		className : "text-center"
	} ];
	bt.config.datatables.columnDefs = [];

	bt.config.tab.tabs  = [ {
		id : "subTab1",
		title : "会员用户",
		url : "mc/emp/toMember.html",
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
	function fromSubmit1(from, submifun,layero) {
		var v = {
				submitHandler : function(form) {
					$(form).ajaxSubmit(submifun);
					return false;
				},
			rules : {
				"checkNotes" : {
					required : true,
					maxlength : 200
				}
			},
			messages : {
				"checkNotes" : {
					required : "审核意见不允许为空",
					minlength : "审核意见不能超过200个字符"
				}
			}
		};
		return from.validate(v);
	};
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
