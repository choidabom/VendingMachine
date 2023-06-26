package com.spring.vendingmachinespring;

import jakarta.servlet.*;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class RequestTimeFilter implements Filter {

    @Override
    // init(): 필터가 생성될 때 수행되는 메서드
    // 스프링이 시작하면서 init 메서드가 수행된 것을 볼 수 있다.
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
        log.info("FirstFilter 가 생성됩니다.");
    }

    @Override
    // doFilter(): Request, Response 가 필터를 거칠 때 수행되는 메서드
    // doFilter 메서드 내에서 현재 시간을 기록한 후, chang.doFilter(request, response)를 호출하여 다음 필터 또는 서블릿으로 요청을 전달
    // 응답이 도착한 후에는 다시 현재 시간을 기록하고, 요청 처리 시간을 계산하여 로깅하거나 다른 작업을 수행할 수 있다.
    // 필터 - 컨트롤러 - 필터
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("====== RequestTimeFilter 필터 시작 ! ======");
        long startTime = System.currentTimeMillis();

        // 다음 필터 또는 서블릿으로 요청 전달
        chain.doFilter(request, response);

        long endTime = System.currentTimeMillis();
        long requestTime = endTime - startTime;

        // 요청 처리 시간 로깅 또는 다른 작업 수행
        log.info("Request Time: " + requestTime + "ms");

        log.info("====== RequestTimeFilter 필터 종료 ! ======");
    }

    @Override
    // destroy(): 필터가 소멸될 때 수행되는 메서드
    public void destroy() {
        log.info("FirstFilter 가 사라집니다.");
    }
}
