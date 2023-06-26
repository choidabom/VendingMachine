package com.spring.vendingmachinespring;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    public FilterRegistrationBean<RequestTimeFilter> RequestTimeRegister() {
        // 필터 클래스(RequestTimeFilter)를 만들면 이 필터를 Spring Bean 으로 등록해야 한다.
        // 필터를 빈으로 등록하기 위해 스프링 설정에 FilterRegistrationBean 을 이용해 직접 만든 필터를 등록할 수 있다.
        FilterRegistrationBean<RequestTimeFilter> registrationBean = new FilterRegistrationBean<>(new RequestTimeFilter());
        registrationBean.setOrder(1);
        return registrationBean;
    }
}