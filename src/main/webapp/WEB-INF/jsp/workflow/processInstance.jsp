<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>流程实例列表</title>
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
				<label class="col-xs-2 control-label required">名称：</label>
				<div class="col-xs-9">
					<input id="name" name="name" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">KEY：</label>
				<div class="col-xs-9">
					<input id="key" name="key" type="text" class="form-control"  aria-required="true">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">描述：</label>
				<div class="col-xs-9">
					<textarea rows="2" style="resize: none;" id="description" name="description" class="form-control" maxlength="400"></textarea>
				</div>
			</div>
		</form>
	</div>
	
	<c:import url="../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/workflow/processInstance.js'/>"></script>
</body>
</html>