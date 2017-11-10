/*
 * 文件名：TaskRejectedDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月10日 上午11:14:34
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

/**
 * 任务驳回dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月10日 上午11:14:34
 * @since baothink-workflow 0.0.1
 */
public class TaskRejectedDto {

	private String processInstanceId;
	private String msg;// 驳回理由
	private String userCode;

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	
}
