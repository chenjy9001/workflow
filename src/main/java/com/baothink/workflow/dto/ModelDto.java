/*
 * 文件名：ModelDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月10日 下午1:25:00
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

import com.baothink.framework.base.entity.BaseDto;
import com.baothink.framework.core.annotion.DtoField;

/**
 * 模板dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年10月10日 下午1:25:00
 * @since baothink-workflow 0.0.1
 */
public class ModelDto extends BaseDto {

	private String id;
	private String revision = "1";
	private String name;
	private String key;
	private String category;
	@DtoField(mapping = "createTime", isDate = true, format = "yyyy-MM-dd HH:mm:ss")
	private String createTime;
	@DtoField(mapping = "lastUpdateTime", isDate = true, format = "yyyy-MM-dd HH:mm:ss")
	private String lastUpdateTime;
	private String version = "1";
	private String metaInfo;
	private String deploymentId;
	private String editorSourceValueId;
	private String editorSourceExtraValueId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRevision() {
		return revision;
	}

	public void setRevision(String revision) {
		this.revision = revision;
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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(String lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getMetaInfo() {
		return metaInfo;
	}

	public void setMetaInfo(String metaInfo) {
		this.metaInfo = metaInfo;
	}

	public String getDeploymentId() {
		return deploymentId;
	}

	public void setDeploymentId(String deploymentId) {
		this.deploymentId = deploymentId;
	}

	public String getEditorSourceValueId() {
		return editorSourceValueId;
	}

	public void setEditorSourceValueId(String editorSourceValueId) {
		this.editorSourceValueId = editorSourceValueId;
	}

	public String getEditorSourceExtraValueId() {
		return editorSourceExtraValueId;
	}

	public void setEditorSourceExtraValueId(String editorSourceExtraValueId) {
		this.editorSourceExtraValueId = editorSourceExtraValueId;
	}

}
