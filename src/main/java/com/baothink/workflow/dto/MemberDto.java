/*
 * 文件名：MemberDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月2日 下午2:18:52
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.dto;

/**
 * 用户与群组关系dto<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月2日 下午2:18:52
 * @since baothink-workflow 0.0.1
 */
public class MemberDto {

	private String userId;
	private String groupId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

}
