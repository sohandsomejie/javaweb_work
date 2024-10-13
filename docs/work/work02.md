# Filter

## 1. 介绍

### 功能实现描述

1. **定义过滤器**：
   - 定义了一个名为 `LoginFilter` 的过滤器类，该过滤器用于检查用户是否已经登录。

2. **过滤器配置**：
   - 使用 `@WebFilter` 注解声明了此过滤器的名称为 `LoginFilter`，并指定其作用于所有请求路径下 (`/*`)。

3. **初始化白名单**：
   - 在类中初始化了一个白名单列表 `whiteList`，存储不需要进行登录验证的 URL 路径，例如 `/work02_filter/`。

4. **处理请求**：
   - 实现了 `Filter` 接口中的 `doFilter` 方法，在每次请求时都会调用此方法。
   - 首先将 `ServletRequest` 和 `ServletResponse` 分别强制转换为 `HttpServletRequest` 和 `HttpServletResponse`，以便获取更多 HTTP 请求和响应的信息。
   - 获取当前 HTTP 会话 `HttpSession`，用于检查用户是否已登录。
   - 检查请求的 URL 是否在白名单内，如果是，则进一步检查用户是否已登录。
     - 如果用户已登录（即 `session` 中存在 `username` 属性），则输出“已登录”的信息。
     - 如果用户未登录，则输出“未登录”的信息，并将请求重定向到登录页面 `/work02_filter/login.html`。

5. **输出日志信息**：
   - 输出请求的 URL 地址，便于调试和监控。
   - 继续执行过滤链中的下一个过滤器或目标资源。
   - 最后输出过滤器执行结束的信息 “LoginFilter 执行过滤结束”。


## 2. 代码

``` java
   
// 定义一个名为LoginFilter的过滤器类，用于检查用户是否已经登录
package com.sohandsome.work02_filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

// 通过@WebFilter注解声明此过滤器的名称为"LoginFilter"，并指定其作用于所有请求路径下
@WebFilter(filterName = "LoginFilter", urlPatterns = "/*")
public class LoginFilter implements Filter {

    // 初始化一个白名单列表，存储不需要进行登录验证的URL路径
    private final List<String> whiteList = List.of("/work02_filter/");

    // 实现Filter接口中的doFilter方法，此方法在每次请求时被调用
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 强制类型转换ServletRequest为HttpServletRequest以获取更多HTTP请求的信息
        HttpServletRequest req = (HttpServletRequest) request;

        // 获取当前HTTP会话
        HttpSession session = req.getSession();

        // 强制类型转换ServletResponse为HttpServletResponse以便重定向或设置响应头
        HttpServletResponse res = (HttpServletResponse) response;

        // 检查请求的URL是否在白名单内
        if (this.whiteList.contains(req.getRequestURI())) {

            // 如果用户已登录（session中存在用户名属性）
            if (session.getAttribute("username") != null) {
                // 输出已登录的信息
                System.out.println("已登录");
            } else {
                // 输出未登录的信息，并将请求重定向到登录页面
                System.out.println("未登录");
                res.sendRedirect("/work02_filter/login.html");
            }
        }

        // 输出请求的URL
        System.out.println(req.getRequestURI());

        // 继续执行过滤链中的下一个过滤器或目标资源
        chain.doFilter(req, response);

        // 输出过滤器执行结束的信息
        System.out.println("LoginFilter 执行过滤结束");
    }
} 
``` 