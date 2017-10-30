/*
 * 文件名：EntityUtil.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月10日 下午1:40:16
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.common;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;

import com.alibaba.fastjson.JSONObject;
import com.baothink.framework.base.entity.BaseDto;
import com.baothink.framework.base.entity.BaseEntity;
import com.baothink.framework.core.annotion.DtoField;
import com.baothink.framework.core.exception.FrameworkCoreException;
import com.baothink.framework.core.util.DateUtil;
import com.baothink.framework.core.util.StringUtil;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年10月10日 下午1:40:16
 * @since baothink-workflow 0.0.1
 */
public class EntityUtil {

	public EntityUtil() {}
	   
	   public static <E extends BaseEntity> E jsonArrayToEntity(JSONObject jsonObject, E entity)
	   {
	     Class<? extends BaseEntity> e_class = entity.getClass();
	     Field[] e_fields = e_class.getDeclaredFields();
	     String e_name; 
	     for (Field e_field : e_fields) {
	       e_name = e_field.getName();
	       for (Map.Entry<String, Object> entry : jsonObject.entrySet()) {
	         String d_name = (String)entry.getKey();
	         if ((e_name != null) && (e_name.equalsIgnoreCase(d_name))) {
	           e_field.setAccessible(true);
	           try {
	             e_field.set(entity, entry.getValue());
	           } catch (IllegalAccessException|IllegalArgumentException e) {
	             throw new FrameworkCoreException(e, 100205, new Object[] { e_field.getName(), entity, entry.getValue() });
	           }
	         }
	       }
	     }
	     return entity;
	   }
	   
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	   public static <E extends BaseEntity> E dtoToEntity(Object dto, E entity)
	   {
	     Class<? extends BaseEntity> e_class = entity.getClass();
	     
	     Class<? extends Object> d_class = dto.getClass();
	     
	     Field[] d_fields = getAllDeclaredField(d_class);
	     for (Field d_field : d_fields) {
	       d_field.setAccessible(true);
	       Class<?> d_typeClass = d_field.getType();
	       String separator = "/";
	       String[] separatorMapping = null;
	       String d_name = d_field.getName();
	       String m_name = d_field.getName();
	       String format = "";
	       boolean updatable = true;
	       
	       if (d_field.isAnnotationPresent(DtoField.class)) {
	         DtoField dtoField = (DtoField)d_field.getAnnotation(DtoField.class);
	         m_name = dtoField.mapping();
	         if (StringUtil.isEmpty(m_name)) {
	           m_name = d_name;
	         }
	         format = dtoField.format();
	         updatable = dtoField.updatable();
	         separator = dtoField.separator();
	         separatorMapping = dtoField.separatorMapping();
	       }
	       Object obj = null;
	       try
	       {
	         obj = d_field.get(dto);
	       } catch (IllegalAccessException|IllegalArgumentException e1) {
	         throw new FrameworkCoreException(e1, 100206, new Object[] { d_field.getName(), dto }); }
	       String[] strs;
	       int count;
	       int i; if ((!StringUtil.isEmpty(separator)) && (separatorMapping != null) && (separatorMapping.length > 0))
	       {
	         if ((obj != null) && (d_typeClass == String.class))
	         {
	           String str = obj.toString();
	           
	           strs = str.trim().split(separator);
	           count = strs.length;
	           for (i = 0; i < count; i++)
	           {
	             if (separatorMapping.length >= i) {
	               try
	               {
	                 Field field = e_class.getDeclaredField(separatorMapping[i]);
	                 field.setAccessible(true);
	                 if (field != null) {
	                   try {
	                     field.set(entity, strs[i].trim());
	                   } catch (IllegalArgumentException|IllegalAccessException e) {
	                     throw new FrameworkCoreException(e, 100205, new Object[] { field.getName(), entity, obj });
	                   }
	                 }
	               } catch (NoSuchFieldException|SecurityException e) {
	                 throw new FrameworkCoreException(e, 100202, new Object[] { e_class.getName(), separatorMapping[i] });
	               }
	             }
	           }
	         }
	       }
	       else {
	         Field[] e_fields = e_class.getDeclaredFields();
	         for (Field e_field : e_fields) {
	           e_field.setAccessible(true);
	           String e_name = e_field.getName();
	           if ((e_name != null) && (e_name.equals(m_name))) {
	             try {
	               if (updatable) {
	                 Class<?> e_typeClass = e_field.getType();
	                 
	                 if ((obj == null) || (StringUtil.isEmpty(obj.toString()))) {
	                   if ((e_typeClass == Integer.TYPE) || (e_typeClass == Integer.class)) {
	                     obj = Integer.valueOf(0);
	                   } else if (e_typeClass == BigDecimal.class) {
	                     obj = null;
	                   } else if (e_typeClass == Date.class) {
	                     obj = null;
	                   } else if ((e_typeClass == Double.TYPE) || (e_typeClass == Double.class)) {
	                     obj = Integer.valueOf(0);
	                   }
	                 } else if (d_typeClass == String.class) {
	                   if (e_typeClass == BigDecimal.class) {
	                     obj = new BigDecimal(obj.toString());
	                   } else if (e_typeClass == Date.class) {
	                     if (StringUtil.isEmpty(format)) {
	                       format = "yyyy-MM-dd HH:mm:ss";
	                     }
	                     obj = DateUtil.parse(obj.toString(), format);
	                   } else if ((e_typeClass == Integer.TYPE) || (e_typeClass == Integer.class)) {
	                     obj = Integer.valueOf(Integer.parseInt(obj.toString()));
	                   } else if ((e_typeClass == Double.TYPE) || (e_typeClass == Double.class)) {
	                     obj = Double.valueOf(Double.parseDouble(obj.toString()));
	                   }
	                 }
	                 
	                 e_field.set(entity, obj);
	                 break;
	               }
	             } catch (IllegalAccessException|IllegalArgumentException e) {
	               throw new FrameworkCoreException(e, 100205, new Object[] { e_field.getName(), entity, obj });
	             }
	           }
	         }
	       }
	     }
	     return entity;
	   }
	   
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	   public static <E> E entityToDto(BaseEntity entity, Class<E> dCalss)
	   {
	     Class<? extends BaseEntity> e_class = entity.getClass();
	     Class<E> d_class = dCalss;
	     E dto = null;
	     try
	     {
	       dto = d_class.newInstance();
	     } catch (InstantiationException|IllegalAccessException e2) {
	       throw new FrameworkCoreException(e2, 100204, new Object[] { d_class.getName() });
	     }
	     Field[] d_fields = getAllDeclaredField(d_class);
	     for (Field d_field : d_fields) {
	       d_field.setAccessible(true);
	       Class<?> d_typeClass = d_field.getType();
	       String d_name = d_field.getName();
	       String m_name = d_field.getName();
	       String format = "";
	       String separator = "/";
	       String[] separatorMapping = null;
	       
	       if (d_field.isAnnotationPresent(DtoField.class)) {
	         DtoField dtoField = (DtoField)d_field.getAnnotation(DtoField.class);
	         m_name = dtoField.mapping();
	         if (StringUtil.isEmpty(m_name)) {
	           m_name = d_name;
	         }
	         format = dtoField.format();
	         separator = dtoField.separator();
	         separatorMapping = dtoField.separatorMapping();
	       }
	       StringBuilder mergerStr;
	       if ((!StringUtil.isEmpty(separator)) && (separatorMapping != null) && (separatorMapping.length > 0))
	       {
	         if (d_typeClass == String.class) {
	           int count = separatorMapping.length;
	           mergerStr = new StringBuilder();
	           for (int i = 0; i < count; i++)
	           {
	             if (separatorMapping.length >= i) {
	               try
	               {
	                 Field field = e_class.getDeclaredField(separatorMapping[i]);
	                 field.setAccessible(true);
	                 if (field != null) {
	                   try {
	                     Object obj = field.get(entity);
	                     if (obj != null) {
	                       if (i > 0) {
	                         mergerStr.append(separator);
	                       }
	                       mergerStr.append(obj.toString());
	                     }
	                   } catch (IllegalArgumentException|IllegalAccessException e) {
	                     throw new FrameworkCoreException(e, 100206, new Object[] { field.getName(), entity });
	                   }
	                 }
	               } catch (NoSuchFieldException|SecurityException e) {
	                 throw new FrameworkCoreException(e, 100202, new Object[] { e_class.getName(), separatorMapping[i] });
	               }
	             }
	           }
	           try
	           {
	             d_field.set(dto, mergerStr.toString());
	           } catch (IllegalArgumentException|IllegalAccessException e) {
	             throw new FrameworkCoreException(e, 100205, new Object[] { d_field.getName(), dto, mergerStr });
	           }
	         }
	       } else {
	         Field[] e_fields = e_class.getDeclaredFields();
	         for (Field e_field:e_fields) { 
	           e_field.setAccessible(true);
	           String e_name = e_field.getName();
	           if ((e_name != null) && (e_name.equals(m_name))) {
	             Object obj = null;
	             try
	             {
	               obj = e_field.get(entity);
	             } catch (IllegalAccessException|IllegalArgumentException e1) {
	               throw new FrameworkCoreException(e1, 100206, new Object[] { e_field.getName(), entity });
	             }
	             try {
	               Class<?> e_typeClass = e_field.getType();
	               
	               if ((obj != null) && (d_typeClass == String.class) && (!StringUtil.isEmpty(obj.toString()))) {
	                 if (e_typeClass == BigDecimal.class) {
	                   if (!StringUtil.isEmpty(format)) {
	                     obj = new DecimalFormat(format).format(obj);
	                   } else {
	                     obj = obj.toString();
	                   }
	                 } else if (e_typeClass == Date.class) {
	                   if (StringUtil.isEmpty(format)) {
	                     format = "yyyy-MM-dd HH:mm:ss";
	                   }
	                   obj = DateUtil.format((Date)obj, format);
	                 } else if ((e_typeClass == Integer.TYPE) || (e_typeClass == Integer.class)) {
	                   if (!StringUtil.isEmpty(format)) {
	                     obj = new DecimalFormat(format).format(obj);
	                   } else {
	                     obj = obj.toString();
	                   }
	                 } else if ((e_typeClass == Double.TYPE) || (e_typeClass == Double.class)) {
	                   if (!StringUtil.isEmpty(format)) {
	                     obj = new DecimalFormat(format).format(obj);
	                   } else {
	                     obj = obj.toString();
	                   }
	                 }
	               } else if ((obj == null) && (
	                 (d_typeClass == Integer.TYPE) || (d_typeClass == Double.TYPE))) {
	                 obj = Integer.valueOf(0);
	               }
	               
	 
	               d_field.set(dto, obj);
	             }
	             catch (IllegalAccessException|IllegalArgumentException e) {
	               throw new FrameworkCoreException(e, 100205, new Object[] { d_field.getName(), dto, obj });
	             }
	           }
	         }
	       }
	     }
	     return dto;
	   }
	   
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
//	   public static <D extends BaseDto> Object getDtoAttributeValue(D dto, String attributeName)
//	   {
//	     if (attributeName == null) {
//	       return null;
//	     }
//	     try
//	     {
//	       Field field = dto.getClass().getDeclaredField(attributeName);
//	       field.setAccessible(true);
//	     } catch (NoSuchFieldException|SecurityException e) {
//	       throw new FrameworkCoreException(e, 100210, new Object[] { attributeName });
//	     }
//	     try { Field field;
//	       return field.get(dto);
//	     } catch (IllegalArgumentException|IllegalAccessException e) {
//	       throw new FrameworkCoreException(e, 100206, new Object[] { attributeName, dto });
//	     }
//	   }
	   
	 
	 
	 
	 
	 
	 
	   private static Field[] getAllDeclaredField(Class<?> clazz)
	   {
	     Field[] fields = new Field[0];
	     for (; clazz != Object.class; clazz = clazz.getSuperclass()) {
	       try {
	         fields = (Field[])ArrayUtils.addAll(fields, clazz.getDeclaredFields());
	       }
	       catch (Exception localException) {}
	     }
	     
	 
	 
	     return fields;
	   }
}
