package com.baothink.workflow.common;

import java.util.List;

import com.alibaba.fastjson.JSON;

public class PageResult {

	private long draw;
	private long recordsTotal;
	private long recordsFiltered;
	private transient List<?> dataList;
	private Object data;
	private String error;

	public PageResult() {
	}

	public PageResult(long draw, String error) {
		this.draw = draw;
		this.error = error;
	}

	public long getDraw() {
		return draw;
	}

	public void setDraw(long draw) {
		this.draw = draw;
	}

	public long getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(long recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public long getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(long recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public List<?> getDataList() {
		return dataList;
	}

	public void setDataList(List<?> dataList) {
		this.dataList = dataList;
		this.data = dataList;
	}

	public Object getData() {
		return data;
	}


	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}
	
	public String json()
	   {
	     return JSON.toJSONString(this);
	   }
	
	
}
