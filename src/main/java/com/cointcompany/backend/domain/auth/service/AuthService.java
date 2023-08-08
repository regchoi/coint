//package com.cointcompany.backend.domain.auth.service;
//
//
//import com.cointcompany.backend.common.config.security.JwtTokenProvider;
//import com.cointcompany.backend.common.config.security.RedisService;
//import com.cointcompany.backend.domain.auth.dto.AuthDto;
//import com.cointcompany.backend.domain.auth.entity.Auth;
//import com.cointcompany.backend.domain.auth.repository.AuthRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Date;
//import java.util.stream.Collectors;
//
//@Slf4j
//@Service
//@Transactional(readOnly = true)
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final JwtTokenProvider jwtTokenProvider;
//    private final AuthenticationManagerBuilder authenticationManagerBuilder;
//    private final RedisService redisService;
//    private final AuthRepository authRepository;
//
//    private final String SERVER = "Server";
//
//    // 로그인: 인증 정보 저장 및 비어 토큰 발급
//    @Transactional
//    public AuthDto.TokenDto login(AuthDto.LoginDto loginDto) {
//        log.info("login 서비스 시작");
//
//        UsernamePasswordAuthenticationToken authenticationToken =
//                new UsernamePasswordAuthenticationToken(loginDto.getUserId(), loginDto.getPassword());
//
//        log.info("{}", authenticationToken.getPrincipal());
//
//        log.info("AuthenticationToken 발급");
//
//        Authentication authentication = authenticationManagerBuilder.getObject()
//                .authenticate(authenticationToken);
//
//        log.info("{}", authentication.getName());
//        log.info("Authentication 발급");
//
//        log.info("ContextHolder");
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        log.info("토큰 생성 직전");
//        return generateToken(SERVER, authentication.getName(), getAuthorities(authentication));
//    }
//
//    // AT가 만료일자만 초과한 유효한 토큰인지 검사
//    public boolean validate(String requestAccessTokenInHeader) {
//        String requestAccessToken = resolveToken(requestAccessTokenInHeader);
//        return jwtTokenProvider.validateAccessTokenOnlyExpired(requestAccessToken); // true = 재발급
//    }
//
//    // 토큰 재발급: validate 메서드가 true 반환할 때만 사용 -> AT, RT 재발급
//    @Transactional
//    public AuthDto.TokenDto reissue(String requestAccessTokenInHeader, String requestRefreshToken) {
//        String requestAccessToken = resolveToken(requestAccessTokenInHeader);
//
//        Authentication authentication = jwtTokenProvider.getAuthentication(requestAccessToken);
//        String principal = getPrincipal(requestAccessToken);
//
//        String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
//        if (refreshTokenInRedis == null) { // Redis에 저장되어 있는 RT가 없을 경우
//            return null; // -> 재로그인 요청
//        }
//
//        // 요청된 RT의 유효성 검사 & Redis에 저장되어 있는 RT와 같은지 비교
//        if(!jwtTokenProvider.validateRefreshToken(requestRefreshToken) || !refreshTokenInRedis.equals(requestRefreshToken)) {
//            redisService.deleteValues("RT(" + SERVER + "):" + principal); // 탈취 가능성 -> 삭제
//            return null; // -> 재로그인 요청
//        }
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        String authorities = getAuthorities(authentication);
//
//        // 토큰 재발급 및 Redis 업데이트
//        redisService.deleteValues("RT(" + SERVER + "):" + principal); // 기존 RT 삭제
//        AuthDto.TokenDto tokenDto = jwtTokenProvider.createToken(principal, authorities);
//        saveRefreshToken(SERVER, principal, tokenDto.getRefreshToken());
//        return tokenDto;
//    }
//
//    // 토큰 발급
//    @Transactional
//    public AuthDto.TokenDto generateToken(String provider, String userId, String authorities) {
//        // RT가 이미 있을 경우
//        if(redisService.getValues("RT(" + provider + "):" + userId) != null) {
//            redisService.deleteValues("RT(" + provider + "):" + userId); // 삭제
//        }
//
//        // AT, RT 생성 및 Redis에 RT 저장
//        AuthDto.TokenDto tokenDto = jwtTokenProvider.createToken(userId, authorities);
//        saveRefreshToken(provider, userId, tokenDto.getRefreshToken());
//        return tokenDto;
//    }
//
//    public String getAuthorities(Authentication authentication) {
//        return authentication.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(","));
//    }
//
//    // RT를 Redis에 저장
//    @Transactional
//    public void saveRefreshToken(String provider, String principal, String refreshToken) {
//        redisService.setValuesWithTimeout("RT(" + provider + "):" + principal, // key
//                refreshToken, // value
//                jwtTokenProvider.getTokenExpirationTime(refreshToken)); // timeout(milliseconds)
//    }
//
//    // AT로부터 principal 추출
//    public String getPrincipal(String requestAccessToken) {
//        return jwtTokenProvider.getAuthentication(requestAccessToken).getName();
//    }
//
//    // "Bearer {AT}"에서 {AT} 추출
//    public String resolveToken(String requestAccessTokenInHeader) {
//        if (requestAccessTokenInHeader != null && requestAccessTokenInHeader.startsWith("Bearer ")) {
//            return requestAccessTokenInHeader.substring(7);
//        }
//        return null;
//    }
//
//    // 로그아웃
//    @Transactional
//    public void logout(String requestAccessTokenInHeader) {
//        String requestAccessToken = resolveToken(requestAccessTokenInHeader);
//        String principal = getPrincipal(requestAccessToken);
//
//        // Redis에 저장되어 있는 RT 삭제
//        String refreshTokenInRedis = redisService.getValues("RT(" + SERVER + "):" + principal);
//        if (refreshTokenInRedis != null) {
//            redisService.deleteValues("RT(" + SERVER + "):" + principal);
//        }
//
//        // Redis에 로그아웃 처리한 AT 저장
//        long expiration = jwtTokenProvider.getTokenExpirationTime(requestAccessToken) - new Date().getTime();
//        redisService.setValuesWithTimeout(requestAccessToken,
//                "logout",
//                expiration);
//    }
//
//    @Transactional
//    public void registerUser(AuthDto.SignupDto signupDto) {
//        Auth auth = Auth.registerUser(signupDto);
//        authRepository.save(auth);
//    }
//}