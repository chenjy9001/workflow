/*
 * 文件名：InterfaceDefineController.java
 * 版权：Copyright 2012-2016 广州宝思信息技术有限公司
 * 创建人：陈培坤
 * 创建时间：2016年11月3日13:55:27
 * 修改人：
 * 修改时间：
 * 需改内容：
 */
package com.baothink.ecp.base.si.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.ecp.base.common.config.EcpBaseConfigProperties;
import com.baothink.ecp.base.common.exception.ErrorCode;
import com.baothink.ecp.base.si.entity.SI200;
import com.baothink.ecp.base.si.entity.SI200Example;
import com.baothink.ecp.base.si.entity.dto.InterDefineDto;
import com.baothink.ecp.base.si.service.SiInterfaceDefineService;
import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.exception.BaseControllerException;
import com.baothink.framework.base.exception.BaseServiceException;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.base.page.PageResult;
import com.baothink.framework.core.annotion.Token;
import com.baothink.framework.core.login.LoginUserInfo;
import com.baothink.framework.core.util.DateUtil;
import com.baothink.framework.core.util.EntityUtil;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.framework.core.util.UUIDUtil;
import com.baothink.framework.web.base.admin.BaseDataController;

/**
 * 接口定义控制类<br>
 * .
 *
 * @author 陈培坤
 * @version 1.0,2016年11月3日 下午1:55:34
 * @since ecp-3-base-all 0.1.1
 */
@Controller
@RequestMapping("/si/siInterDefine")
public class SiInterfaceDefineController extends BaseDataController<SI200, SI200Example, InterDefineDto, SiInterfaceDefineService> {

	/** The ecp base config properties. */
	@Resource
	private EcpBaseConfigProperties ecpBaseConfigProperties;
	
	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#toContentPage(org.springframework.ui.ModelMap)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@RequestMapping(value = "/manage.html")
	@Override
	public String toContentPage(ModelMap arg0) {
		return "/base/si/siInterDefineManage";
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
		SI200Example me = new SI200Example();
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
	 * @see com.baothink.framework.web.base.admin.BaseDataController#addAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@Token
	@RequestMapping(value = "/addAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync addAsync(@Valid InterDefineDto dto) {
		LoginUserInfo info = null;
		try {
			info = this.getLoginUserInfo();
		} catch (BaseControllerException e1) {
			return ResultAsync.error(e1.getErrorCode(), e1.getMessage());
		}
		SI200 entity = EntityUtil.dtoToEntity(dto, new SI200());
		entity.setId(UUIDUtil.createShortUUID());
		entity.setSysId(ecpBaseConfigProperties.getSysId());
		entity.setSysName(ecpBaseConfigProperties.getSysName());
		entity.setIsAuth(StringUtil.isEmpty(entity.getIsAuth())?"0":"1");
		entity.setValidFlag(StringUtil.isEmpty(entity.getValidFlag())?"0":"1");
		entity.setPtId(info.getPtId());
		entity.setPtName(info.getPtName());
		entity.setCreateEId(info.getEmpCode());
		entity.setCreateEName(info.getEmpName());
		entity.setCreateDate(DateUtil.getCurrDate());
		entity.setUpdateEId(info.getEmpCode());
		entity.setUpdateEName(info.getEmpName());
		entity.setOptimisticLock1(0);
		entity.setOptimisticLock2(0);
		entity.setPessimisticLock(0);
		try {
			int updatCount = service.save(entity);
			if (updatCount == 1) {
				return ResultAsync.success();
			}
			return ResultAsync.failure(ErrorCode.ADMIN_SI200_SAVE_ERROE);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
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
		int updatCount = 0;
		try {
			//updatCount = service.deleteByPrimaryKey(ids);
			updatCount = service.deleteInter(ids);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (updatCount > 0) {
			return ResultAsync.success();
		}
		return ResultAsync.failure(ErrorCode.ADMIN_SI200_DELETE_ERROE);
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
		InterDefineDto dto = null;
		try {
			SI200 entity = service.getByPrimaryKey(id);
			dto = EntityUtil.entityToDto(entity, InterDefineDto.class);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (dto != null) {
			return ResultAsync.success(dto);
		}
		return ResultAsync.failure(ErrorCode.ADMIN_SI200_VIEW_ERROE);
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#modifyAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@Token
	@RequestMapping(value = "/modifyAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync modifyAsync(@Valid InterDefineDto dto) {
		LoginUserInfo userInfo = null;
		try {
			// 获取登录用户对象，未登录则会触发异常
			userInfo = this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		int modifyCount = 0;
		try {
			dto.setUpdateEId(userInfo.getEmpCode());
			dto.setUpdateEName(userInfo.getEmpName());
			dto.setIsAuth(StringUtil.isEmpty(dto.getIsAuth())?"0":"1");
			dto.setValidFlag(StringUtil.isEmpty(dto.getValidFlag())?"0":"1");
			modifyCount = service.modifyByPrimaryKey(dto.getId(), dto);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (modifyCount == 1) {
			return ResultAsync.success();
		}
		return ResultAsync.failure(ErrorCode.ADMIN_SI200_UPDATE_ERROE);
	}
	
	
	/**
	 * 检查接口代码是否存在<br>
	 * .
	 *
	 * @param sicode
	 *            the sicode
	 * @return 存在返回false，不存在返回true
	 * @since ecp-3-base-web-admin 0.1.1
	 */
	@ResponseBody
	@RequestMapping(value = "/checkSiCode.htm", produces = "text/html;charset=UTF-8")
	public Boolean checkSiCode(@ModelAttribute("sicode")String sicode){
		return service.checkSiCode(sicode);
	}

}