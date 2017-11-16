/*
 * 文件名：HistoryListController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月10日 下午3:34:21
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.activiti;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.DateUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.HistoricProcessInstanceDto;

/**
 * 历史记录查询控制类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年11月10日 下午3:34:21
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/history")
public class HistoryListController {
	private Logger log = LoggerFactory.getLogger(HistoryListController.class);
	@Autowired
	private HistoryService historyService;

	@RequestMapping(value = "toContent.html")
	public String toConteHistoricTaskInstancentPage(){
		return "workflow/historyList";
	}
	
	@RequestMapping(value = "loadListByPage.htm",produces = "text/html;charset=UTF-8")
	@ResponseBody
	public PageResult getPageList(PageRequest request){
		HistoricProcessInstanceQuery historicProcessInstanceQuery = historyService.createHistoricProcessInstanceQuery();
		List<HistoricProcessInstance> list = historicProcessInstanceQuery.listPage(request.getStart(), request.getLength());
		List<HistoricProcessInstanceDto> dtoList = new ArrayList<>();
		for(HistoricProcessInstance h:list){
			HistoricProcessInstanceDto dto = new HistoricProcessInstanceDto();
			dto.setId(h.getId());
			dto.setName(h.getName());
			dto.setBusinessKey(h.getBusinessKey());
			dto.setDeleteReason(h.getDeleteReason());
//			dto.setDurationInMillis(h.getDurationInMillis().toString());
			dto.setStartActivityId(h.getStartActivityId());
			dto.setEndActivityId(h.getEndActivityId());
			dto.setStartTime(h.getStartTime()!=null?DateUtil.format(h.getStartTime(), "yyyy-MM-dd HH:mm:ss"):"");
			dto.setEndTime(h.getEndTime()!=null?DateUtil.format(h.getEndTime(), "yyyy-MM-dd HH:mm:ss"):"");
			dto.setStartUserId(h.getStartUserId());
			dto.setSuperProcessInstanceId(h.getSuperProcessInstanceId());
			dtoList.add(dto);
		}
		PageResult result = new PageResult();
		result.setDataList(dtoList);
		result.setDraw(request.getDraw());
		result.setRecordsFiltered(historicProcessInstanceQuery.count());
		result.setRecordsTotal(historicProcessInstanceQuery.count());
		return result;
	}
}
