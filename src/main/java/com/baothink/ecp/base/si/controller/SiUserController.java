package com.baothink.ecp.base.si.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.ecp.base.common.config.EcpBaseConfigProperties;
import com.baothink.ecp.base.common.exception.ErrorCode;
import com.baothink.ecp.base.si.entity.SI100;
import com.baothink.ecp.base.si.entity.SI100Example;
import com.baothink.ecp.base.si.entity.SI101;
import com.baothink.ecp.base.si.entity.SI101Example;
import com.baothink.ecp.base.si.entity.SI101Example.Criteria;
import com.baothink.ecp.base.si.entity.dto.SiUserDto;
import com.baothink.ecp.base.si.entity.dto.SiUserSelectTableDto;
import com.baothink.ecp.base.si.service.SiUserContrastService;
import com.baothink.ecp.base.si.service.SiUserService;
import com.baothink.ecp.base.sys.entity.S020;
import com.baothink.ecp.base.sys.entity.S020Example;
import com.baothink.ecp.base.sys.service.MemberService;
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
 * 接口账号控制类<br>
 * .
 *
 * @author 肖湘淮
 * @version 1.0,2016年11月3日 下午4:42:46
 * @since ecp-3-base-web-admin 0.1.0
 */
@Controller
@RequestMapping("/si/siUser")
public class SiUserController extends BaseDataController<SI100, SI100Example, SiUserDto, SiUserService> {

	/** The ecp base config properties. */
	@Resource
	private EcpBaseConfigProperties ecpBaseConfigProperties;
	
	/** The si user contrast service. */
	@Resource
	private SiUserContrastService siUserContrastService;
	
	/** The member service. */
	@Resource
	private MemberService memberService;

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
	public ResultAsync addAsync(@Valid SiUserDto dto) {
		LoginUserInfo userInfo = null;
		try {
			userInfo = this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		int addCount = 0;
		SI100 entity = EntityUtil.dtoToEntity(dto, new SI100());
		entity.setId(UUIDUtil.createShortUUID());
		entity.setSysId(ecpBaseConfigProperties.getSysId());
		entity.setSysName(ecpBaseConfigProperties.getSysName());
		entity.setPtId(userInfo.getPtId());
		entity.setPtName(userInfo.getPtName());
		entity.setDataFlag("0");
		entity.setSipwd(entity.getSipwd());
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
		int updateCount = 0;
		try {
			SI100 entity = service.getByPrimaryKey(ids[0]);
			SI101Example example = new SI101Example();
			Criteria c = example.createCriteria();
			c.andSiaccnoEqualTo(entity.getSiaccno());
			List<SI101> list = siUserContrastService.getListByExample(example);
			if (list != null && list.size() > 0) {
				for (SI101 si101 : list) {
					siUserContrastService.deleteByPrimaryKey(si101.getId());
				}
			}
			updateCount = service.deleteByPrimaryKey(ids[0]);
			if (updateCount == 1) {
				return ResultAsync.success();
			}
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
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
		SI100Example example = new SI100Example();
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
	public ResultAsync modifyAsync(@Valid SiUserDto dto) {
		LoginUserInfo userInfo = null;
		try {
			// 获取登录用户对象，未登录则会触发异常
			userInfo = this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		int modifyCount = 0;
		dto.setDataFlag("0");
		dto.setUpdateEId(userInfo.getEmpCode());
		dto.setUpdateEName(userInfo.getEmpName());
		dto.setUpdateDate(DateUtil.format(DateUtil.getCurrDate(), "yyyy-MM-dd HH:mm:ss"));
		try {
			modifyCount = service.modifyByPrimaryKey(dto.getId(), dto);
		} catch (BaseServiceException e) {
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		if (modifyCount == 1) {
			return ResultAsync.success(dto);
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
	public String toContentPage(ModelMap map) {
		return "base/si/siUserManage";
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
		SiUserDto dto = null;
		try {
			if (!StringUtil.isEmpty(id)) {
				SI100 entity = service.getByPrimaryKey(id);
				dto = EntityUtil.entityToDto(entity, SiUserDto.class);
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
	 * 判断接入账号是否存在<br>
	 * .
	 *
	 * @param siaccno
	 *            接入账号
	 * @return 是否存在boolean值
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/judgeIsExists.htm", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public Boolean judgeIsExists(String siaccno) {
		if (!StringUtil.isEmpty(siaccno)) {
			SI100Example example = new SI100Example();
			example.createCriteria().andSiaccnoEqualTo(siaccno);
			List<SI100> list = service.getListByExample(example);
			if (list != null && list.size() > 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 获取会员下拉数据（分页）<br>
	 * .
	 *
	 * @param selectControlRequest
	 *            the select control request
	 * @return the select control result
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@RequestMapping(value = "/loadUserByPage.htm")
	@ResponseBody
	public SelectControlResult<SiUserSelectTableDto> loadUserByPage(SelectControlRequest selectControlRequest) {
		PageQueryHelper.startPage(selectControlRequest);
		S020Example example = new S020Example();
		String keyWord = selectControlRequest.getKeyWord();
		if (!StringUtil.isEmpty(keyWord)) {
			com.baothink.ecp.base.sys.entity.S020Example.Criteria c = example.createCriteria();
			c.andEntCodeLike(String.format("%%%s%%", keyWord));

			c = example.createCriteria();
			c.andEntNameLike(String.format("%%%s%%", keyWord));
			example.or(c);

			c = example.createCriteria();
			c.andEntShortNameLike(String.format("%%%s%%", keyWord));
			example.or(c);
		}
		Page<S020> page = (Page<S020>) memberService.getListByExample(example);
		List<SiUserSelectTableDto> scoList = new ArrayList<SiUserSelectTableDto>();
		for (S020 s020 : page.getResult()) {
			scoList.add(EntityUtil.entityToDto(s020, SiUserSelectTableDto.class));
		}
		return SelectControlResult.createPageResult(scoList, selectControlRequest.getPageNum(), page.getTotal());
	}

	/**
	 * 修改密码<br>
	 * .
	 *
	 * @param sipwd
	 *            密码
	 * @param siaccno
	 *            接口账号
	 * @return 成功或失败提示
	 * @since ecp-3-base-web-admin 0.1.0
	 */
	@Token
	@RequestMapping(value = "/modifyPwd.htm")
	@ResponseBody
	public ResultAsync modifyPwd(String sipwd, String siaccno) {
		if (!StringUtil.isEmpty(sipwd) && !StringUtil.isEmpty(siaccno)) {
			SI100Example example = new SI100Example();
			example.createCriteria().andSiaccnoEqualTo(siaccno);
			List<SI100> list = service.getListByExample(example);
			if (list != null && list.size() == 1) {
				SI100 si100 = list.get(0);
				SiUserDto dto = EntityUtil.entityToDto(si100, SiUserDto.class);
				dto.setSipwd(sipwd);
				try {
					service.modifyByPrimaryKey(dto.getId(), dto);
				} catch (BaseServiceException e) {
					return ResultAsync.error(e.getErrorCode(), e.getMessage());
				}
				return ResultAsync.success();
			}
		}
		return ResultAsync.failure(ErrorCode.ADMIN_MODIFY_ERROR);
	}
}
