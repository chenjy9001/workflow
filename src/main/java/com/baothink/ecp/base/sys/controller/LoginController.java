/*
 * 文件名：PlatformPrivilegesController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2016年8月22日 下午3:28:01
 * 修改人：陈敬尧
 * 修改时间：2016年8月24日20:47:28	
 * 需改内容：修改异常处理方式，只接收异常错误代码，由错误代码输出错误信息
 * 修改人：陈敬尧
 * 修改时间：2016年8月25日17:13:51	
 * 需改内容：修改异常处理实现方法，和保存用户信息方式
 * 修改人：陈敬尧
 * 修改时间：2016年8月30日13:34:03	
 * 需改内容：登录跳转页面移到该control下
 */
package com.baothink.ecp.base.sys.controller;

import java.security.PrivateKey;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.ecp.base.common.config.EcpBaseConfigProperties;
import com.baothink.ecp.base.common.exception.BusinessException;
import com.baothink.ecp.base.common.exception.ErrorCode;
import com.baothink.ecp.base.sys.entity.S011;
import com.baothink.ecp.base.sys.entity.dto.PlatformInfoDto;
import com.baothink.ecp.base.sys.service.LoginLogService;
import com.baothink.ecp.base.sys.service.PlatformInfoService;
import com.baothink.ecp.base.sys.service.UserService;
import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.enums.VerifyCodeTypeEnum;
import com.baothink.framework.base.exception.BaseControllerException;
import com.baothink.framework.base.exception.BaseServiceException;
import com.baothink.framework.core.login.LoginUserInfo;
import com.baothink.framework.core.util.EncryptUtil;
import com.baothink.framework.core.util.RSAUtil;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.framework.web.base.admin.BaseAdminController;
//import com.baothink.message.api.util.SsoUserUtil;

/**
 * 用户控制<br>
 * 运营平台用户登录<br>
 * .
 *
 * @author 陈敬尧
 * @version 1.0，2016年8月19日 上午10:46:45
 * @since ecp-demo-web-admin 0.0.1
 */
@Controller
@RequestMapping(value = "/login")
public class LoginController extends BaseAdminController {

	/** The log. */
	private static Logger log = LoggerFactory.getLogger(LoginController.class);

	/** The ecp base config properties. */
	@Resource
	private EcpBaseConfigProperties ecpBaseConfigProperties;

	/** The platform info service. */
	@Resource
	private PlatformInfoService platformInfoService;
//	@Resource(name = "baseUserService")
	@Resource
	private UserService userService;

	/** The login log service. */
	@Resource
	private LoginLogService loginLogService;

	/** The sso user util. */
//	@Resource
//	private SsoUserUtil ssoUserUtil;

	/**
	 * 后台登录<br>
	 * .
	 *
	 * @param loginStr
	 *            登录认证加密字符串
	 * @param checkcode
	 *            验证码
	 * @return 登录结果对象
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@ResponseBody
	@RequestMapping(value = "/loginAsync.htm", produces = "text/html;charset=UTF-8")
	public ResultAsync loginAsync(String loginStr, String checkcode) {
		// 判断用户是否已经登录
//		try {
//			getLoginUserInfo();
//		} catch (BaseControllerException e) {
//			log.error(e.getMessage(), e);
//			return ResultAsync.failure(ErrorCode.LOGIN_HAVE);
//		}
		if (StringUtil.isEmpty(checkcode)) {
			return ResultAsync.failure(ErrorCode.LOGIN_IMAGECODE_NULL);
		}
		// 登录使用的验证码
		String imageCode = getImageVerifyCode(VerifyCodeTypeEnum.login);
		if ((imageCode == null) || (!checkcode.equalsIgnoreCase(imageCode))) {
			return ResultAsync.failure(ErrorCode.LOGIN_IMAGECODE_ERROR);
		}
		// 清除验证码
		clearImageVerifyCode(VerifyCodeTypeEnum.login);

		ResultAsync result = null; // 记录登录成功或失败提示
		S011 sysUser = null; // 解密用户认证信息
		LoginUserInfo info = null; // 封装登录用户信息
		PlatformInfoDto platformInfo = null; // 平台信息
		String logResult = "0"; // 登录结果
		String ptId = ""; // 平台代码
		String empCode = ""; // 用户代码
		String ptName = ""; // 平台名称
		String empName = ""; // 用户名称
		try {
			// 解密登录信息
			sysUser = this.analysisSysUser(loginStr, imageCode, this.getFilePath(ecpBaseConfigProperties.getUserLoginkey()));
			if ((sysUser == null) || ("".equals(sysUser.toString().trim()))) {
				throw new BusinessException(ErrorCode.LOGIN_ERROR);
			}
			// 登录
			platformInfo = platformInfoService.getPlatformInfo(sysUser.getPtId());
			if (platformInfo == null) {
				throw new BusinessException(ErrorCode.LOGIN_PT_NOT_FOUND);
			}
			log.debug("LoginAction--&gt 开始登录....");
			S011 localSysUser = userService.getUserInfo(sysUser.getPtId(), sysUser.getEmpCode());
			// 判断用户是否存在
			if (localSysUser == null) {
				throw new BusinessException(ErrorCode.LOGIN_USER_NOT);
			}

			log.debug("LoginAction--&gt 封装session对象....");
			info = new LoginUserInfo();
			// 根据平台代码查询数据
			info.setEmpCode(localSysUser.getEmpCode());
			info.setEmpName(localSysUser.getEmpName());
			info.setPtId(platformInfo.getPtId());
			info.setPtName(platformInfo.getPtName());
			info.setEntCode(platformInfo.getPtId());
			info.setEntName(platformInfo.getPtName());
			info.setAdmin(ecpBaseConfigProperties.isAdmin(localSysUser.getEmpCode()));

//			ssoUserUtil.addUser(info);
//			if (ssoUserUtil.getRequest() == null) {
//				ssoUserUtil.setRequest(this.request);
//			}

			// 判断用户是否有权限
			if (!isValid(localSysUser)) {
				throw new BusinessException(ErrorCode.LOGIN_USER_FORBIDDEN);
			}
			if (!localSysUser.getPassword().equals(sysUser.getPassword())) {
				throw new BusinessException(ErrorCode.LOGIN_PASSWORD_ERROR);
			}

			// 保存登录信息
			log.debug("LoginAction--&gt 封装session对象完成");
			session.setAttribute(ecpBaseConfigProperties.getLoginInfoKey(), info);
			log.debug("LoginAction--&gt  LoginUserInfo对象存入session");
			ptName = info.getPtName();
			empName = info.getEmpName();
			result = ResultAsync.success();
		} catch (BaseServiceException e) {
			log.error(e.getMessage(), e);
			// 错误代码
			int errorCode = e.getErrorCode();

			if (errorCode == 300005 && platformInfo != null) { // 如果用户不存在且平台账号存在，则赋值给平台名称
				ptName = platformInfo.getPtName();
				logResult = "3";
			} else if (errorCode != 300005 && errorCode != 300007) { // 如果用户与平台账号都存在，则赋值给平台名称和用户名称
				ptName = info.getPtName();
				empName = info.getEmpName();
			}

			// 设置登录结果
			if (errorCode == 300002) {
				logResult = "1"; // 登录信息解密失败
			} else if (errorCode == 300007) {
				logResult = "2"; // 平台账号错误
			} else if (errorCode == 300005) {
				logResult = "3"; // 账户错误
			} else if (errorCode == 300004) {
				logResult = "4"; // 账户已冻结
			} else if (errorCode == 300009) {
				logResult = "5"; // 密码错误
			}

			// 如果返回错误为“用户被冻结”或者“密码错误”，则一致返回“账号或密码不匹配”，其他按照原异常返回
			if (errorCode == 300004 || errorCode == 300009) {
				result = ResultAsync.failure(ErrorCode.LOGIN_USER_PASSWORD_ERROR);
			} else {
				result = ResultAsync.error(e.getErrorCode(), e.getMessage());
			}
		}
		// 如果解密登录信息存在
		if (sysUser != null) {
			ptId = sysUser.getPtId();
			empCode = sysUser.getEmpCode();
		}
//		try {
//			// 新增登录日志
//			loginLogService.addAdminLoginLog(session.getId(), this.getIpAddr(), logResult, ptId, ptName, empCode, empName);
//		} catch (BaseServiceException e) {
//			log.error(e.getMessage(), e);
//		}
		return result;
	}

	/**
	 * 解密字符串<br>
	 * 解析前台返回的用户信息<br>
	 * .
	 *
	 * @param paramString1
	 *            登录加密字符串
	 * @param paramString2
	 *            验证码，判断解密是否成功
	 * @param paramString3
	 *            密钥地址
	 * @return 用户信息
	 * @throws BaseServiceException
	 *             the base service exception
	 * @since ecp-demo-web-admin 0.0.1
	 */
	private S011 analysisSysUser(String paramString1, String paramString2, String paramString3) throws BaseServiceException {
		if (log.isDebugEnabled()) {
			log.debug("LoginAction--&gt 登录解密中...");
			log.debug(String.format("LoginAction--&gt 待解密的字符串：%s", paramString1));
		}
		S011 localSysUser = null;
		try {
			PrivateKey localPrivateKey = RSAUtil.getKeyPair(paramString3).getPrivate();
			log.debug("LoginAction--&gt 加载私匙成功");
			String str = RSAUtil.decryptForLogin(localPrivateKey, paramString1);
			if (log.isDebugEnabled()) {
				log.debug(new StringBuilder().append("LoginAction--&gt 解密后的信息：").append(str).toString());
			}
			String[] arrayOfString = str.split("#");
			if (!arrayOfString[3].equalsIgnoreCase(paramString2)) {
				log.debug("LoginAction--&gt 解密信息验证不通过");
				return localSysUser;
			}
			localSysUser = new S011();
			localSysUser.setPtId(arrayOfString[0]);
			localSysUser.setEmpCode(arrayOfString[1]);
			localSysUser.setPassword(EncryptUtil.saltd5Digest(arrayOfString[2]));
		} catch (Exception localException) {
			log.error(String.format("LoginAction--&gt 登录解密失败，异常信息：%s", localException.getMessage()), localException);
			return localSysUser;
		}
		log.debug("LoginAction--&gt 登录解密成功");
		return localSysUser;
	}

	/**
	 * 判断用户权限<br>
	 * <br>
	 * .
	 *
	 * @param paramSysUser
	 *            the param sys user
	 * @return 判断值
	 * @since ecp-demo-web-admin 0.0.1
	 */
	public boolean isValid(S011 paramSysUser) {
		log.debug("LoginAction--&gt 判断用户权限。");
		boolean i = true;
		try {
			String str = paramSysUser.getVaildFlag();
			if ("0".equals(str))
				i = false;
		} catch (Exception localException) {
			log.error(localException.getMessage(), localException);
		}
		log.debug("LoginAction--&gt 判断用户完成。");
		return i;
	}

	/**
	 * 退出登录.
	 *
	 * @return 退出登录信息
	 * @since ecp-3-base-web-admin 0.0.1
	 */
	@ResponseBody
	@RequestMapping(value = "/logoutAsync.htm", produces = "text/html;charset=UTF-8")
	public ResultAsync logout() {
		try {
			this.getLoginUserInfo();
		} catch (BaseControllerException e) {
			log.error(e.getMessage(), e);
			return ResultAsync.error(e.getErrorCode(), e.getMessage());
		}
		try {
			loginLogService.addLogoutLog(session.getId());
		} catch (BaseServiceException e) {
			log.error(e.getMessage(), e);
		}
		session.invalidate();
		return ResultAsync.success();
	}
}
