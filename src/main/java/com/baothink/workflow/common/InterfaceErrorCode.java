package com.baothink.workflow.common;

/**
 * 
 * 接口错误代码类<br>
 * <br>
 * @author 霍梓潮
 * @version 1.0,2016年11月8日 下午3:02:32
 * @since ecp-wyip-common 0.0.1
 */
public final class InterfaceErrorCode {
	/**
	 * 随机码重复，说明重复请求
	 */
	public static final int RANDOM_CODE_REPETITION = 101;
	/**
	 * 请求失败，身份验证不通过。
	 */
	public static final int IDENTITY_NO_PASS = 102;
	/**
	 * 请求失败，没有访问该接口的权限。
	 */
	public static final int NO_AUTHORITY = 103;
	/**
	 * 请求失败，{0}超出最大请求次数，最大请求次数为：{1}
	 */
	public static final int BEYOND_REQUEST = 104;
	/**
	 * 请求失败，请求频率过高，请求的最小间隔时间为：{0}秒
	 */
	public static final int REQUEST_FREQUENCY = 105;
	/**
	 * 请求失败，请求的方法不正确，请使用GET方法请求。
	 */
	public static final int REQUEST_TO_GET = 106;
	/**
	 * 该接口不允许通过GET方式请求
	 */
	public static final int REQUEST_TO_POST = 107;	
	/**
	 * 请求失败，时间戳格式不正确
	 */
	public static final int REQUEST_TO_TIME = 108;
	/**
	 * 请求失败，未找到接口实现，请检查接口配置是否正确。
	 */
	public static final int INT_CONF_ERROR = 109;
	/**
	 * 请求失败，sicode参数不允许为空。
	 */
	public static final int SICODE_IS_NULL = 201;	
	/**
	 * 请求失败，请求的接口不存在。
	 */
	public static final int INT_NOT_FIND = 202;
	/**
	 * 请求失败，接口账号不存在。
	 */
	public static final int INT_ID_NOT_FIND = 203;
	/**
	 * 请求的POST主体参数解析失败
	 */
	public static final int POST_PARAM_FAIL = 204;
	/**
	 * 随机码过长，长度36
	 */
	public static final int RANDOM_CODE_TOLONG = 205;
	/**
	 * 请求失败，内部发生未知错误，错误标识码：{0}
	 */
	public static final int ERROR = 300;
	/**
	 * 身份验证异常，md5加密异常
	 */
	public static final int IDENTITY_VALI_ERROR = 301;
	/**
	 * 获取spring对象失败
	 */
	public static final int GET_SPRING_CLASS_ERROR = 302; 
	/**
	 * 业务内部逻辑错误
	 */
	public static final int SERVICE_LOGIC_ERROR = 400; 
	/**
	 * 日期转换失败
	 */
	public static final int TO_DATE_ERROR = 401; 
	/**
	 * 获取参数失败，参数不允许为空
	 */
	public static final int PARAM_IS_NULL = 402; 
	/**
	 * 业务未知异常
	 */
	public static final int SERVICE_ERROR = 500; 
	/**
	 * 刷新接口缓存发生异常
	 */
	public static final int REF_BUFFER_ERROR = 801; 
	/**
	 * 刷新接口账号信息缓存发生异常
	 */
	public static final int REF_INT_ACC_BUFFER_ERROR = 802; 
	/**
	 * 刷新账号接口权限信息缓存发生异常
	 */
	public static final int REF_AUT_BUFFER_ERROR = 803; 
	/**
	 * 成功
	 */
	public static final int SUCCESS = 900; 
}
