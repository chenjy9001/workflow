/*
 * 文件名：ProcessInstanceInfoDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月15日 上午10:56:55
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

import java.util.List;

/**
 * 流程实例信息Dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月15日 上午10:56:55
 * @since baothink-workflow 0.0.1
 */
public class ProcessInstanceInfoDto {

	private String id;
	private boolean isHave;
	private boolean isComplete;
	private List<TaskDto> taskList;
	private boolean isEnd;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public boolean getIsHave() {
		return isHave;
	}

	public void setIsHave(boolean isHave) {
		this.isHave = isHave;
	}

	public boolean getIsComplete() {
		return isComplete;
	}

	public void setIsComplete(boolean isComplete) {
		this.isComplete = isComplete;
	}

	public List<TaskDto> getTaskList() {
		return taskList;
	}

	public void setTaskList(List<TaskDto> taskList) {
		this.taskList = taskList;
	}

	public boolean getIsEnd() {
		return isEnd;
	}

	public void setIsEnd(boolean isEnd) {
		this.isEnd = isEnd;
	}

}
