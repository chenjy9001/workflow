<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>接口定义</title>
<c:import url="../../common/head.jsp" />
</head>
<body class="gray-bg">
	<div class="wrapper wrapper-content animated fadeInRight">
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
	<!--新增表单-->
	<div id="add_data_div" class="ibox-content hide" class="hide">
		<form id="add_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口代码：</label>
				<div class="col-xs-4">
					<input id="sicode" name="sicode" type="text" class="form-control" aria-required="true">
				</div>
				<label class="col-xs-2 control-label required">接口名称：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="siname" name="siname"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">请求方法：</label>
				<div class="col-xs-4">
					<input type="radio" class="form-control" id="requestMethod1" name="requestMethod" value="10" disabled/><label for="requestMethod1">GET</label>
					<input type="radio" class="form-control" id="requestMethod2" name="requestMethod" value="20" checked="checked"/><label for="requestMethod2">POST</label>
				</div>
				<label class="col-xs-2 control-label required">接口类型：</label>
				<div class="col-xs-4">
					<input type="radio" class="form-control" id="interfaceType1" name="interfaceType" value="10" /> <label for="interfaceType1">输入接口 </label>
					<input type="radio" class="form-control" id="interfaceType2" name="interfaceType" value="20" checked="checked"/><label for="interfaceType2">输出接口 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否身份验证：</label>
				<div class="col-xs-4">
					<input type="checkbox" class="form-control" id="isAuth" name="isAuth" value="1" checked="checked"/>
				</div>
				<label class="col-xs-2 control-label">是否有效：</label>
				<div class="col-xs-4">
					<input type="checkbox" class="form-control" id="validFlag" name="validFlag" value="1" checked="checked"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口组件名：</label>
				<div class="col-xs-10">
					<input type="text" class="form-control" id="implementsClass" name="implementsClass"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数1：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param1" name="param1"/>
				</div>
				<label class="col-xs-2 control-label">扩展参数2：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param2" name="param2"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数3：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param3" name="param3"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="3" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
				</div>
			</div>
		</form>
	</div>
	<!--修改表单-->
	<div id="modify_data_div" class="ibox-content hide" class="hide">
		<form id="modify_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<input id="id" name="id" type="hidden">
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口代码：</label>
				<div class="col-xs-4">
					<input id="sicode" name="sicode" type="text" class="form-control" aria-required="true" readonly="readonly">
				</div>
				<label class="col-xs-2 control-label required">接口名称：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="siname" name="siname"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">请求方法：</label>
				<div class="col-xs-4">
					<input type="radio" class="form-control" id="requestMethod1" name="requestMethod" value="10" disabled/><label for="requestMethod1">GET</label>
					<input type="radio" class="form-control" id="requestMethod2" name="requestMethod" value="20" /><label for="requestMethod2">POST</label>
				</div>
				<label class="col-xs-2 control-label">接口类型：</label>
				<div class="col-xs-4">
					<input type="radio" class="form-control" id="interfaceType1" name="interfaceType" value="10" /> <label for="interfaceType1">输入接口 </label>
					<input type="radio" class="form-control" id="interfaceType2" name="interfaceType" value="20" /><label for="interfaceType2">输出接口 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否身份验证：</label>
				<div class="col-xs-4">
					<input type="checkbox" class="form-control" id="isAuth" name="isAuth" value="1"/>
				</div>
				<label class="col-xs-2 control-label">是否有效：</label>
				<div class="col-xs-4">
					<input type="checkbox" class="form-control" id="validFlag" name="validFlag" value="1"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口组件名：</label>
				<div class="col-xs-10">
					<input type="text" class="form-control" id="implementsClass" name="implementsClass"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数1：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param1" name="param1"/>
				</div>
				<label class="col-xs-2 control-label">扩展参数2：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param2" name="param2"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数3：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="param3" name="param3"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="3" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">创建人：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="createEName" name="createEName" readonly="readonly"/>
				</div>
				<label class="col-xs-2 control-label">创建时间：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="createDate" name="createDate" readonly="readonly"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">修改人：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="updateEName" name="updateEName" readonly="readonly"/>
				</div>
				<label class="col-xs-2 control-label">修改时间：</label>
				<div class="col-xs-4">
					<input type="text" class="form-control" id="updateDate" name="updateDate" readonly="readonly"/>
				</div>
			</div>
		</form>
	</div>
	<!--查看表单-->
	<div id="view_data_div" class="ibox-content hide" class="hide">
		<form id="view_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<input id="id" name="id" type="hidden">
			<div class="form-group">
				<label class="col-xs-2 control-label">接口代码：</label>
				<div class="col-xs-4">
					<span id="sicode" name="sicode" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">接口名称：</label>
				<div class="col-xs-4">
					<span class="form-control" id="siname" name="siname" ></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否身份验证：</label>
				<div class="col-xs-4">
					<span id="isAuth" name="isAuth" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">接口类型：</label>
				<div class="col-xs-4">
					<span id="interfaceType" name="interfaceType" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">请求方法：</label>
				<div class="col-xs-4">
					<span id="requestMethod" name="requestMethod" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">是否有效：</label>
				<div class="col-xs-4">
					<span id="validFlag" name="validFlag" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">接口组件名：</label>
				<div class="col-xs-10">
					<span id="implementsClass" name="implementsClass" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数1：</label>
				<div class="col-xs-4">
					<span id="param1" name="param1" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">扩展参数2：</label>
				<div class="col-xs-4">
					<span id="param2" name="param2" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">扩展参数3：</label>
				<div class="col-xs-4">
					<span id="param3" name="param3" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<span id="notes" name="notes" class="form-control" aria-required="true" style="height:100px;"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">创建人：</label>
				<div class="col-xs-4">
					<span id="createEName" name="createEName" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">创建时间：</label>
				<div class="col-xs-4">
					<span id="createDate" name="createDate" class="form-control" aria-required="true"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">修改人：</label>
				<div class="col-xs-4">
					<span id="updateEName" name="updateEName" class="form-control" aria-required="true"></span>
				</div>
				<label class="col-xs-2 control-label">修改时间：</label>
				<div class="col-xs-4">
					<span id="updateDate" name="updateDate" class="form-control" aria-required="true"></span>
				</div>
			</div>
		</form>
	</div>

	<c:import url="../../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/base/si/siInterDefineManage.js'/>"></script>
</body>
</html>