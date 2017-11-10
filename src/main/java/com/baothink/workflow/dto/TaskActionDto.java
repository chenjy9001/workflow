/*
 * 文件名：TaskActionDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月8日 下午1:42:35
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

import java.util.List;

import org.activiti.rest.service.api.engine.variable.RestVariable;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

/**
 * 任务操作实体<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月8日 下午1:42:35
 * @since baothink-workflow 0.0.1
 */
public class TaskActionDto {

	private String processInstanceId;
	private String action;
	private String assignee;
	private String userCode;
	private List<RestVariable> variables;

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	@JsonTypeInfo(use = Id.CLASS, defaultImpl = RestVariable.class)
	public List<RestVariable> getVariables() {
		return variables;
	}

	public void setVariables(List<RestVariable> variables) {
		this.variables = variables;
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	
}
