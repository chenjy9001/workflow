<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>用户列表</title>
<c:import url="../common/head.jsp" />
</head>
<body class="gray-bg">
	<div class="wrapper wrapper-content animated fadeInRight wrapper_fixed">
		<div class="ibox float-e-margins">
			<div class="ibox-content">
				<div id="toolbar">
					<!-- 工具栏，显示操作按钮和模糊搜索 -->
				</div>
				<div class="row row-lg">
					<div class="col-xs-12">
						<table id="dataTable" class="table table-striped table-bordered">
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 隐藏链接 -->
	<a class="hide" id="createlink" target="_blank" href=""></a>
	<!--新增表单-->
	<div id="add_data_div" class="ibox-content hide" class="hide">
		<form id="add_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<div class="form-group">
				<label class="col-xs-2 control-label required">ID：</label>
				<div class="col-xs-9">
					<input id="id" name="id" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">姓氏：</label>
				<div class="col-xs-9">
					<input id="lastName" name="lastName" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">名字：</label>
				<div class="col-xs-9">
					<input id="firstName" name="firstName" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">电子邮箱：</label>
				<div class="col-xs-9">
					<input id="email" name="email" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			
		</form>
	</div>
	<!-- 群组列表 -->
	<div id="view_group_div" class="ibox-content hide" class="hide">
		<div class="wrapper wrapper-content animated fadeInRight wrapper_fixed">
		<div class="ibox float-e-margins">
			<div class="ibox-content">
				<div class="main">
				<div id="toolbar">
					<!-- 工具栏，显示操作按钮和模糊搜索 -->
				</div>
				<div class="row row-lg">
					<div class="col-xs-12">
						<table id="dataTable1" class="table table-striped table-bordered">
						</table>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
	</div>
	<c:import url="../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/workflow/userList.js'/>"></script>
</body>
</html>