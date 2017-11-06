/*
 * 文件名：InterfaceLogController.java
 * 版权：Copyright 2012-2016 广州宝思信息技术有限公司
 * 创建人：陈培坤
 * 创建时间：2016年11月4日10:22:11
 * 修改人：
 * 修改时间：
 * 需改内容：
 */
package com.baothink.ecp.base.si.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.ecp.base.si.entity.SI900;
import com.baothink.ecp.base.si.entity.SI900Example;
import com.baothink.ecp.base.si.entity.dto.InterLogDto;
import com.baothink.ecp.base.si.service.SiInterfaceLogService;
import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.exception.BaseServiceException;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.base.page.PageResult;
import com.baothink.framework.web.base.admin.BaseDataController;

/**
 * 接口调用日志控制类<br>
 * .
 *
 * @author 陈培坤
 * @version 1.0,2016年11月3日 下午1:55:34
 * @since ecp-3-base-all 0.1.1
 */
@Controller
@RequestMapping("/si/siInterLog")
public class SiInterfaceLogController extends BaseDataController<SI900, SI900Example, InterLogDto, SiInterfaceLogService> {

	
	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#toContentPage(org.springframework.ui.ModelMap)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/manage.html")
	@Override
	public String toContentPage(ModelMap arg0) {
		return "/base/si/siInterLog";
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#loadListByPage(com.baothink.framework.base.page.PageRequest)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/loadListByPage.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public PageResult loadListByPage(PageRequest pageRequest) {
		SI900Example me = new SI900Example();
		PageResult page = null;
		try {
			page = service.getListByPage(pageRequest, me);
		} catch (BaseServiceException e) {
			page = new PageResult(pageRequest.getDraw(), e.getMessage());
		}
		return page;
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#viewAsync(java.lang.String)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/viewAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync viewAsync(String id) {
		return null;
	}
	
	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#addAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/addAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync addAsync(InterLogDto dto) {
		return null;
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#deleteAsync(java.lang.String[])
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/deleteAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync deleteAsync(String[] ids) {
		return null;
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#modifyAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/modifyAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync modifyAsync(InterLogDto dto) {
		return null;
	}
	
	
}