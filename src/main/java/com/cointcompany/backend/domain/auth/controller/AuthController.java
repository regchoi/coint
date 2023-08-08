//package com.cointcompany.backend.domain.auth.controller;
//
//import com.cointcompany.backend.domain.auth.dto.AuthDto;
//import com.cointcompany.backend.domain.auth.entity.Auth;
//import com.cointcompany.backend.domain.auth.service.AuthService;
//import com.cointcompany.backend.domain.user.service.UsersService;
//import lombok.Getter;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.*;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import javax.validation.Valid;
//
//@Slf4j
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final AuthService authService;
//    private final BCryptPasswordEncoder encoder;
//
//    private final long COOKIE_EXPIRATION = 7776000; //90일
//
////    private final AuthUtil authUtil;
//
//    // 회원가입
//    @PostMapping("/signup")
//    public ResponseEntity<Void> signup(@RequestBody @Valid AuthDto.SignupDto signupDto) {
//        String encodedPassword = encoder.encode(signupDto.getPassword());
//        AuthDto.SignupDto newSignupDto = AuthDto.SignupDto.encodePassword(signupDto, encodedPassword);
//
//        authService.registerUser(newSignupDto);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    // 로그인 -> 토큰 발급
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody @Valid AuthDto.LoginDto loginDto) {
//        // User 등록 및 Refresh Token 저장
//        AuthDto.TokenDto tokenDto = authService.login(loginDto);
//
//        // RT 저장
//        HttpCookie httpCookie = ResponseCookie.from("refresh-token", tokenDto.getRefreshToken())
//                .maxAge(COOKIE_EXPIRATION)
//                .httpOnly(true)
//                .secure(true)
//                .build();
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, httpCookie.toString())
//                // AT 저장
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenDto.getAccessToken())
//                .build();
//    }
//
//    @PostMapping("/validate")
//    public ResponseEntity<?> validate(@RequestHeader("Authorization") String requestAccessToken) {
//        if (!authService.validate(requestAccessToken)) {
//            return ResponseEntity.status(HttpStatus.OK).build(); // 재발급 필요X
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 재발급 필요
//        }
//    }
//    // 토큰 재발급
//    @PostMapping("/reissue")
//    public ResponseEntity<?> reissue(@CookieValue(name = "refresh-token") String requestRefreshToken,
//                                     @RequestHeader("Authorization") String requestAccessToken) {
//        AuthDto.TokenDto reissuedTokenDto = authService.reissue(requestAccessToken, requestRefreshToken);
//
//        if (reissuedTokenDto != null) { // 토큰 재발급 성공
//            // RT 저장
//            ResponseCookie responseCookie = ResponseCookie.from("refresh-token", reissuedTokenDto.getRefreshToken())
//                    .maxAge(COOKIE_EXPIRATION)
//                    .httpOnly(true)
//                    .secure(true)
//                    .build();
//            return ResponseEntity
//                    .status(HttpStatus.OK)
//                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
//                    // AT 저장
//                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + reissuedTokenDto.getAccessToken())
//                    .build();
//
//        } else { // Refresh Token 탈취 가능성
//            // Cookie 삭제 후 재로그인 유도
//            ResponseCookie responseCookie = ResponseCookie.from("refresh-token", "")
//                    .maxAge(0)
//                    .path("/")
//                    .build();
//            return ResponseEntity
//                    .status(HttpStatus.UNAUTHORIZED)
//                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
//                    .build();
//        }
//    }
//
//    // 로그아웃
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@RequestHeader("Authorization") String requestAccessToken) {
//        authService.logout(requestAccessToken);
//        ResponseCookie responseCookie = ResponseCookie.from("refresh-token", "")
//                .maxAge(0)
//                .path("/")
//                .build();
//
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
//                .build();
//    }
//
////    @PostMapping
////    public ResponseEntity<String> login(@RequestBody Auth auth) {
////        Auth authInDB = authService.findByUserId(auth.getUserId());
////        String result = null;
////        if (authInDB == null || !authInDB.getPassword().equals(authService.findByPassword(auth.getPassword()).getPassword())) {
////            result = "FAIL";
////            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
////        }
////        result = authUtil.generateToken(auth.getUserId());    // 인증 성공시 토큰 생성
////
////        return new ResponseEntity<>(result, HttpStatus.OK);
////    }
////    @PostMapping
////    public String login(@RequestBody Auth auth) {
////        authService.saveAuth(auth);
////        return "SUCCESS";    // 인증 성공시 토큰 생성
////    }
////    @GetMapping
////    public ResponseEntity<String> login(Authentication authentication) {
////
////        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);    // 인증 성공시 토큰 생성
////    }
//
//}