# Listener

## 1. 介绍

### 功能实现描述

1. **定义监听器**：
   - 定义了一个名为 `MyListener` 的监听器类，该监听器用于记录请求的开始时间和结束时间。

2. **监听器配置**：
   - 使用 `@WebListener` 注解声明此监听器。

3. **常量定义**：
   - 定义常量 `START_TIME`，用于存储请求开始时间的键。
   - 定义日期时间格式化器 `formatter`，格式为 `yyyy-MM-dd HH:mm:ss`。

4. **请求销毁时的操作**：
   - 实现了 `ServletRequestListener` 接口中的 `requestDestroyed` 方法，在请求销毁时调用此方法。
   - 获取当前时间作为结束时间。
   - 从请求中获取开始时间。
   - 检查开始时间是否为 `Long` 类型。
     - 如果开始时间为 `Long` 类型，则进行以下操作：
       - 获取客户端 IP 地址。
       - 获取请求方式。
       - 获取请求地址。
       - 获取请求参数。
       - 获取 User-Agent。
       - 获取当前时间。
       - 输出相关信息。
       - 计算请求耗时并输出。

5. **请求初始化时的操作**：
   - 实现了 `ServletRequestListener` 接口中的 `requestInitialized` 方法，在请求初始化时调用此方法。
   - 获取当前时间作为开始时间。
   - 将开始时间存储在请求对象中。
   - 获取当前时间。
   - 输出请求开始时间。


## 2. 代码

```java
// 定义一个名为MyListener的监听器类，用于记录请求的开始时间和结束时间
package com.sohandsome.work1;

import jakarta.servlet.ServletRequestEvent;
import jakarta.servlet.ServletRequestListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

// 通过@WebListener注解声明此监听器
@WebListener
public class MyListener implements ServletRequestListener {

    // 定义常量，用于存储请求开始时间的键
    private static final String START_TIME = "startTime";

    // 定义日期时间格式化器
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 当请求销毁时调用此方法
     * @param sre ServletRequestEvent 对象
     */
    public void requestDestroyed(ServletRequestEvent sre) {
        System.out.println("requestDestroyed");

        // 获取当前时间作为结束时间
        long endTime = System.currentTimeMillis();

        // 从请求中获取开始时间
        Object startTimeObj = sre.getServletRequest().getAttribute(START_TIME);

        // 检查开始时间是否为 Long 类型
        if (startTimeObj instanceof Long) {
            long startTime = (Long) startTimeObj;

            // 强制类型转换为 HttpServletRequest 以获取更多请求信息
            HttpServletRequest request = (HttpServletRequest) sre.getServletRequest();

            // 获取客户端 IP 地址
            String clientIp = request.getRemoteAddr();

            // 获取请求方式
            String method = request.getMethod();

            // 获取请求地址
            String uri = request.getRequestURI();

            // 获取请求参数
            String queryString = request.getQueryString();

            // 获取 User-Agent
            String userAgent = request.getHeader("User-Agent");

            // 获取当前时间
            String requestTime = LocalDateTime.now().format(formatter);

            // 输出相关信息
            System.out.println("客户端IP：" + clientIp);
            System.out.println("请求方式：" + method);
            System.out.println("请求地址：" + uri);
            System.out.println("请求参数：" + queryString);
            System.out.println("User-Agent：" + userAgent);
            System.out.println("请求时间：" + requestTime);
            System.out.println("请求结束：" + requestTime);
            System.out.println("请求耗时：" + (endTime - startTime) + "ms");
        }
    }

    /**
     * 当请求初始化时调用此方法
     * @param sre ServletRequestEvent 对象
     */
    public void requestInitialized(ServletRequestEvent sre) {
        System.out.println("init");

        // 获取当前时间作为开始时间
        long start = System.currentTimeMillis();

        // 将开始时间存储在请求对象中
        sre.getServletRequest().setAttribute(START_TIME, start);

        // 获取当前时间
        LocalDateTime now = LocalDateTime.now();

        // 输出请求开始时间
        System.out.println("请求时间：" + now.format(formatter));
    }
}


```
