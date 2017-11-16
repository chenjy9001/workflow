//自定义js

//公共配置
var menuList;
/**
 * 初始化菜单数据
 */
function initOneLevelMenu() {
	/*$.ajax({
		url : basePath + 'sys/authority/getUserMenuAsync.htm',
		type : 'post',
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.success) {
				menuList = data.data.menuChild;
				// 使用模板加载一级菜单
				var dataTemplate = {
					list : data.data.menuMain
				};
				var menu1 = "{{each list as value index}}";
				menu1 = menu1 + "{{if value.parentMenuCode==null||value.parentMenuCode==''}}";
				menu1 = menu1 + "<li class='{{if index==0}}active{{/if}}'>";
				menu1 = menu1 + "<a data-menu='{{value.menuCode}}'>{{value.menuName}}</a></li>";
				menu1 = menu1 + "{{/if}}";
				menu1 = menu1 + "{{/each}}";
				var render = template.compile(menu1);
				var html = render(dataTemplate);
				$("#oneLevelMenu").html(html);
				oneLevelMenuClickEven();
			} else {
				layer.alert(data.errorMsg, {
					icon : 2
				});
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
		}
	});*/
	
	oneLevelMenuClickEven();
}

function initTwoLevelMenu(menuCode) {
	/*var menuSource = '<ul class="nav" id="side-menu">';
	menuSource = menuSource + '{{each list as menu index}}';
	menuSource = menuSource + '<li>';
	menuSource = menuSource + '{{if menu.parentMenuCode==menuCode}}';
	menuSource = menuSource + '	<a href="#">';
	menuSource = menuSource + '		<i class="fa {{menu.imageFile}}"></i> <span class="nav-label">{{menu.menuName}}</span> <span class="fa arrow"></span>';
	menuSource = menuSource + '	</a>';
	menuSource = menuSource + '	{{if menu.childList!=null||menu.childList!=""}}';
	menuSource = menuSource + '	   <ul class="nav nav-second-level">';
	menuSource = menuSource + '    {{each menu.childList as child indexC}}';
	menuSource = menuSource + '		     <li><a class="J_menuItem" {{if child.optionsInfo1!=null&&child.optionsInfo1!=""}}{{if child.optionsInfo1.indexOf("?")>0}}href="{{child.optionsInfo1}}&menuCode={{child.menuCode}}"{{else}}href="{{child.optionsInfo1}}?menuCode={{child.menuCode}}"{{/if}}{{else}}href=""{{/if}} data-index="0">';
	menuSource = menuSource + '        {{child.menuName}}</a></li>';
	menuSource = menuSource + '    {{/each}}';
	menuSource = menuSource + '	   </ul>';
	menuSource = menuSource + '	{{/if}}';
	menuSource = menuSource + '	{{/if}}';
	menuSource = menuSource + '</li>';
	menuSource = menuSource + '{{/each}}';
	menuSource = menuSource + '</ul>';
	var dataTemplate = {
		list : menuList,
		menuCode : menuCode
	};
	var render = template.compile(menuSource);
	var html = render(dataTemplate);
	return html;*/
	var html = '<ul class="nav" id="side-menu">';
	html = html + "<li>";
	html = html + "<a href='#'>";
	html = html + "   <i class='fa'></i><span class='nav-label'>工作流管理</span><span class='fa arrow'></span>";
	html = html + " </a>";
	html = html + "<ul class='nav nav-second-level'>";
	html = html + "<li><a class='J_menuItem' href ='workflow/model/list' dataindex='1'>模板管理</a></li>";
	html = html + "<li><a class='J_menuItem' href ='workflow/process/toContent.html' dataindex='2'>流程管理</a></li>";
	html = html + "<li><a class='J_menuItem' href ='workflow/processing/toContent.html' dataindex='3'>流程实例管理</a></li>";
	html = html + "<li><a class='J_menuItem' href ='workflow/history/toContent.html' dataindex='4'>流程实例历史查询</a></li>";
	html = html + "<li><a class='J_menuItem' href ='workflow/user/toContent.html' dataindex='5'>用户管理</a></li>";
	html = html + "<li><a class='J_menuItem' href ='workflow/group/toContent.html' dataindex='6'>群组管理</a></li>";
	html = html + "</ul>";
	html = html + "</li>";
	html = html + "<li>";
	html = html + "<a href='#'>";
	html = html + "   <i class='fa'></i><span class='nav-label'>接口管理</span><span class='fa arrow'></span>";
	html = html + " </a>";
	html = html + "<ul class='nav nav-second-level'>";
	html = html + "<li><a class='J_menuItem' href ='si/siInterLog/manage.html' dataindex='1'>接口日志</a></li>";
	html = html + "<li><a class='J_menuItem' href ='si/siUser/manage.html' dataindex='2'>接口账号管理</a></li>";
	html = html + "<li><a class='J_menuItem' href ='si/siInterDefine/manage.html' dataindex='3'>接口配置管理</a></li>";
	html = html + "</ul>";
	html = html + "</li>";
	html = html + "</ul>";
	return html;
	
}
/**
 * 一级菜单点击事件<br>
 * 
 * @since ecp-demo-web-admin1.0
 */
function oneLevelMenuClickEven() {
	$("#page-wrapper .nav-pills a").click(function() {
		$("#page-wrapper .nav-pills li").removeClass("active");
		$(this).parent().addClass("active");
		var menuCode = $(this).attr("data-menu");
		setMenu(menuCode);
	});
	setMenu($("#page-wrapper .nav-pills li.active a").attr("data-menu"));
}
/**
 * 切换二级三级菜单 <br>
 * 
 * @param menuCode
 *            一级菜单代码
 * @since ecp-demo-web-admin 0.0.1
 */
function setMenu(menuCode) {
	var menu = initTwoLevelMenu(menuCode);
	var $menuUL = $(".sidebar-collapse");
	$menuUL.empty();
	$menuUL.html(menu);
	initMenuEvent();
}
function initMenuEvent() {
	$("#side-menu").metisMenu();
	$("#side-menu>li").click(function() {
		$("body").hasClass("mini-navbar") && NavToggle();
	});
	$("#side-menu>li li a").click(function() {
		$(window).width() < 769 && NavToggle();
	});
	initMenuClick();
}
function initMenu() {
	// 初始化一级菜单
	initOneLevelMenu();
	// 初始化一级菜单的点击事件
	oneLevelMenuClickEven();

}
function NavToggle() {
	$(".navbar-minimalize").trigger("click");
}

function SmoothlyMenu() {
	if ($("body").hasClass("mini-navbar")) {
		if ($("body").hasClass("fixed-sidebar")) {
			$("#side-menu").hide();
			setTimeout(function() {
				$("#side-menu").fadeIn(500);
			}, 300);
		} else {
			$("#side-menu").removeAttr("style");
		}
	} else {
		$("#side-menu").hide();
		setTimeout(function() {
			$("#side-menu").fadeIn(500);
		}, 100);
	}
}

function localStorageSupport() {
	return "localStorage" in window && null !== window.localStorage;
}

$(document).ready(function() {
	initMenu();
	// MetsiMenu
	$('#side-menu').metisMenu();

	// 打开右侧边栏
	$('.right-sidebar-toggle').click(function() {
		$('#right-sidebar').toggleClass('sidebar-open');
	});

	// 右侧边栏使用slimscroll
	$('.sidebar-container').slimScroll({
		height : '100%',
		railOpacity : 0.4,
		wheelStep : 10
	});

	// 打开聊天窗口
	$('.open-small-chat').click(function() {
		$(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
		$('.small-chat-box').toggleClass('active');
	});

	// 聊天窗口使用slimscroll
	$('.small-chat-box .content').slimScroll({
		height : '234px',
		railOpacity : 0.4
	});

	// Small todo handler
	$('.check-link').click(function() {
		var button = $(this).find('i');
		var label = $(this).next('span');
		button.toggleClass('fa-check-square').toggleClass('fa-square-o');
		label.toggleClass('todo-completed');
		return false;
	});

	// 固定菜单栏
	$('.sidebar-collapse').slimScroll({
		height : '100%',
		railOpacity : 0.9,
		alwaysVisible : false
	});

	// 菜单切换
	$('.navbar-minimalize').click(function() {
		$("body").toggleClass("mini-navbar");
		SmoothlyMenu();
	});

	// 侧边栏高度
	function fix_height() {
		var heightWithoutNavbar = $("body > #wrapper").height() - 61;
		$(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
	}
	fix_height();

	$(window).bind("load resize click scroll", function() {
		if (!$("body").hasClass('body-small')) {
			fix_height();
		}
	});

	// 侧边栏滚动
	$(window).scroll(function() {
		if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
			$('#right-sidebar').addClass('sidebar-top');
		} else {
			$('#right-sidebar').removeClass('sidebar-top');
		}
	});

	$('.full-height-scroll').slimScroll({
		height : '100%'
	});

	$('#side-menu>li').click(function() {
		if ($('body').hasClass('mini-navbar')) {
			NavToggle();
		}
	});
	$('#side-menu>li li a').click(function() {
		if ($(window).width() < 769) {
			NavToggle();
		}
	});

	$('.nav-close').click(NavToggle);

	// ios浏览器兼容性处理
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		$('#content-main').css('overflow-y', 'auto');
	}
	// 退出登录
	$("a#logout").click(function() {
		layer.confirm('是否退出登录？', {
			icon : 3,
			title : '提示'
		}, function(index) {
			$.ajax({
				type : "get",
				dataType : "json",
				url : basePath + "login/logoutAsync.htm",
				success : function(content) {
					if (content.success == true) {
						window.location.href = basePath + "login.html";
					} else {
						layer.alert(content.errorMsg, {
							icon : 2
						});
					}
				},
				error : function(a, b) {
					layer.alert("退出登录失败，请刷新后再试！", {
						icon : 2
					});
				}
			});
			layer.close(index);
		});

	});

	
	
	

});

function NavToggle() {
	$('.navbar-minimalize').trigger('click');
}

function SmoothlyMenu() {
	if (!$('body').hasClass('mini-navbar')) {
		$('#side-menu').hide();
		setTimeout(function() {
			$('#side-menu').fadeIn(500);
		}, 100);
	} else if ($('body').hasClass('fixed-sidebar')) {
		$('#side-menu').hide();
		setTimeout(function() {
			$('#side-menu').fadeIn(500);
		}, 300);
	} else {
		$('#side-menu').removeAttr('style');
	}
}

// 主题设置
$(function() {
	// $(window).bind("load resize", function() {
	// if ($(this).width() < 769) {
	// $('body').addClass('mini-navbar');
	// $('.navbar-static-side').fadeIn();
	// }
	// });
	// 顶部菜单固定
	$('#fixednavbar').click(function() {
		if ($('#fixednavbar').is(':checked')) {
			$(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
			$("body").removeClass('boxed-layout');
			$("body").addClass('fixed-nav');
			$('#boxedlayout').prop('checked', false);

			if (localStorageSupport) {
				localStorage.setItem("boxedlayout", 'off');
			}

			if (localStorageSupport) {
				localStorage.setItem("fixednavbar", 'on');
			}
		} else {
			$(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
			$("body").removeClass('fixed-nav');

			if (localStorageSupport) {
				localStorage.setItem("fixednavbar", 'off');
			}
		}
	});

	// 收起左侧菜单
	$('#collapsemenu').click(function() {
		if ($('#collapsemenu').is(':checked')) {
			$("body").addClass('mini-navbar');
			SmoothlyMenu();

			if (localStorageSupport) {
				localStorage.setItem("collapse_menu", 'on');
			}

		} else {
			$("body").removeClass('mini-navbar');
			SmoothlyMenu();

			if (localStorageSupport) {
				localStorage.setItem("collapse_menu", 'off');
			}
		}
	});

	// 固定宽度
	$('#boxedlayout').click(function() {
		if ($('#boxedlayout').is(':checked')) {
			$("body").addClass('boxed-layout');
			$('#fixednavbar').prop('checked', false);
			$(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
			$("body").removeClass('fixed-nav');
			if (localStorageSupport) {
				localStorage.setItem("fixednavbar", 'off');
			}
			if (localStorageSupport) {
				localStorage.setItem("boxedlayout", 'on');
			}
		} else {
			$("body").removeClass('boxed-layout');

			if (localStorageSupport) {
				localStorage.setItem("boxedlayout", 'off');
			}
		}
	});

	// 默认主题
	$('.s-skin-0').click(function() {
		$("body").removeClass("skin-1");
		$("body").removeClass("skin-2");
		$("body").removeClass("skin-3");
		return false;
	});

	// 蓝色主题
	$('.s-skin-1').click(function() {
		$("body").removeClass("skin-2");
		$("body").removeClass("skin-3");
		$("body").addClass("skin-1");
		return false;
	});

	// 黄色主题
	$('.s-skin-3').click(function() {
		$("body").removeClass("skin-1");
		$("body").removeClass("skin-2");
		$("body").addClass("skin-3");
		return false;
	});

	if (localStorageSupport) {
		var collapse = localStorage.getItem("collapse_menu");
		var fixednavbar = localStorage.getItem("fixednavbar");
		var boxedlayout = localStorage.getItem("boxedlayout");

		if (collapse == 'on') {
			$('#collapsemenu').prop('checked', 'checked')
		}
		if (fixednavbar == 'on') {
			$('#fixednavbar').prop('checked', 'checked')
		}
		if (boxedlayout == 'on') {
			$('#boxedlayout').prop('checked', 'checked')
		}
	}

	if (localStorageSupport) {
		var collapse = localStorage.getItem("collapse_menu");
		var fixednavbar = localStorage.getItem("fixednavbar");
		var boxedlayout = localStorage.getItem("boxedlayout");
		var body = $('body');
		if (collapse == 'on') {
			if (!body.hasClass('body-small')) {
				body.addClass('mini-navbar');
			}
		}
		if (fixednavbar == 'on') {
			$(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
			body.addClass('fixed-nav');
		}
		if (boxedlayout == 'on') {
			body.addClass('boxed-layout');
		}
	}
});

// 判断浏览器是否支持html5本地存储
function localStorageSupport() {
	return (('localStorage' in window) && window['localStorage'] !== null)
}

$("body").bind("click", function(evt) {
	var flag = true;
	$.each($(evt.target).parents(), function(index, value) {
		if (value.className.indexOf("msgHide") != -1) {
			flag = false;
		}
	});
	if (!$(".msgHide").is(':visible')) {
		if ($(evt.target)[0].className != "dropdown-toggle count-info" && $(evt.target)[0].className != "dropdown open" && $(evt.target)[0].className != "fa fa-bell" && flag) {
			$('.msgHide').addClass("hide");
		} else {
			$(".msgHide").removeClass("hide");
		}
	}else{
		if (flag) {
			$('.msgHide').addClass("hide");
		} else {
			$(".msgHide").removeClass("hide");
		}
	}
});



/**
 * 格式化时间(几秒前,几分钟前)
 * 
 * @param date
 */
function formatDate(date) {
	var timeNow = parseInt(new Date().getTime() / 1000); // 当前时间
	var comDate = timeNow - parseInt(Date.parse(date) / 1000); // 相差的秒数
	var minute = parseInt(comDate / 60); // 相差的分钟数
	if (comDate < 60) {
		var a = comDate + "秒前";
		return a;
	} else if (minute < 60) {
		var b = minute + "分钟前";
		return b;
	} else {
		var arr = date.split(" ");
		return arr[1];
	}
}
