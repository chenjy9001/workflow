/*
 * 文件名：UserDto.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月26日 上午10:08:20
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
 * @version 1.0,2017年10月26日 上午10:08:20
 * @since baothink-workflow 0.0.1
 */
public class UserDto {

	private String id;
	private String firstName;
	private String lastName;
	private String email;
	private String password;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
