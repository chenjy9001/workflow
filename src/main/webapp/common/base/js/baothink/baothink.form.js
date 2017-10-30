/**
 * 表单UI标签及绑定默认的插件
 * 
 * @author smatterer
 */
;
(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "jquery" ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	'use strict';
	var pluginName = 'BaothinkForm';
	var version = '0.1';
	var $baothinkForm;
	var ueditor = {};

	var BaothinkForm = function(options) {
		$baothinkForm = $(this);
		BaothinkForm.options = $.extend({}, BaothinkForm._default, options);
		BaothinkForm.data = BaothinkForm.options.data;
		BaothinkForm.event = BaothinkForm.options.event;
		BaothinkForm.callback($(this), BaothinkForm.options, BaothinkForm.data, BaothinkForm.event);
		BaothinkForm.filldata($(this), BaothinkForm.options);
		// BaothinkForm._init($(this), BaothinkForm.options,
		// options.filldata);
		BaothinkForm.createValidator($(this), BaothinkForm.options);
	}

	// 可自定义回调函数
	BaothinkForm.callback = function($element, options, data, event) {
		var callbacks = $.Callbacks();
		// 省市区选择器
		callbacks.add(function($element, options) {
			var $this = $element;
			var options = options.citypicker || BaothinkForm._default.citypicker;
			if ($this.is('[data-type=city-picker]')) {
				// 判断是否已经初始化
				if ($this.siblings('span.city-picker-span').size() <= 0) {
					var dataName = $this.attr("name");// name属性
					var dataType = $this.attr("data-type");// 控件类型
					var dataFor = $this.attr("data-for");// 用于存放其它选中字段值的标签
					var newOptions = $.extend({}, options[dataName], {
						type : dataType,
						dataFor : dataFor
					});
					var newData = {};
					if (data && data[dataName]) {
						newData = data[dataName];
					} else {
						newData = null;
					}
					var newEvent = {};
					if (event && event[dataName]) {
						newEvent = event[dataName];
					} else {
						newEvent = null;
					}
					BaothinkForm.createCityPicker($this, newOptions, newData, newEvent);
				}
			} else {
				$.each($('[data-type=city-picker]', $this), function() {
					// 判断是否已经初始化
					if ($(this).siblings('span.city-picker-span').size() <= 0) {
						var dataName = $(this).attr("name");// name属性
						var dataType = $(this).attr("data-type");// 控件类型
						var dataFor = $(this).attr("data-for");// 用于存放其它选中字段值的标签
						var newOptions = $.extend({}, options, {
							type : dataType,
							dataFor : dataFor,
						});
						var newData = {};
						if (data && data[dataName]) {
							newData = data[dataName];
						} else {
							newData = null;
						}
						var newEvent = {};
						if (event && event[dataName]) {
							newEvent = event[dataName];
						} else {
							newEvent = null;
						}
						BaothinkForm.createCityPicker($(this), newOptions, newData, newEvent);
					}
				});
			}
		});
		// 下拉框
		callbacks.add(function($element, options) {
			var $this = $element;
			var options = options.select || BaothinkForm._default.select;
			if ($this.is('[data-type=select],[data-type=selecttable]')) {
				// 判断是否已经初始化
				if ($this.siblings('span.select2').size() <= 0) {
					var dataName = $this.attr("name");// name属性
					var dataType = $this.attr("data-type");// 控件类型
					var dataUrl = $this.attr("data-url");// 远程地址
					var placeholder = $this.attr("placeholder");// 控件提示内容
					var dataSearch = $this.attr("data-search") == "true";// 是否开启搜索，默认false
					var dataSelectField = $this.attr("data-select-field");// 选中显示的字段
					var dataFor = $this.attr("data-for");// 用于存放其它选中字段值的标签
					var dataForField = $this.attr("data-for-field");// 额外选中的字段
					var dataSelectCount = $this.attr("data-select-count");// 多选模式下允许选择的最大个数
					var dataTags = $this.attr("data-tags") == "true";// 是否填入非下拉选项，默认false
					var dataDefaultId = $this.attr("data-default-id");// 默认选项的id
					var dataDefaultText = $this.attr("data-default-text");// 默认选项的text
					var dataClear = $this.data("clear");// 是否显示清除按钮，默认为ture
					var newOptions = $.extend({}, options[dataName], {
						type : dataType,
						url : dataUrl,
						search : dataSearch,
						placeholder : placeholder,
						selectField : dataSelectField,
						selectFor : dataFor,
						selectForField : dataForField,
						selectCount : dataSelectCount,
						tags : dataTags,
						defaultId : dataDefaultId,
						defaultText : dataDefaultText,
						clear : dataClear
					});
					var newData = {};
					if (data && data[dataName]) {
						newData = data[dataName];
						if (newData && newData.list && dataDefaultId && dataDefaultText) {
							newData.list.unshift({
								id : dataDefaultId,
								text : dataDefaultText
							});
						}
					} else {
						newData = null;
					}
					var newEvent = {};
					if (event && event[dataName]) {
						newEvent = event[dataName];
					} else {
						newEvent = null;
					}
					BaothinkForm.createSelect($this, newOptions, newData, newEvent);
				}
			} else {
				$.each($('[data-type=select],[data-type=selecttable]', $this), function() {
					// 判断是否已经初始化
					if ($(this).siblings('span.select2').size() <= 0) {
						var dataName = $(this).attr("name");// name属性
						var dataType = $(this).attr("data-type");// 控件类型
						var dataUrl = $(this).attr("data-url");// 远程地址
						var placeholder = $(this).attr("placeholder");// 控件提示内容
						var dataSearch = $(this).attr("data-search") == "true";// 是否开启搜索
						var dataSelectField = $(this).attr("data-select-field");// 选中显示的字段
						var dataFor = $(this).attr("data-for");// 用于存放其它选中字段值的标签
						var dataForField = $(this).attr("data-for-field");// 额外选中的字段
						var dataSelectCount = $(this).attr("data-select-count");// 多选模式下允许选择的最大个数
						var dataTags = $(this).attr("data-tags") == "true";// 是否填入非下拉选项，默认false
						var dataDefaultId = $(this).attr("data-default-id");// 默认选项的id
						var dataDefaultText = $(this).attr("data-default-text");// 默认选项的text
						var dataClear = $(this).data("clear");// 是否显示清除按钮，默认为ture
						var newOptions = $.extend({}, options, {
							type : dataType,
							url : dataUrl,
							search : dataSearch,
							placeholder : placeholder,
							selectField : dataSelectField,
							selectFor : dataFor,
							selectForField : dataForField,
							selectCount : dataSelectCount,
							tags : dataTags,
							defaultId : dataDefaultId,
							defaultText : dataDefaultText,
							clear : dataClear
						});
						var newData = {};
						if (data && data[dataName]) {
							newData = data[dataName];
							if (newData && newData.list && dataDefaultId && dataDefaultText) {
								var text = dataSelectField ? dataSelectField : "text";
								newData.list.unshift({
									id : dataDefaultId
								});
								newData.list[0][text] = dataDefaultText;
							}
						} else {
							newData = null;
						}
						var newEvent = {};
						if (event && event[dataName]) {
							newEvent = event[dataName];
						} else {
							newEvent = null;
						}
						BaothinkForm.createSelect($(this), newOptions, newData, newEvent);
					}
				});
			}
		});
		// 上传组件
		callbacks.add(function($element, options) {
			var $this = $element;
			var options = options.uploadfile || BaothinkForm._default.uploadfile;
			var scope = $this.find('.fileinput-button input[type=file]').size() > 0 ? true : false;
			if (scope) {
				// 范围遍历
				$.each($('.fileinput-button input[type=file]', $this), function() {
					var dataName = $(this).attr("name");// name属性
					var newEvent = {};
					if (event && event[dataName]) {
						newEvent = event[dataName];
					} else {
						newEvent = null;
					}
					BaothinkForm.createFileUpload($(this), options, newEvent);
				});
			} else if ($this.is('.fileinput-button input[type=file]')) {// 对象
				var dataName = $this.attr("name");// name属性
				var newEvent = {};
				if (event && event[dataName]) {
					newEvent = event[dataName];
				} else {
					newEvent = null;
				}
				BaothinkForm.createFileUpload($this, options, newEvent);
			}

		});
		// 富文本
		callbacks.add(function($element, options) {
			var $this = $element;
			var options = options.textarea || BaothinkForm._default.textarea;
			if ($this.is('textarea[data-type]')) {
				var dataType = $this.attr("data-type");
				var w = $this.attr('data-width');
				var h = $this.attr('data-height');
				var dataClassifyType = $this.attr("data-classify-type");
				options = $.extend({}, options, {
					type : dataType,
					dataClassifyType : dataClassifyType,
					width : w,
					height : h
				});
				BaothinkForm.createTextarea($this, options);
			} else {
				$.each($('textarea[data-type]', $this), function() {
					var dataType = $(this).attr("data-type");
					var w = $(this).attr('data-width');
					var h = $(this).attr('data-height');
					var dataClassifyType = $(this).attr("data-classify-type");
					options = $.extend({}, options, {
						type : dataType,
						dataClassifyType : dataClassifyType,
						width : w,
						height : h
					});
					BaothinkForm.createTextarea($(this), options);
				});
			}
		});
		// 日期控件
		callbacks.add(function($element, options) {
			var $this = $element;
			var options = options.datatimepicker || BaothinkForm._default.datatimepicker;
			if ($this.is("input[data-type^=datetime]") && $this.is("input[data-type=time]")) {
				var name = $this.attr("name");
				var dataType = $this.attr("data-type").replace("datetime", "");
				var dataStartDate = $this.attr("data-start-date");
				var dataEndDate = $this.attr("data-end-date");
				var dataTimePicker = $this.attr("data-time-picker") == "true";// 时间日期方位控件，是否选中时间
				var dataFormat = $this.attr("data-format");
				options[name] = {
					type : dataType,
					startDate : dataStartDate,
					endDate : dataEndDate,
					timePicker : dataTimePicker,
					format : dataFormat
				}
				var newEvent = {};
				if (event && event[name]) {
					newEvent = event[name];
				} else {
					newEvent = null;
				}
				BaothinkForm.createDateintervalpicker($this, options, newEvent);
			} else {
				$.each($('input[data-type^=datetime],input[data-type=time]', $this), function() {
					var name = $(this).attr("name");
					var dataType = $(this).attr("data-type").replace("datetime", "");
					var dataStartDate = $(this).attr("data-start-date");
					var dataEndDate = $(this).attr("data-end-date");
					var dataTimePicker = $(this).attr("data-time-picker") == "true";// 时间日期方位控件，是否选中时间
					var dataFormat = $(this).attr("data-format");
					options[name] = {
						type : dataType,
						startDate : dataStartDate,
						endDate : dataEndDate,
						timePicker : dataTimePicker,
						format : dataFormat
					}
					var newEvent = {};
					if (event && event[name]) {
						newEvent = event[name];
					} else {
						newEvent = null;
					}
					BaothinkForm.createDateintervalpicker($(this), options, newEvent);
				});
			}
		});
		// iCheck控件
		callbacks.add(function($element, options, data) {
			var $this = $element;

			var scope = $this.find('input:checkbox,input:radio').size() > 0 ? true : false;
			if (scope) {
				$.each($('input:checkbox,input:radio', $this), function() {
					var dataName = $(this).attr("name");// name属性
					var newEvent = {};
					if (event && event[dataName]) {
						newEvent = event[dataName];
					} else {
						newEvent = null;
					}
					BaothinkForm.createiCheck($(this), options, data, newEvent);
				});
			} else if ($this.is('input:checkbox,input:radio')) {
				var dataName = $this.attr("name");// name属性
				var newEvent = {};
				if (event && event[dataName]) {
					newEvent = event[dataName];
				} else {
					newEvent = null;
				}
				BaothinkForm.createiCheck($this, options, data, newEvent);
			}
		});
		callbacks.add(function($element, options) {
			$element.attr("autocomplete", "off");
		});

		// callbacks.add(BaothinkForm.createValidator); // 表单校验
		callbacks.fire($element, options);

	}

	/**
	 * 省市区选择器
	 */
	BaothinkForm.createCityPicker = function($element, options, data, event) {
		var $this = $element;
		var name = $this.attr("name");
		// var tempOptions = {
		// simple : false,
		// level : 'city',
		// province : '江苏省',
		// city : '常州市',
		// district : '溧阳市',
		// placeholder:"提示",
		// responsive:""
		// }
		var options = $.extend({}, BaothinkForm._default.citypicker, options);
		var cityPicker = $this.citypicker(options);
		$this.on('cp:updated', function() {
			var code = $this.data('citypicker').getCode();
			var val = $this.val();
			// 判断需要回写
			var $forTag = $("input[name=" + options.dataFor + "]");
			if ($forTag.length > 0) {
				$forTag.val(code);
			}
			BaothinkForm.valid($this);
			if (event && event.select) {
				event.select($this, code, val);
			}
		});
	};

	/**
	 * radiobutton、checkbox
	 */
	BaothinkForm.createiCheck = function($element, options, data, event) {
		var $this = $element;
		$this.iCheck({
			checkboxClass : 'icheckbox_minimal-blue',
			radioClass : 'iradio_minimal-blue',
			increaseArea : '20%' // optional
		});
		$this.on('ifChecked', function(ev) {
			$(this).prop('checked', true);
			$(this).attr('checked', true);
			BaothinkForm.valid($this);
			if (event && event.checked) {
				event.checked($this, $this.val(), ev);
			}
		}).on('ifUnchecked', function(ev) {
			$(this).prop('checked', false);
			$(this).attr('checked', false);
			if (event && event.unchecked) {
				event.unchecked($this, $this.val(), ev);
			}
		});

	}
	BaothinkForm.createDateintervalpicker = function($element, options, event) {
		var $this = $element;
		var name = $this.attr("name");
		var options = $.extend({}, BaothinkForm._default.datatimepicker, options[name]);
		if (options.type == "range") {// 时间范围
			var todayBtn = 1;
			if (options.startDate) {
				var startDate = getStartOrEndDate(options.startDate);
				if (startDate && startDate != null) {
					options.minDate = startDate;
					options.startDate = moment();
				}
			}
			if (options.endDate) {
				var endDate = getStartOrEndDate(options.endDate);
				if (endDate && endDate != null) {
					options.maxDate = endDate;
					options.endDate = moment();
				}
			}
			var fomat = "YYYY-MM-DD";
			if (options.timePicker) {
				fomat = "YYYY-MM-DD HH:mm";
			}
			var dtOptions = $.extend({}, {
				// startDate: moment().startOf('day'),
				// endDate: moment(),
				// minDate: '01/01/2012', //最小时间
				// maxDate : moment(), // 最大时间
				// dateLimit : {
				// days : 30
				// }, // 起止时间的最大间隔
				showDropdowns : true,
				showWeekNumbers : false, // 是否显示第几周
				timePicker : false, // 是否显示小时和分钟
				timePickerIncrement : 1, // 时间的增量，单位为分钟
				timePicker24Hour : true, // 是否使用24小时制来显示时间
				ranges : {
					// '最近1小时': [moment().subtract(1,'hours'),
					// moment()],
					'今日' : [ moment().startOf('day'), moment() ],
					'昨日' : [ moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day') ],
					'最近7日' : [ moment().subtract(6, 'days'), moment() ],
					'最近30日' : [ moment().subtract(29, 'days'), moment() ],
					"本月" : [ moment().startOf('month'), moment() ],
					"上个月" : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
				},
				buttonClasses : [ 'btn' ],
				applyClass : 'btn-primary btn-sm',
				cancelClass : 'btn-sm',
				locale : {
					direction : "ltr",
					separator : ' 至 ',
					format : fomat, // 控件中from和to
					// 显示的日期格式
					applyLabel : '确定',
					cancelLabel : '取消',
					fromLabel : '起始时间',
					toLabel : '结束时间',
					customRangeLabel : '自定义',
					daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
					monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
					firstDay : 0
				}
			}, options);
			$this.daterangepicker(dtOptions).val("").on("show.daterangepicker", function(ev, picker) {
				if (event && event.show) {
					event.show($this, $this.val(), ev);
				}
				// 动态设置层级，防止被遮住
				$(picker).css("z-index", (BaothinkForm.getMaxZIndex() * 1 + 10));
			}).on("hide.daterangepicker", function(ev, picker) {
				if (event && event.hide) {
					event.hide($this, $this.val(), ev);
				}
			}).on("apply.daterangepicker", function(ev, picker) {
				BaothinkForm.valid($this);
				if (event && event.select) {
					event.select($this, $this.val(), ev);
				}
			}).on("cancel.daterangepicker", function(ev, picker) {
				if (event && event.cancel) {
					event.cancel($this, $this.val(), ev);
				}
			});
		} else {
			var maxView = 4;
			var startView = 2;
			var minView = 2;
			var format = "yyyy-mm-dd hh:ii:ss"
			switch (options.type) {
			case "hour": // 小时视图
				format = "yyyy-mm-dd hh:ii";
				startView = 0;
				minView = 0;
				break;
			case "day": // 日视图
				format = "yyyy-mm-dd hh";
				startView = 1;
				minView = 0;
				break;
			case "month": // 月视图
				format = "yyyy-mm-dd";
				startView = 2;
				minView = 2;
				break;
			case "years": // 年视图
				format = "yyyy-mm";
				startView = 3;
				minView = 3;
				break;
			case "decade": // 十年视图
				format = "yyyy";
				startView = 4;
				minView = 4;
				break;
			case "time": // 时间选择器
				format = "hh:ii";
				maxView = 1;
				startView = 1;
				minView = 0;
				todayBtn = 0;
				var startDate = options.startDate;
				var endDate = options.endDate;
				if (startDate && startDate.indexOf(":") > 0 && startDate.length <= 5) {
					startDate = moment().format('YYYY-MM-DD') + " " + startDate;
				} else {
					startDate = moment().format('YYYY-MM-DD') + " 0:0";
				}
				if (endDate && endDate.indexOf(":") > 0 && endDate.length <= 5) {
					endDate = moment().format('YYYY-MM-DD') + " " + endDate;
				} else {
					endDate = moment().format('YYYY-MM-DD') + " 23:59";
				}
				options.startDate = startDate;
				options.endDate = endDate;
				break;
			default:
				format = "yyyy-mm-dd hh:ii";
				startView = 2;
				minView = 0;
				break;
			}
			if (options.format) {
				format = options.format;
			}
			var todayBtn = 1;
			var startDate = options.startDate;
			var endDate = options.endDate;
			if (startDate) {
				var startDate = getStartOrEndDate(startDate);
				if (startDate && startDate != null) {
					if (moment(startDate).diff(moment(), "minutes") > 0) {// 判断起始时间是否大于当前时间，如果大于，则禁用“今日”按钮
						todayBtn = 0;
					}
					options.startDate = startDate;
				} else {
					delete options.startDate;
				}
			}
			if (endDate) {
				var endDate = getStartOrEndDate(endDate);
				if (endDate && endDate != null) {
					if (moment(endDate).diff(moment(), "minutes") < 0) {// 判断结束时间是否小于当前时间，如果小于，则禁用“今日”按钮
						todayBtn = 0;
					}
					options.endDate = endDate;
				} else {
					delete options.endDate;
				}
			}
			var dtOptions = $.extend({}, {
				language : 'zh-CN',
				format : format,
				todayBtn : todayBtn,
				minuteStep : 1,
				autoclose : 1,
				startView : startView, // 这里就设置了默认视图为年视图
				maxView : maxView,
				minView : minView
			// 设置最小视图为年视图
			}, options);
			$this.datetimepicker(dtOptions).unbind("changeDate").on('changeDate', function(ev) {
				BaothinkForm.valid($this);
				autoSetStartDateAndEndDate($(this));
				if (event && event.select) {
					event.select($this, $this.val(), ev);
				}
			}).on('show', function(ev) {
				if (event && event.select) {
					event.show($this, $this.val(), ev);
				}
			}).on('hide', function(ev) {
				if (event && event.select) {
					event.hide($this, $this.val(), ev);
				}
			});
		}
	};

	/**
	 * 自动根据关联的日期控件设置起始时间和结束时间
	 */
	function autoSetStartDateAndEndDate(elment) {
		var dateVal = elment.val();
		if (dateVal && dateVal != "") {
			var dataType = elment.attr("data-type");
			if (dataType == "time") {
				dateVal = moment().format('YYYY-MM-DD') + " " + dateVal;
			}
			var endDate = elment.attr("data-end-date");
			if (endDate && !endDate.isDateTime()) {
				var $endDate = $("#" + endDate);
				if ($endDate && $endDate.length == 1) {
					$endDate.datetimepicker('setStartDate', dateVal);
				}
			}
			var startDate = elment.attr("data-start-date");
			if (startDate && !startDate.isDateTime()) {
				var $startDate = $("#" + startDate);
				if ($startDate && $startDate.length == 1) {
					$startDate.datetimepicker('setEndDate', dateVal);
				}
			}
		}
	}
	// 字符串转换成时间（用于时间控件的起始时间和结束时间）
	function getStartOrEndDate(dateStr) {
		var newDate = null;
		if (dateStr == "today") {// 判断起始时间是否设置成当前时间
			newDate = moment().format('YYYY-MM-DD HH:mm:ss');
		} else if (dateStr.indexOf("today-") == 0 || dateStr.indexOf("today+") == 0) {
			var type = dateStr.substring(5, 6);
			var num = dateStr.substring(6, dateStr.length - 1);
			var dateType = dateStr.substring(dateStr.length - 1, dateStr.length);
			newDate = getAddOrSubtractDate(type, num, dateType);
		} else if (dateStr.isDateTime()) {// 判断是否是时间
			newDate = dateStr;
		}
		return newDate;
	}

	function getAddOrSubtractDate(type, num, dateType) {
		var dt = "days";
		switch (dateType) {
		case "y":
			dt = "years"
			break;
		case "M":
			dt = "months"
			break;
		case "d":
			dt = "days"
			break;
		case "h":
			dt = "hours"
			break;
		case "m":
			dt = "minutes"
			break;
		case "s":
			dt = "seconds"
			break;
		default:
			dt = "days"
			break;
		}
		if ('+' == type) {
			return moment().add(num, dt).format('YYYY-MM-DD HH:mm:ss');
		} else if ("-" == type) {
			return moment().subtract(num, dt).format('YYYY-MM-DD HH:mm:ss');
		}
	}

	// 上传附件
	BaothinkForm.createFileUpload = function($elment, options, event) {
		var $this = $elment || $(this);
		var options = $.extend({}, BaothinkForm._default.uploadfile, options);
		var tempFn = doT.template(options.url);
		var vurl = tempFn({
			recType : $this.attr('data-rec-type') || 'default',
			fileType : $this.attr('data-type') || 'file'
		});

		$this.fileupload({
			url : vurl,
			dataType : 'json',
			done : options.formatTemplate,
			progressall : function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css('width', progress + '%');
			}
		}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	};

	// 下拉框
	BaothinkForm.createSelect = function($elment, options, related, event) {
		var $this = $elment;
		if ($this.length == 0) {
			return false;
		}
		var name = $this.attr("name");
		var options = $.extend({}, BaothinkForm._default.select, options);
		var typeTemplateResult = {
			select : function(result) {
				if (!result/* || result.id == result.text */) {
					return null;
				}
				var tempFn = doT.template(options.singleTemplate);
				var $resulthtml = "";
				if (result.loading) {
					var newresult = {};
					newresult["text"] = result.text;
					$resulthtml = $(tempFn(newresult));
				} else {
					$resulthtml = $(tempFn(result));
				}
				return $resulthtml;
			},
			selecttable : function(result) {
				if (!result/* || result.id == result.text */) {
					return null;
				}
				var $tmpTB = $(result.tag).siblings('table.table');
				var tempFn = doT.template(options.tableTemplate);
				var newresult = {};
				var $resulthtml = "";
				if (result.loading) {
					newresult["text"] = result.text;
					$resulthtml = $(tempFn(newresult));
					var colspan = related && related.columns ? related.columns.length : ($tmpTB.size() ? $tmpTB.find("thead tr th").size() : 2);
					$resulthtml.attr("colspan", colspan);
				} else {
					if (related && related.columns) {
						$.each(related.columns, function(index, item) {
							var resultVal = result[item.data];
							newresult[item.data] = resultVal ? resultVal : "";
						});
					} else if ($tmpTB.size() > 0) {
						$.each($('thead tr th', $tmpTB), function() {
							var resultVal = result[$(this).attr('data-field')];
							newresult[$(this).attr('data-field')] = resultVal ? resultVal : "";
						});
					} else {
						for ( var key in result) {
							if (key == 'element' || key == 'selected' || key == 'disabled' || key == 'tag') {
							} else {
								newresult[key] = result[key]
							}
						}
					}
					$resulthtml = $(tempFn(newresult));
				}
				return $resulthtml;
			},
			selecttree : function() {
				if (!result || result.selected == undefined) {
					return null;
				}
				var arr = [];
				$.each(data, function(index) {
					for ( var k in this) {
						if (k == 'pid') {
							var newnode = this;
							$.each(data, function() {
								if (newnode.pid == this.id) {
									newnode.level = this.level - 0 + 1;
									for (var i = 0; i < newnode.level; i++) {
										newnode.cn = "&nbsp;" + newnode.cn;
									}
									return true;
								}
							});
							arr[index] = newnode;
						} else {
							this.level = 0;
							arr[index] = this;
						}
					}
					arr[index] = this;
				})

			}
		};
		var selectconf = {
			placeholder : options.placeholder,
			selectField : options.selectField,// 自定义显示字段
			language : 'zh-CN',
			theme : "classic",
			tags : options.tags,
			allowClear : options.clear == "false" || options.clear == false ? false : true,
			dropdownAutoWidth : true,
			templateResult : typeTemplateResult[options.type || 'select'],
			templateSelection : function(row) {// 选中事件
				if (row.selected || (row.element != undefined && row.element.selected != undefined)) {
					row.selected = true;
					// 额外选中的字段值
					if (options.selectFor) {
						if (options.selectFor.indexOf(",") > 0) {
							var selectFors = options.selectFor.split(",");
							var selectForFields = [];
							if (options.selectForField && options.selectForField.indexOf(",") > 0) {
								selectForFields = options.selectForField.split(",");
							}
							$.each(selectFors, function(index, item) {
								var $forTag = $("input[name=" + item + "]");
								if ($forTag && $forTag.size() > 0) {
									var field = selectForFields[index];
									if (!field) {
										field = item;
									}
									// 防止回写数据时，把附属的文本框的值给清除了
									if (typeof (row[field]) != "undefined") {
										$forTag.val(row[field]);
									}
								}
							});
						} else {
							var $forTag = $("input[name=" + options.selectFor + "]");
							if ($forTag && $forTag.size() > 0) {
								var field = options.selectForField;
								if (!field) {
									field = options.selectFor;
								}
								// 防止回写数据时，把附属的文本框的值给清除了
								if (typeof (row[field]) != "undefined") {
									$forTag.val(row[field]);
								}
							}
						}
					}
					if (options.selectField) {
						return row[options.selectField] || row.text || row.name || row.id;
					}
					return row.text || row.name || row.id;
				}
				return false;
			},
			matcher : function($term, $text) {
				if ($.trim($term.term) == '') {
					return $text;
				}
				for ( var key in $text) {
					if (typeof $text[key] == 'string') {
						if ($text[key].toUpperCase().indexOf($term.term.toUpperCase()) >= 0) {
							$text.selected = true;
							return $text;
						}
					}
				}
				return false;
			}
		};
		// 判断是否启用搜索
		if (!options.search) {
			selectconf = $.extend({}, selectconf, {
				minimumResultsForSearch : Infinity
			});
		}
		// 设置最大可选择个数
		if (options.selectCount) {
			selectconf = $.extend({}, selectconf, {
				maximumSelectionLength : options.selectCount
			});
		}
		if (related && related.columns) {
			selectconf.dataTableColumns = related.columns;
		}
		// 根据值来初始化Select或table
		if (related && related.list) {
			selectconf.data = related.list;
		} else if (options.url) {// ajax加载
			selectconf.ajax = {
				url : options.url,
				dataType : 'json',
				delay : 250,
				data : function(params) {
					return {
						keyWord : params.term,
						pageNum : (params.page ? params.page : 1),
						length : 10
					};
				},
				processResults : function(data, params) {
					params.page = params.page || 1;
					params.pagerows = params.pagerows || 10;
					return {
						results : data.result,
						pagination : {
							more : (params.page * params.pagerows) < data.total_count
						}
					};
				},
				cache : true
			};
			selectconf.dropdownAutoWidth = true;
		}

		var vselect = $this.select2(selectconf).on("select2:select", function(ev) {// 选中事件
			if (ev.params.data.id != '') {
				if ($(this).attr("multiple") != "multiple") {
					$('option', this).removeAttr('selected');
					$('option', this).removeProp('selected');
				}
				$('option[value=\"' + ev.params.data.id + '\"]', this).attr('selected', ev.params.data.selected);
				$('option[value=\"' + ev.params.data.id + '\"]', this).prop('selected', ev.params.data.selected);
			}
			BaothinkForm.valid($this);
			if (event && event.select) {
				event.select($this, ev.params.data, ev);
			}
		}).on("select2:open", function(ev) {// 打开下拉框事件
			if (event && event.show) {
				event.show($this, ev.params.data, ev);
			}
		}).on("select2:close", function(ev) {// 关闭下拉框事件
			if (event && event.hide) {
				event.hide($this, ev.params.data, ev);
			}
		}).on("select2:unselect", function(ev) {// 删除事件
			if (ev.params.data.id != '') {
				$('option[value=\"' + ev.params.data.id + '\"]', this).removeAttr('selected');
				$('option[value=\"' + ev.params.data.id + '\"]', this).removeProp('selected');
			}
			if ($("option[selected]", this).length == 0) {
				$(this).val("");
			}
			BaothinkForm.valid($this);
			if (event && event.clear) {
				event.clear($this, ev.params.data, ev);
			}
		});

		// 设置默认值
		if (related && related.value != undefined) {
			if ($.isArray(related.value)) {
				$.each(related.value, function() {
					$('option[value=\"' + this + '\"]', vselect).attr('selected', true);
					$('option[value=\"' + this + '\"]', vselect).prop('selected', true);
				})
			} else {
				$('option[value=\"' + related.value + '\"]', vselect).attr('selected', true);
				$('option[value=\"' + related.value + '\"]', vselect).prop('selected', true);
			}
			vselect.val(related.value).trigger("change");
		}
	};

	// 创建富文本框
	BaothinkForm.createTextarea = function($elment, options, content) {
		var $this = $elment;
		var options = $.extend({}, BaothinkForm._default.textarea, options);

		$this.attr('id', $this.attr('id') + new Date().getTime());
		var ue = UE.getEditor($this.attr('id'), {
			autoHeightEnabled : true,
			enableAutoSave : false,
			imgClassifyType : options.imgClassifyType,
			initialFrameHeight : options.height || 500,
			initialFrameWidth : options.width || "100%",// 默认自适应宽度
			zIndex : BaothinkForm.getMaxZIndex() * 1 + 10,
			// toolbars : [ [ 'fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'directionalityltr', 'directionalityrtl', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|', 'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|', 'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|', 'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|', 'print', 'preview', 'searchreplace', 'drafts', 'help' ] ],
			toolbars : [ [ 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'superscript', 'subscript', '|', 'forecolor', 'backcolor', '|', 'removeformat', '|', 'insertorderedlist', 'insertunorderedlist', '|', 'selectall', 'cleardoc', 'paragraph', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|', 'simpleupload', 'insertimage', /* 'attachment', */'|', 'horizontal', 'preview', 'drafts', 'formula' ] ]
		});
		ue.ready(function() {
			ue.addListener('selectionchange', function(editor) {
				$elment.val(ue.getContent());
				BaothinkForm.valid($this);
			});
		});
		ueditor[$this.attr("name")] = ue;
	}

	/**
	 * 验证数据有效性
	 */
	BaothinkForm.valid = function(elment) {
		try {
			elment.rules();
			elment.valid();
		} catch (e) {
		}
	};

	// 默认配置变量
	BaothinkForm._default = {
		version : version,
		pluginName : pluginName,
		uploadfile : {
			url : basePath + 'fileserver/{{=it.fileType}}/{{=it.recType}}/upload.htm',
			getfile : basePath + 'fileserver/loadImage/{{=it.id}}',
			imageTemplate : '<img src="' + basePath + 'fileserver/loadImage/{{=it.id}}" style="width: 120px;height: 100px;" class="img-thumbnail" />',
			fileTemplate : '<div class="fileitem"><a href="' + basePath + 'fileserver/downloadFile/{{=it.id}}" target="_blank"><i class="glyphicon glyphicon-list-alt"></i>{{=it.fileName}}</a>&nbsp;&nbsp;<i class="glyphicon glyphicon-remove"></i></div>',
			formatTemplate : function(e, data) {
				if (data.result.success) {
					var file = data.result.data;
					var dataType = $(this).attr('data-type');
					var $filevalue = $('input[name=' + $(this).attr('data-for') + '][type=hidden]', $baothinkForm);
					if ($filevalue.val() != '' && $(this).attr('data-multifile') == 'true') {
						$filevalue.val($filevalue.val() + ',' + file.id);
					} else if ($filevalue.val() != '' && $(this).attr('data-multifile') == 'false') {
						$filevalue.val(file.id);
					} else {
						$filevalue.val(file.id);
					}

					var $fileuploadResult = $(this).parent().siblings('.fileinput-return');
					if (dataType == "img") {
						var tempFn = doT.template(BaothinkForm.options.uploadfile.imageTemplate);
						var resulthtml = tempFn(file);
						$(this).attr('data-multifile') == 'true' ? $(resulthtml).appendTo($fileuploadResult) : $fileuploadResult.html(resulthtml);
					} else {
						var tempFn = doT.template(BaothinkForm.options.uploadfile.fileTemplate);
						var resulthtml = tempFn(file);
						$(this).attr('data-multifile') == 'true' ? $(resulthtml).appendTo($fileuploadResult) : $fileuploadResult.html(resulthtml);
					}
				} else {
					top.layer.alert(data.result.errorMsg, {
						icon : 0,
						title : "提示"
					});
				}
			},
			doneEvent : function() {
				$('div.fileinput-return div.fileitem i.glyphicon-remove').live('click', function() {
					$(this).parent().remove();
				});
			}
		},
		select : {
			type : undefined, // single,table,ajax,tree
			url : '',
			singleTemplate : '<td>{{=it.text}}</td>',
			tableTemplate : '{{ for (var key in it ){ }}<td>{{= it[key] }}</td>{{ } }}'
		},
		textarea : {
			type : 'ueditor', // bootstrap-wysiwyg,ueditor,
			imgClassifyType : 'defalut'
		},
		datatimepicker : {
			type : 'datatime',
		},
		iCheck : {},
		filldata : {},
		cmd : {
			template : '{{~ it:value:index}}<button id={{=value.id}} type="button" class="btn btn-_default">{{=value.name}}</button>{{~ }}',
			_default : [ '<button type="button" class="btn btn-_default btnclose">关闭</button>', '<button type="button" class="btn btn-_default btnprint">打印</button>' ]
		}
	};

	BaothinkForm._init = function($element, options) {
		if (options.url) {
			$.getJSON(options.url, function(data) {
				BaothinkForm.createFilldata($element, options, data.filldata);
				// BaothinkForm.createCmd(options.cmd, data.cmd);
			});
		} else {
			BaothinkForm.createFilldata($element, options);
			// options.cmd == undefined ?
			// "":BaothinkForm.createCmd(options.cmd, data.cmd);
		}
	};

	// 表单校验
	BaothinkForm.createValidator = function($element, options) {
		// 自动为必填字段增加*号
		$.each($('[required]', $element), function() {
			var $label = $(this).parent().parent().find("label.control-label");
			$label.addClass("required");
		});

		// 判断是否需要验证隐藏标签，如果是富文本编辑器和省市区选择器，则需要验证隐藏标签
		if ($element.has('input[data-type="ueditor"]') || $element.has('textarea[data-type="ueditor"]') || $element.has('input[data-type=city-picker]')) {
			$.validator.setDefaults({
				ignore : ""
			});
		}

		var $form = null;
		// 增加token
		if ($element.is("form")) {
			$form = $element;
		} else if ($element.find("form").length == 1) {
			$form = $element.find("form");
		}
		if ($form != null) {
			$.ajax({
				type : 'POST',
				url : basePath + "loadToken.htm",
				success : function(data, textStatus, jqXHR) {
					$form.append('<input type="hidden" name="token" value="' + data.data + '"/>');
				},
				dataType : "json",
				traditional : true
			});
		}
	}

	// 前置数据填充
	// createFilldata
	BaothinkForm.createFilldata = function($element, options, data) {
		var $this = $element;
		var data = data || options.filldata;
		for ( var key in data) {
			if ($('input[name=' + key + '][data-type=img]', $this).size() > 0 || $this.is('input[name=' + key + '][data-type=img]')) {
				var tempFn = doT.template(BaothinkForm.options.uploadfile.getfile);
				var imgsrc = tempFn({
					id : data[key]
				});
				$this.attr('data-name') == undefined ? $('img[data-name=' + key + ']', $this).attr('src', imgsrc) : $this.attr('src', imgsrc);
			} else if ($('input:checkbox[name=' + key + '],input:radio[name=' + key + ']', $this).size() > 0 || $this.is('input:checkbox[name=' + key + '],input:radio[name=' + key + ']')) {
				$this.attr('name') == undefined ? $('input:checkbox[name=' + key + '][value="' + data[key] + '"],input:radio[name=' + key + '][value="' + data[key] + '"]', $this).prop('checked', true) : $this.prop('checked', true);
				$this.attr('name') == undefined ? $('input:checkbox[name=' + key + '][value="' + data[key] + '"],input:radio[name=' + key + '][value="' + data[key] + '"]', $this).attr('checked', true) : $this.attr('checked', true);

			} else if ($('select[name=' + key + ']', $this).size() > 0 || $this.is('select[name=' + key + ']')) {
				if (data[key].list == undefined) {// 没有传列表，直接在页面上面定义option选项
					if (data[key].value != undefined) {
						$.each(data[key].value, function() {
							$this.attr('name') == undefined ? $('select[name=' + key + ']', $this).find('option[value=' + this + ']').prop('selected', true) : $this.find('option[value=' + this + ']').prop('selected', true);
						});
					}
				} else {// 存在列表
					BaothinkForm.createSelect($this.attr('name') == undefined ? $('select[name=' + key + ']', $this) : $this, BaothinkForm.options.select, data[key]);
				}
			} else if ($('script[data-type=ueditor][name=' + key + ']', $this).size() > 0 || $this.is('script[data-type=ueditor][name=' + key + ']')) {
				$this.attr('name') == undefined ? $('script[data-type=ueditor][name=' + key + ']', $this).html(data[key]) : $this.html(data[key]);
			}

			if ($this.is('span.' + key + ',input:text[name=' + key + '],input:password[name=' + key + '],input:hidden[name=' + key + ']')) {
				$this.val(data[key]);
			}
			$('span.' + key + ',input:text[name=' + key + '],input:password[name=' + key + '],input:hidden[name=' + key + ']', $this).val(data[key]);
		}
	}

	BaothinkForm.getMaxZIndex = function() {
		var index_highest = 0;
		$('div').each(function() {
			var index_current = parseInt($(this).css('z-index'), 10);
			if (index_current > index_highest) {
				index_highest = index_current;
			}
		});
		return index_highest;
	}

	// 前置数据填充
	// createFilldata
	BaothinkForm.filldata = function($element, options) {
		var $this = $element;
		var data = options.value;
		if (data) {
			// 初始化编辑窗口的数据
			$.each(data, function(name, value) {
				var $input = $this.find("input[name=" + name + "]");
				if ($input.length > 0) {
					var inputType = $input.attr("type");
					switch (inputType) {
					case "text":
					case "hidden":
						$input.val(value);
						if ($input.is('[data-type=city-picker]')) {
							$input.citypicker('refresh');
						} else if ($input.is('[data-type=img]')) {
							if (value) {
								var ids = value.split(",");
								var tempFn = doT.template(BaothinkForm.options.uploadfile.getfile);
								var $fileuploadResult = $input.parent().siblings('.fileinput-return');
								$.each(ids, function(index, id) {
									var tempFn = doT.template(BaothinkForm.options.uploadfile.imageTemplate);
									var resulthtml = tempFn({
										id : id
									});
									$(resulthtml).appendTo($fileuploadResult);
								});
							}
						}
						break;
					case "radio":
						$input.each(function() {
							if ($(this).val() == value) {
								$(this).iCheck('check');
							}
						});
						break;
					case "checkbox":
						if (value == "1") {
							$input.iCheck('check');
						}
						break;
					default:
						$input.val(value);
					}
				} else {
					var $textarea = $this.find("textarea[name=" + name + "]");
					if ($textarea.length > 0) {
						if ($textarea.data("type") == "ueditor" && ueditor[name]) {
							ueditor[name].ready(function() {
								// 异步回调
								ueditor[name].setContent(value);
							});
						} else {
							$textarea.val(value)
						}
					}
					var $select = $this.find("select[name=" + name + "]");
					if ($select.length > 0) {
						// 设置远程数据下拉的回写，必须是能够获取显示的字段属性，才能回写
						var dataUrl = $select.attr("data-url");
						var dataSelectField = $select.attr("data-select-field");
						var dataFor = $select.attr("data-for");
						var backFieldName = dataSelectField;
						if (dataUrl && dataSelectField && dataFor) {
							var fors = dataFor.split(",");
							var isDisPlay = false;
							if ($.inArray(dataSelectField, fors) == -1) {
								var dataForField = $select.attr("data-for-field");
								if (dataForField) {
									var forFileds = dataForField.split(",");
									if ($.inArray(dataSelectField, forFileds) == 0) {
										backFieldName = dataFor;
									}
								}
							}
							if (dataSelectField == "id") {
								backFieldName = $select.attr("name");
							}
							var backFieldValue = options.value[backFieldName];
							if (backFieldValue) {
								var option = document.createElement('option');
								option.textContent = backFieldValue;
								option.value = value;
								$select.append(option);
							}
						}
						$select.val(value).trigger("change");
					}
				}
			});
		}
		$.each($('input[data-type^=datetime],input[data-type=time]', $this), function() {
			autoSetStartDateAndEndDate($(this));
		});
	}
	// 表单功能
	BaothinkForm.createCmd = function(options, data) {
		var options = $.extend({}, BaothinkForm._default.cmd, options);
		var tempFn = doT.template(options.template);
		var resulthtml = tempFn(data);
		$(resulthtml).appendTo($('.form-cmd'));

		$.each(options._default, function() {
			$(this).appendTo($('.form-cmd'));
		});
	};

	// $.extend($.fn,BaothinkForm);
	$.fn.baothinkform = BaothinkForm;
}));