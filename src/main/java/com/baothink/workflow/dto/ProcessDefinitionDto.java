/*
 * 文件名：ProcessDefinitionDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月13日 下午5:02:45
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

/**
 * 流程定义dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年10月13日 下午5:02:45
 * @since baothink-workflow 0.0.1
 */
public class ProcessDefinitionDto {
	private String id;
	private String deploymentId;
	private String name;
	private String key;
	private String version;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDeploymentId() {
		return deploymentId;
	}

	public void setDeploymentId(String deploymentId) {
		this.deploymentId = deploymentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

}
