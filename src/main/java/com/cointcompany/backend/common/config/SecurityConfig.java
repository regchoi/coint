package com.cointcompany.backend.common.config;

import com.cointcompany.backend.common.filter.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfig corsConfig;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .csrf(a -> a.disable())  // POST가 정상적으로 수행되려면 csrf().disable()해야 돼
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Session 사용 안함
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)  // 모든 요청에 대해 jwtRequestFilter 적용
                .authorizeRequests()
                .requestMatchers("/api/auth").permitAll()  // /api/auth 경로는 인증 없이 허용
                .anyRequest().authenticated();  // 그 외의 모든 요청은 인증 필요

        return httpSecurity.build();
    }
}
