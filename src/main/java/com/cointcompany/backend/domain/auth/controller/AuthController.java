package com.cointcompany.backend.domain.auth.controller;

import com.cointcompany.backend.domain.auth.entity.Auth;
import com.cointcompany.backend.domain.auth.service.AuthService;
import com.cointcompany.backend.domain.auth.service.AuthUtil;
import com.cointcompany.backend.domain.user.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UsersService usersService;

    private final AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<String> login(@RequestBody Auth auth) {
        Auth authInDB = authService.findByUserId(auth.getUserId());
        String result = null;
        if (authInDB == null || !authInDB.getPassword().equals(authService.findByPassword(auth.getPassword()).getPassword())) {
            result = "FAIL";
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        result = authUtil.generateToken(auth.getUserId());    // 인증 성공시 토큰 생성

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
//    @PostMapping
//    public String login(@RequestBody Auth auth) {
//        authService.saveAuth(auth);
//        return "SUCCESS";    // 인증 성공시 토큰 생성
//    }
    @GetMapping
    public ResponseEntity<String> login(Authentication authentication) {

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);    // 인증 성공시 토큰 생성
    }

}