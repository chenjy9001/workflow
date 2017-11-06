package com.baothink.ecp.base.si.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.ecp.base.common.config.EcpBaseConfigProperties;
import com.baothink.ecp.base.common.exception.ErrorCode;
import com.baothink.ecp.base.si.entity.SI200;
import com.baothink.ecp.base.si.entity.SI200Example;
import com.baothink.ecp.base.si.entity.SI200Example.Criteria;
import com.baothink.ecp.base.si.entity.SI101;
import com.baothink.ecp.base.si.entity.SI101Example;
import com.baothink.ecp.base.si.entity.dto.InterDefineSelectDto;
import com.baothink.ecp.base.si.entity.dto.SiUserContrastDto;
import com.baothink.ecp.base.si.service.SiInterfaceDefineService;
import com.baothink.ecp.base.si.service.SiUserContrastService;
import com.baothink.framework.base.control.SelectControlRequest;
import com.baothink.framework.base.control.SelectControlResult;
import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.exception.BaseControllerException;
import com.baothink.framework.base.exception.BaseServiceException;
import com.baothink.framework.base.page.PageQueryHelper;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.base.page.PageResult;
import com.baothink.framework.core.annotion.Token;
import com.baothink.framework.core.login.LoginUserInfo;
import com.baothink.framework.core.util.DateUtil;
import com.baothink.framework.core.util.EntityUtil;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.framework.core.util.UUIDUtil;
import com.baothink.framework.web.base.admin.BaseDataController;
import com.github.pagehelper.Page;

/**
 * 接口账号对照控制类<br>
 * .
 *
 * @author 肖湘淮
 * @version 1.0,2016年11月3日 下午4:42:46
 * @since ecp-3-base-web-admin 0.1.0
 */
@Controller
@RequestMapping("/si/siUserContrast")
public class SiUserContrastController extends BaseDataController<SI101, SI101Example, SiUserContrastDto, SiUserContrastService> {

	/** The ecp base config properties. */
	@Resource
	private EcpBaseConfigProperties ecpBaseConfigProperties;
	
	/** The interface define service. */
	@Resource
	private SiInterfaceDefineService interfaceDefineService;

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#addAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@Token
	@RequestMapping(value = "/addAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync addAsync(SiUserContrastDto dto) {
		LoginUserInfo userInfo = null;
		try {
			userInfo = this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		int addCount = 0;
		SI101 entity = EntityUtil.dtoToEntity(dto, new SI101());
		if (entity.getLimitFlag().equals("0")) {
			entity.setLimitCount(0);
			entity.setLimitType("");
		}
		if (entity.getIntervalFlag().equals("10")) {
			entity.setTimeInterval(0);
		}
		entity.setId(UUIDUtil.createShortUUID());
		entity.setSysId(ecpBaseConfigProperties.getSysId());
		entity.setSysName(ecpBaseConfigProperties.getSysName());
		entity.setPtId(userInfo.getPtId());
		entity.setPtName(userInfo.getPtName());
		entity.setCreateEId(userInfo.getEmpCode());
		entity.setCreateEName(userInfo.getEmpName());
		entity.setCreateDate(DateUtil.getCurrDate());
		entity.setUpdateEId(userInfo.getEmpCode());
		entity.setUpdateEName(userInfo.getEmpName());
		entity.setUpdateDate(DateUtil.getCurrDate());
		try {
			addCount = service.save(entity);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (addCount == 1) {
			return ResultAsync.success();
		}
		return ResultAsync.failure(ErrorCode.ADMIN_ADD_ERROR);
	}

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#deleteAsync(java.lang.String[])
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/deleteAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync deleteAsync(String[] ids) {
		int updatCount = 0;
		try {
			updatCount = service.deleteByPrimaryKey(ids);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (updatCount > 0) {
			return ResultAsync.success();
		}
		return ResultAsync.failure(ErrorCode.ADMIN_DELETE_ERROR);
	}

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#loadListByPage(com.baothink.framework.base.page.PageRequest)
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/loadListByPage.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public PageResult loadListByPage(PageRequest pageRequest) {
		SI101Example example = new SI101Example();
		PageResult page = null;
		try {
			page = service.getListByPage(pageRequest, example);
		} catch (BaseServiceException e) {
			return new PageResult(pageRequest.getDraw(), e.getMessage());
		}
		return page;
	}

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#modifyAsync(com.baothink.framework.base.entity.BaseDto)
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@Token
	@RequestMapping(value = "/modifyAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync modifyAsync(SiUserContrastDto dto) {
		LoginUserInfo userInfo = null;
		try {
			// 获取登录用户对象，未登录则会触发异常
			userInfo = this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		int modifyCount = 0;
		if (dto.getLimitFlag().equals("0")) {
			dto.setLimitCount(0);
			dto.setLimitType("");
		}
		if (dto.getIntervalFlag().equals("10")) {
			dto.setTimeInterval(0);
		}
		dto.setUpdateEId(userInfo.getEmpCode());
		dto.setUpdateEName(userInfo.getEmpName());
		dto.setUpdateDate(DateUtil.format(DateUtil.getCurrDate(), "yyyy-MM-dd HH:mm:ss"));
		try {
			modifyCount = service.modifyByPrimaryKey(dto.getId(), dto);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (modifyCount == 1) {
			return ResultAsync.success();
		}
		return ResultAsync.failure(ErrorCode.ADMIN_MODIFY_ERROR);
	}

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#toContentPage(org.springframework.ui.ModelMap)
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/manage.html")
	@Override
	public String toContentPage(ModelMap arg0) {
		return "base/si/siUserContrastManage";
	}

	/**
	 * 
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.framework.web.base.admin.BaseDataController#viewAsync(java.lang.String)
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/viewAsync.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	@Override
	public ResultAsync viewAsync(String id) {
		SiUserContrastDto dto = null;
		try {
			if (!StringUtil.isEmpty(id)) {
				SI101 entity = service.getByPrimaryKey(id);
				dto = EntityUtil.entityToDto(entity, SiUserContrastDto.class);
				if (dto != null) {
					return ResultAsync.success(dto);
				}
			}
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		return ResultAsync.failure(ErrorCode.ADMIN_VIEW_ERROR);
	}

	/**
	 * 判断接口代码是否存在<br>
	 * 同一接口账号下接口代码是否存在.
	 *
	 * @param sicode
	 *            接口代码
	 * @param siaccno
	 *            接口账号
	 * @return 是否存在boolean值
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/judgeIsExists.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public Boolean judgeIsExists(String sicode, String siaccno) {
		if (!StringUtil.isEmpty(siaccno) && !StringUtil.isEmpty(sicode)) {
			SI101Example example = new SI101Example();
			example.createCriteria().andSiaccnoEqualTo(siaccno).andSicodeEqualTo(sicode);
			List<SI101> list = service.getListByExample(example);
			if (list != null && list.size() > 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 接口定义下拉数据<br>
	 * .
	 *
	 * @param selectControlRequest
	 *            搜索关键字
	 * @return page数据
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/loadByPage.htm")
	@ResponseBody
	public SelectControlResult<InterDefineSelectDto> loadUserByPage(SelectControlRequest selectControlRequest) {
		PageQueryHelper.startPage(selectControlRequest);
		SI200Example example = new SI200Example();
		String keyWord = selectControlRequest.getKeyWord();
		if (!StringUtil.isEmpty(keyWord)) {
			Criteria c = example.createCriteria();
			c.andSicodeLike(String.format("%%%s%%", keyWord));

			c = example.createCriteria();
			c.andSinameLike(String.format("%%%s%%", keyWord));
		}
		Page<SI200> page = (Page<SI200>) interfaceDefineService.getListByExample(example);
		List<InterDefineSelectDto> scoList = new ArrayList<InterDefineSelectDto>();
		for (SI200 si200 : page.getResult()) {
			scoList.add(EntityUtil.entityToDto(si200, InterDefineSelectDto.class));
		}
		return SelectControlResult.createPageResult(scoList, selectControlRequest.getPageNum(), page.getTotal());
	}
}
