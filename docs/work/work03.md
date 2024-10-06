# Listener

## 1. 介绍

## 2. 代码

``` java
package com.sohandsome.work1;

import jakarta.servlet.ServletRequestEvent;
import jakarta.servlet.ServletRequestListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebListener
public class MyListener implements ServletRequestListener {
    private static final String START_TIME = "startTime";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public void requestDestroyed(ServletRequestEvent sre) {
        System.out.println("requestDestroyed");
        long endTime = System.currentTimeMillis();
        Object startTimeObj = sre.getServletRequest().getAttribute(START_TIME);
        if (startTimeObj instanceof Long) {
            long startTime = (Long) startTimeObj;
            HttpServletRequest request = (HttpServletRequest) sre.getServletRequest();
            String clientIp = request.getRemoteAddr();
            String method = request.getMethod();
            String uri = request.getRequestURI();
            String queryString = request.getQueryString();
            String userAgent = request.getHeader("User-Agent");
            String requestTime = LocalDateTime.now().format(formatter);
            System.out.println("客户端IP："+clientIp);
            System.out.println("请求方式："+method);
            System.out.println("请求地址："+uri);
            System.out.println("请求参数："+queryString);
            System.out.println("User-Agent："+userAgent);
            System.out.println("请求时间："+requestTime);
            System.out.println("请求结束："+requestTime);
            System.out.println("请求耗时："+(endTime-startTime)+"ms");
        }
    }

    public void requestInitialized(ServletRequestEvent sre) {
        System.out.println("init");
        long start = System.currentTimeMillis();
        sre.getServletRequest().setAttribute(START_TIME, start);
        LocalDateTime now = LocalDateTime.now();
        System.out.println("请求时间："+now.format(formatter));
    }

}

```
