/*
 * 文件名：ProcessInstanceDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月16日 下午12:00:23
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

/**
 * 流程实例dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年10月16日 下午12:00:23
 * @since baothink-workflow 0.0.1
 */
public class ProcessInstanceDto {

	private String id;// 执行id
	private String processInstanceId;
	private String processDefinitionId;
	private String activitiyId;
	private String suspended;
	private String activityName;//当前节点
	private String processDefinitionName;
	private String processDefinitionKey;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public String getActivitiyId() {
		return activitiyId;
	}

	public void setActivitiyId(String activitiyId) {
		this.activitiyId = activitiyId;
	}

	public String getSuspended() {
		return suspended;
	}

	public void setSuspended(String suspended) {
		this.suspended = suspended;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	public String getProcessDefinitionName() {
		return processDefinitionName;
	}

	public void setProcessDefinitionName(String processDefinitionName) {
		this.processDefinitionName = processDefinitionName;
	}

	public String getProcessDefinitionKey() {
		return processDefinitionKey;
	}

	public void setProcessDefinitionKey(String processDefinitionKey) {
		this.processDefinitionKey = processDefinitionKey;
	}
	
	

}
