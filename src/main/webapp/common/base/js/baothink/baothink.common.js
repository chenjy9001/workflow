(function($) {
	var dataTableSelected = [];
	/**
	 * datatables默认配置
	 */
	$.extend(true, $.fn.DataTable.defaults, {
		paging : true,// 分页
		ordering : false,// 是否启用排序
		searching : true,// 搜索
		processing : true,// 是否显示处理状态
		serverSide : true,// true启动服务器端分页
		autoWidth : true,// 自适应
		lengthMenu : [ 5, 10, 20, 30, 50, 100 ],// 这里也可以设置分页，但是不能设置具体内容，只能是一维或二维数组的方式，所以推荐下面language里面的写法。
		pagingType : "full_numbers",// 分页样式的类型
		dom : 'rt<"pageToolbar"<"col-xs-6 pageleft"il><"col-xs-6"p><"clear">>',
		language : {
			search : '',// 右上角的搜索文本，可以写html标签
			paginate : {// 分页的样式内容。
				previous : "上一页",
				next : "下一页",
				first : "首页",
				last : "末页"
			},
			stripeClasses : [ "odd", "even" ],// 为奇偶行加上样式，兼容不支持CSS伪类的场合
			loadingRecords : "正在加载数据...",// 加载数据时的提示信息 - 当 Ajax请求数据时显示
			processing : "正在加载数据",// 当table处理用户处理信息时，显示的信息字符串
			emptyTable : "暂无数据",// 当表格没有数据时，表格所显示的字符串
			zeroRecords : "暂无数据",// 当搜索结果为空时，显示的信息
			// 下面三者构成了总体的左下角的内容。
			lengthMenu : "每页  _MENU_ 条记录",
			info : "总共_PAGES_ 页，显示第_START_ 到第 _END_ 条 ，共 _TOTAL_ 条 ",// 左下角的信息显示，大写的词为关键字。
			infoEmpty : "显示第 0 至 0 项结果，共 0 项",// 筛选为空时左下角的显示。
			infoFiltered : ""// 当表格搜索后，在汇总字符串上需要增加的内容
		}
	});
	// 数据验证框架的默认配置
	$.validator.setDefaults({
		// 设置验证触发事件
		focusInvalid : function(element) {
			$(element).valid();
		},
		// 是否在敲击键盘时验证
		onkeyup : function(element) {
			$(element).valid();
		},
		onclick : function(element) {
			$(element).valid();
		},
		onfocusout : function(element) {
			$(element).valid();
		},
		errorElement : "div",
		success : function(label) {
			// 正确时的样式
			label.remove();
		},
		errorPlacement : function(error, element) {
			var content = error.text();
			var $tip = $("#" + error.attr("id") + "Tip");
			if (content && content.length > 0) {
				if ($tip.length == 0) {
					var $parent = element.parents(".form-control");
					if ($parent.length == 1) {
						$parent = $parent.parent();
					} else if (element.attr("data-type") == "ueditor") {
						$parent = element.parents(".edui-container").parent();
					} else if (element.attr("type") == "radio" || element.attr("type") == "checkbox") {
						$parent = element.parent().parent();
					} else {
						$parent = element.parent();
					}
					if ($parent) {
						$parent.append(createValidatorTip(content, error.attr("id") + "Tip"));
					}
				} else {
					$tip.find("div.layui-layer-content span").text(content);
				}
			} else {
				$tip.remove();
			}
		}
	});
	// 日期控件汉化
	$.fn.datetimepicker.dates['zh-CN'] = {
		days : [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日" ],
		daysShort : [ "周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日" ],
		daysMin : [ "日", "一", "二", "三", "四", "五", "六", "日" ],
		months : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
		monthsShort : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
		today : "今天",
		suffix : [],
		meridiem : [ "上午", "下午" ]
	};
	/**
	 * 构建错误的提示框<br>
	 * 
	 * @param content
	 * @param id
	 * @returns {String}
	 * @since ecp-demo-web-admin1.0
	 */
	function createValidatorTip(content, id) {
		var tip = "";
		tip = tip + '<div id="' + id + '" class="layui-layer layui-layer-tips layer-anim bt-error" type="tips" times="2" showtime="0" contype="object">';
		tip = tip + '	<div class="layui-layer-content">';
		tip = tip + '		<span>' + content + '</span>';
		tip = tip + '		<i class="layui-layer-TipsG layui-layer-TipsB"></i>';
		tip = tip + '	</div>';
		tip = tip + '	<span class="layui-layer-setwin"></span>';
		tip = tip + '</div>';
		return tip;
	}
	$.ajaxSetup({
		cache : false
	});
	// 备份jquery的ajax方法
	var _ajax = $.ajax;

	// 重写jquery的ajax方法
	$.ajax = function(opt) {
		// 备份opt中error和success方法
		var fn = {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			},
			success : function(data, textStatus) {
			}
		}
		if (opt.error) {
			fn.error = opt.error;
		}
		if (opt.success) {
			fn.success = opt.success;
		}

		// 扩展增强处理
		var _opt = $.extend(opt, {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// 错误方法增强处理
				// console.info("错误方法增强处理");
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			success : function(data, textStatus) {

				var result;
				if (typeof data == "string") {
					try {
						result = JSON.parse(data);
					} catch (e) {
					}
				} else if (typeof data == "object") {
					result = data;
				}
				// 成功回调方法增强处理
				// console.info("成功回调方法增强处理，type:" + opt.type);
				if (result && result.success == false) {
					// 如果未登录，则跳入登录页面
					if ("100002" == data.errorCode) {
						top.layer.alert("登录超时，请重新登录！", {
							icon : 0,
							title : "提示"
						}, function() {
							top.document.location.href = basePath + 'login.html';
						});
						return false;
					} else {
						// top.layer.alert(data.errorMsg, {
						// icon : 0,
						// title : "提示"
						// });
					}
				} else {
					// 如果读取数据时，有并发字段，则创建隐藏表单标签存储字段值
					if (opt.type == "get" && data && data.data) {
						var lockTag = opt.lockTag ? opt.lockTag : "";
						var optimisticLock1 = data.data.optimisticLock1;
						if (optimisticLock1 && optimisticLock1 >= 0) {
							var lock1Id = lockTag + 'optimisticLock1';
							var $lock1 = $("#" + lock1Id);
							// 如果已存在，则重新赋值
							if ($lock1.length == 1) {
								$lock1.val(optimisticLock1);
							} else {
								$("body").append('<input type="hidden" id="' + lock1Id + '" value="' + optimisticLock1 + '"/>');
							}
						}
						var optimisticLock2 = data.data.optimisticLock2;
						if (optimisticLock2 && optimisticLock2 >= 0) {
							var lock2Id = lockTag + 'optimisticLock2';
							var $lock2 = $("#" + lock2Id);
							// 如果已存在，则重新赋值
							if ($lock2.length == 1) {
								$lock2.val(optimisticLock2);
							} else {
								$("body").append('<input type="hidden" id="' + lock2Id + '" value="' + optimisticLock2 + '"/>');
							}
						}
						var pessimisticLock = data.data.pessimisticLock;
						if (pessimisticLock && pessimisticLock >= 0) {
							var lock3Id = lockTag + 'pessimisticLock';
							var $lock3 = $("#" + lock3Id);
							// 如果已存在，则重新赋值
							if ($lock3.length == 1) {
								$lock3.val(pessimisticLock);
							} else {
								$("body").append('<input type="hidden" id="' + lock3Id + '" value="' + pessimisticLock + '"/>');
							}
						}
						var lockDigest = data.data.lockDigest;
						if (lockDigest && lockDigest) {
							var lock4Id = lockTag + 'lockDigest';
							var $lock4 = $("#" + lock4Id);
							// 如果已存在，则重新赋值
							if ($lock4.length == 1) {
								$lock4.val(lockDigest);
							} else {
								$("body").append('<input type="hidden" id="' + lock4Id + '" value="' + lockDigest + '"/>');
							}
						}
					}
				}
				fn.success(data, textStatus);
			},
			complete : function(XHR, TS) {
				// 请求完成后回调函数 (请求成功或失败之后均调用)。
			}
		});

		// 修改数据时，默认带上并发字段
		if (_opt.type == "post") {
			var newData = _opt.data;
			if (newData == null) {
				newData = {}
			}
			var isObject = false;
			if (typeof newData == 'object') {
				isObject = true;
			}
			var lockTag = opt.lockTag ? opt.lockTag : "";
			var $lock1 = $("#" + lockTag + "optimisticLock1");
			if ($lock1.length == 1) {
				if (isObject) {
					newData.optimisticLock1 = $lock1.val();
				} else {
					newData = newData + "&optimisticLock1=" + $lock1.val();
				}
				$lock1.remove();
			}
			var $lock2 = $("#" + lockTag + "optimisticLock2");
			if ($lock2.length == 1) {
				if (isObject) {
					newData.optimisticLock2 = $lock2.val();
				} else {
					newData = newData + "&optimisticLock2=" + $lock2.val();
				}
				$lock2.remove();
			}
			var $lock3 = $("#" + lockTag + "pessimisticLock");
			if ($lock3.length == 1) {
				if (isObject) {
					newData.pessimisticLock = $lock3.val();
				} else {
					newData = newData + "&pessimisticLock=" + $lock3.val();
				}
				$lock3.remove();
			}
			var $lock4 = $("#" + lockTag + "lockDigest");
			if ($lock1.length == 1 || $lock2.length == 1 || $lock3.length == 1) {
				if (isObject) {
					newData.lockDigest = $lock4.val();
				} else {
					newData = newData + "&lockDigest=" + $lock4.val();
				}
				$lock4.remove();
			}
			_opt = $.extend(opt, {
				data : newData
			});
		}
		return _ajax(_opt);
	};
})(jQuery);