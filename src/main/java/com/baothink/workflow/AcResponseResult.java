/*
 * 文件名：AcResponseResult.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月26日 上午11:27:43
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow;

import java.beans.ConstructorProperties;

/**
 * 接口请求返回信息<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年10月26日 上午11:27:43
 * @since baothink-workflow 0.0.1
 */
public class AcResponseResult {

	private boolean success;
	private int code;
	private String msg;
	private Object data;
	private String safeCode;

	public boolean isSuccess() {
		return this.success;
	}

	public int getCode() {
		return this.code;
	}

	public String getMsg() {
		return this.msg;
	}

	public Object getData() {
		return this.data;
	}

	public String getSafeCode() {
		return this.safeCode;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public void setSafeCode(String safeCode) {
		this.safeCode = safeCode;
	}

	public String toString() {
		return "AcResponseResult(success=" + isSuccess() + ", code=" + getCode() + ", msg=" + getMsg() + ", data="
				+ getData() + ", safeCode=" + getSafeCode() + ")";
	}

	public boolean equals(Object o) {
		if (o == this)
			return true;
		if (!(o instanceof AcResponseResult))
			return false;
		AcResponseResult other = (AcResponseResult) o;
		if (!other.canEqual(this))
			return false;
		if (!super.equals(o))
			return false;
		if (isSuccess() != other.isSuccess())
			return false;
		if (getCode() != other.getCode())
			return false;
		Object this$msg = getMsg();
		Object other$msg = other.getMsg();
		if (this$msg == null ? other$msg != null : !this$msg.equals(other$msg))
			return false;
		Object this$data = getData();
		Object other$data = other.getData();
		if (this$data == null ? other$data != null : !this$data.equals(other$data))
			return false;
		Object this$safeCode = getSafeCode();
		Object other$safeCode = other.getSafeCode();
		return this$safeCode == null ? other$safeCode == null : this$safeCode.equals(other$safeCode);
	}

	protected boolean canEqual(Object other) {
		return other instanceof AcResponseResult;
	}

	public int hashCode() {
		int PRIME = 59;
		int result = 1;
		result = result * 59 + super.hashCode();
		result = result * 59 + (isSuccess() ? 79 : 97);
		result = result * 59 + getCode();
		Object $msg = getMsg();
		result = result * 59 + ($msg == null ? 43 : $msg.hashCode());
		Object $data = getData();
		result = result * 59 + ($data == null ? 43 : $data.hashCode());
		Object $safeCode = getSafeCode();
		result = result * 59 + ($safeCode == null ? 43 : $safeCode.hashCode());
		return result;
	}

	@ConstructorProperties({ "success", "code", "msg", "data", "safeCode" })
	public AcResponseResult(boolean success, int code, String msg, Object data, String safeCode) {
		this.success = success;
		this.code = code;
		this.msg = msg;
		this.data = data;
		this.safeCode = safeCode;
	}

	public static AcResponseResult success(Object data) {
		AcResponseResult result = new AcResponseResult();
		result.success = true;
		result.code = 900;
		// result.msg = BaseErrorCode.getMessage(900, new Object[0]);
		result.setData(data);
		return result;
	}

	public static AcResponseResult success() {
		AcResponseResult result = new AcResponseResult();
		result.success = true;
		result.code = 900;
		// result.msg = BaseErrorCode.getMessage(900, new Object[0]);
		return result;
	}

	public static AcResponseResult failure(int errorCode, Object... inserts) {
		AcResponseResult result = new AcResponseResult();
		result.success = false;
		result.code = errorCode;
		// result.msg = BaseErrorCode.getMessage(errorCode, inserts);
		return result;
	}

	public static AcResponseResult error(int errorCode, String errorMsg) {
		AcResponseResult result = new AcResponseResult();
		result.success = false;
		result.code = errorCode;
		result.msg = errorMsg;
		return result;
	}

	public AcResponseResult() {
	}
}
