/*
 * 文件名：HistoricProcessInstanceDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月10日 下午4:43:51
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月10日 下午4:43:51
 * @since baothink-workflow 0.0.1
 */
public class HistoricProcessInstanceDto {

	private String id;
	private String businessKey;
	private String name;
	private String deleteReason;
	private String durationInMillis;
	private String startActivityId;
	private String endActivityId;
	private String startTime;
	private String endTime;
	private String startUserId;
	private String superProcessInstanceId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDeleteReason() {
		return deleteReason;
	}

	public void setDeleteReason(String deleteReason) {
		this.deleteReason = deleteReason;
	}


	public String getDurationInMillis() {
		return durationInMillis;
	}

	public void setDurationInMillis(String durationInMillis) {
		this.durationInMillis = durationInMillis;
	}

	public String getStartActivityId() {
		return startActivityId;
	}

	public void setStartActivityId(String startActivityId) {
		this.startActivityId = startActivityId;
	}

	public String getEndActivityId() {
		return endActivityId;
	}

	public void setEndActivityId(String endActivityId) {
		this.endActivityId = endActivityId;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getStartUserId() {
		return startUserId;
	}

	public void setStartUserId(String startUserId) {
		this.startUserId = startUserId;
	}

	public String getSuperProcessInstanceId() {
		return superProcessInstanceId;
	}

	public void setSuperProcessInstanceId(String superProcessInstanceId) {
		this.superProcessInstanceId = superProcessInstanceId;
	}

}
