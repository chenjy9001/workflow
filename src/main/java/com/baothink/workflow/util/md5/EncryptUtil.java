/*
 * 文件名：EncryptUtil.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月25日 下午5:08:31
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.util.md5;

import java.security.MessageDigest;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月25日 下午5:08:31
 * @since baothink-workflow 0.0.1
 */
public class EncryptUtil {

	/**
	 * 
	 * md5加密<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月25日 下午5:34:55
	 * @param src
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	public static String md5Digest(String src){
		try{
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] b = md.digest(src.getBytes("utf-8"));
			return byte2HexStr(b);
		}catch(Exception e){
			throw new RuntimeException();
		}
	}
	
	/**
	 * 
	 * 字节转换为字符串<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月25日 下午5:35:14
	 * @param b
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	private static String byte2HexStr(byte[] b){
		StringBuilder sb = new StringBuilder();
		for(byte element : b){
			String s = Integer.toHexString(element & 0xFF );
			if(s.length() == 1){
				sb.append("0");
			}
			sb.append(s);
		}
		return sb.toString();
	}
	
	public static void main(String[] args) {
		EncryptUtil.md5Digest("abc");
	}
}
