<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>工作流管理平台</title>
<c:import url="common/head.jsp" />
</head>
<body class="fixed-sidebar full-height-layout gray-bg fixed-nav" style="overflow: hidden">
	<div id="wrapper">
		<!--左侧导航开始-->
		<nav class="navbar-default navbar-static-side" role="navigation">
			<div class="nav-close">
				<i class="fa fa-times-circle"></i>
			</div>
			<div class="sidebar-collapse">
				<ul class="nav" id="side-menu">
				</ul>
			</div>
		</nav>
		<!--左侧导航结束-->
		<!--右侧部分开始-->
		<div id="page-wrapper" class="gray-bg dashbard-1">
		<!-- 模拟点击，跳转到参数管理页面 -->
		<a href="" class="J_menuItem" data-index="0"><span id="simulateParameter" class="hide">参数管理</span></a>
		<!-- 模拟点击，跳转到调度日志管理页面 -->
		<a href="" class="J_menuItem" data-index="0"><span id="simulateJobLog" class="hide">调度日志管理</span></a>
			<div class="row border-bottom">
				<nav class="navbar navbar-fixed-top " role="navigation" style="margin-bottom: 0">
					<div class="navbar-header">
						<a href="#"><img alt="" src="images/logo.png" /></a> <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " style="display: none" href="#"><i class="fa fa-bars"></i> </a>
					</div>
					<ul id="oneLevelMenu" class="nav navbar-top-links navbar-left navbar-default nav-pills">
						<li class="active"><a data-menu="M001">工作流模型管理</a></li>
					</ul>
					<ul class="nav navbar-top-links navbar-right">
						<li class="dropdown" id="msgLi"><a class="dropdown-toggle count-info" data-toggle="dropdown" href="#"> <i class="fa fa-bell"></i> <span id="msgCount" class="msgCount label label-warning"></span>
						</a>
							<div style="display: block;position: absolute; border: 1px solid #ddd; width: 400px; max-height: 285px; z-index: 999998; background-color: #fff; box-shadow: 0 6px 12px rgba(0, 0, 0, .175);" class="dropdown-menu msgHide hide">
								<div class="msg_unread" style="cursor: auto;">
									<div class="msg_unread_center" style="max-height: 204px; overflow-y: auto;">
										<div class="msg_load" style="display: none;">加载中</div>
										<div class="msg_empty" style="height: 100px; line-height: 100px; text-align: center; color: #999; font-weight: bold; font-size: 14px;">暂无新的消息</div>
										<div class="msg_content" style="line-height: 50px;">
											<ul style="padding: 0;">
											</ul>
										</div>
									</div>
									<div class="msg_unread_bottom text-center link-block">
										<a href="sx/sysMsgSend/record.html?menuCode=11_40_80" class="J_menuItem"> <i class="fa fa-envelope"></i> <strong>查看所有消息</strong>
										</a>
									</div>
								</div>
								<div class="msg_details" style="height: 241px; cursor: auto;">
									<div class="msg_details_top" style="height: 35px; line-height: 35px; border-bottom: 1px solid #ddd;">
										<a class="go_back" href="javascript:void(0);" style="margin-left: 10px; padding: 0; font-size: small;float: left;"><i class="fa fa-arrow-left"></i>返回列表</a> <a class="notifi_page_none nextnote" href="javascript:void(0);" style="float: right; margin-right: 5px; padding: 0; font-size: small;">下一条</a> <a class="notifi_page_none prvnote" href="javascript:void(0);" style="float: right; margin-right: 5px; padding: 0; font-size: small;">上一条</a>
									</div>
									<div class="msg_details_center"></div>
								</div>
							</div>
						<!-- <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> <i class="fa fa-tasks"></i>设置
						</a>
							<div class="dropdown-menu dropdown-setting">
								<div class="title">主题设置</div>
								<div class="setings-item">
									<span>收起左侧菜单</span>
									<div class="switch">
										<div class="onoffswitch">
											<input type="checkbox" name="collapsemenu" class="onoffswitch-checkbox" id="collapsemenu"> <label class="onoffswitch-label" for="collapsemenu"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
											</label>
										</div>
									</div>
								</div>
								<div class="setings-item">
									<span>固定顶部</span>
									<div class="switch">
										<div class="onoffswitch">
											<input type="checkbox" name="fixednavbar" class="onoffswitch-checkbox" id="fixednavbar" checked="checked"> <label class="onoffswitch-label" for="fixednavbar"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
											</label>
										</div>
									</div>
								</div>
								<div class="setings-item">
									<span> 固定宽度 </span>
									<div class="switch">
										<div class="onoffswitch">
											<input type="checkbox" name="boxedlayout" class="onoffswitch-checkbox" id="boxedlayout"> <label class="onoffswitch-label" for="boxedlayout"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span>
											</label>
										</div>
									</div>
								</div>
								<div class="title">皮肤选择</div>
								<div class="setings-item default-skin nb">
									<span class="skin-name "> <a href="#" class="s-skin-0"> 默认皮肤 </a>
									</span>
								</div>
								<div class="setings-item blue-skin nb">
									<span class="skin-name "> <a href="#" class="s-skin-1"> 蓝色主题 </a>
									</span>
								</div>
								<div class="setings-item yellow-skin nb">
									<span class="skin-name "> <a href="#" class="s-skin-3"> 黄色/紫色主题 </a>
									</span>
								</div>
							</div></li> -->
						<li class="dropdown"><a class="dropdown-toggle user" data-toggle="dropdown" href="#"> <c:if test='${loginPhoto!=null&&""!=loginPhoto}'>
									<%-- <img alt="image" class="user-photo" src='<c:url value="/fileserver/loadImage/${loginPhoto}"></c:url>' /> --%>
								</c:if> <span class="user-info"> ${loginName} <small>${loginPtName}</small>
							</span> <i class="fa fa-caret-down"></i>
						</a>
							<ul class="user-menu pull-right dropdown-menu dropdown-user">
								<li><a> <i class="fa fa-cog"></i> 设置
								</a></li>
								<li><a href='sys/modifyPerInfo/manage.html' id="personalData"> <i class="fa fa-user"></i> 个人资料
								</a></li>
								<li class="divider"></li>
								<li><a href="javascript:void(0);" id="logout"> <i class="fa fa-sign-out"></i> 退出
								</a></li>
							</ul></li>
					</ul>
				</nav>
			</div>
			<div class="row content-tabs">
				<button class="roll-nav roll-left J_tabLeft">
					<i class="fa fa-backward"></i>
				</button>
				<nav class="page-tabs J_menuTabs">
					<div class="page-tabs-content">
						<a href="javascript:;" class="active J_menuTab" data-id="welcome.html">首页</a>
					</div>
				</nav>
				<button class="roll-nav roll-right J_tabRight">
					<i class="fa fa-forward"></i>
				</button>
				<div class="btn-group roll-nav roll-right">
					<button class="dropdown J_tabClose" data-toggle="dropdown">
						关闭操作<span class="caret"></span>

					</button>
					<ul role="menu" class="dropdown-menu dropdown-menu-right">
						<li class="J_tabShowActive"><a>定位当前选项卡</a></li>
						<li class="divider"></li>
						<li class="J_tabCloseAll"><a>关闭全部选项卡</a></li>
						<li class="J_tabCloseOther"><a>关闭其他选项卡</a></li>
					</ul>
				</div>
				<!-- <a href="login.html" class="roll-nav roll-right J_tabExit"><i class="fa fa fa-sign-out"></i> 退出</a> -->
			</div>
			<div class="row J_mainContent" id="content-main">
				<iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="<c:url value='/welcome.html'/>" data-id="welcome.html"></iframe>
			</div>
			<div class="footer">
				<div class="pull-right">
					&copy; 2016 <a href="http://www.baothink.com/" target="_blank">宝思科技</a>
				</div>
			</div>
		</div>
		<!--右侧边栏结束-->
		<!--mini聊天窗口开始-->
		<div class="small-chat-box fadeInRight animated">

			<div class="heading" draggable="true">
				<small class="chat-date pull-right"> 2015.9.1 </small> 与 Beau-zihan 聊天中
			</div>

			<div class="content">

				<div class="left">
					<div class="author-name">
						Beau-zihan <small class="chat-date"> 10:02 </small>
					</div>
					<div class="chat-message active">你好</div>

				</div>
				<div class="right">
					<div class="author-name">
						游客 <small class="chat-date"> 11:24 </small>
					</div>
					<div class="chat-message">你好，请问有帮助文档吗？</div>
				</div>
				<div class="left">
					<div class="author-name">
						Beau-zihan <small class="chat-date"> 08:45 </small>
					</div>
					<div class="chat-message active">有，购买源码包中有帮助文档，位于docs文件夹下</div>
				</div>
				<div class="right">
					<div class="author-name">
						游客 <small class="chat-date"> 11:24 </small>
					</div>
					<div class="chat-message">那除了帮助文档还提供什么样的服务？</div>
				</div>
				<div class="left">
					<div class="author-name">
						Beau-zihan <small class="chat-date"> 08:45 </small>
					</div>
					<div class="chat-message active">终身免费升级服务；</div>
				</div>
			</div>
			<div class="form-chat">
				<div class="input-group input-group-sm">
					<input type="text" class="form-control"> <span class="input-group-btn">
						<button class="btn btn-primary" type="button">发送</button>
					</span>
				</div>
			</div>
		</div>
		<div id="small-chat">
			<span class="badge badge-warning pull-right">5</span> <a class="open-small-chat"> <i class="fa fa-comments"></i>
			</a>
		</div>
	</div>
	<c:import url="common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/plugins/metisMenu/metisMenu.min.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/base/js/contabs.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/js/index.js'/>"></script>
	<input type="hidden" name="sid" value="<%=session.getId()%>" />
</body>
</html>