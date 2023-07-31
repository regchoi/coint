package com.cointcompany.backend.common.config.security;

import com.cointcompany.backend.domain.auth.repository.AuthRepository;
import com.cointcompany.backend.domain.auth.service.AuthUtil;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

//    private final CorsConfig corsConfig;
    private final AuthRepository authRepository;
    private final AuthUtil authUtil;
    @Bean
    public SecurityFilterChain filterChain (HttpSecurity httpSecurity) throws Exception {
        AuthenticationManager authenticationManager = httpSecurity.getSharedObject(AuthenticationManager.class);
        log.info("{}", "security filter chain");
        httpSecurity
                .csrf(a -> a.disable())  // POST가 정상적으로 수행되기 위해 필요
                .sessionManagement(
                        httpSecuritySessionManagementConfigurer ->
                                httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Session 사용 안함
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                        .requestMatchers("/api/auth").permitAll()
                        .requestMatchers("/api/chart").permitAll()
//                        .requestMatchers("/api/table/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthenticationFilter(authUtil),
                        UsernamePasswordAuthenticationFilter.class); // /api/auth 경로는 인증 없이 허용
                 // 모든 요청에 대해 jwtRequestFilter 적용
//                .anyRequest().authenticated();  // 그 외의 모든 요청은 인증 필요

        return httpSecurity.build();
    }


}