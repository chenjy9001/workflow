<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>后台登录</title>
<c:import url="common/head.jsp" />
<link rel="stylesheet" type="text/css" href="<c:url value='/base/css/login.css'/>" />
</head>
<body>
	<div id="loginbox">
		<form action="" method="post" name="loginForm" id="loginForm">
			<div class="control-group">
				<div class="controls ">
					<div class="main_input_box icon_pt_user">
						<input type="text" name="ptid" id="txtPtId" placeholder="请输入平台账号" value="100000" />
					</div>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<div class="main_input_box icon_user">
						<input type="text" name="loginname" id="txtUserName" placeholder="请输入用户名" value="sadmin" />
					</div>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<div class="main_input_box icon_psd">
						<input type="password" name="password" id="txtPassword" placeholder="请输入密码" value="bskj" />
					</div>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<div class="main_input_box">
						<div class="code-div icon_code">
							<input type="text" name="code" id="checkcode" class="login_code" placeholder="请输入验证码" value="" />
						</div>
						<div class="image-div">
							<i><img id="radom" alt="点击更换" title="点击更换" src="<c:url value='/'/>/verify/imageCode/login?s=<%=Math.random()%>" /></i>
						</div>
					</div>
				</div>
			</div>
			<div class="form-actions">
				<div>
					<span> <a class="flip-link btn btn-info" id="loginbtn">登&emsp;录</a>
				</div>
			</div>
		</form>
		<div class="controls bottomDiv">
			<div class="main_input_box">
				<font color="white"><span id="nameerr">Copyright © 宝思 2016</span></font>
			</div>
		</div>
	</div>
	<c:import url="common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/plugins/cookie/jquery.cookie.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/plugins/RSA/Barrett.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/plugins/RSA/BigInt.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/plugins/RSA/RSA.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/js/login.js'/>"></script>
	<script type="text/javascript">
		//TOCMAT重启之后 点击左侧列表跳转登录首页 
		if (window != top) {
			top.location.href = location.href;
		}
	</script>
</body>

</html>