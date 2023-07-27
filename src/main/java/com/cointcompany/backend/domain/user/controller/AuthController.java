package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.entity.Auth;
import com.cointcompany.backend.domain.user.service.AuthService;
import com.cointcompany.backend.domain.user.service.AuthUtil;
import com.cointcompany.backend.domain.user.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final UsersService usersService;

    private final AuthUtil authUtil;

    @PostMapping
    public String login(@RequestBody Auth auth) {
        Auth authInDB = authService.findByUserId(auth.getUserId());
        if (authInDB == null || !authInDB.getPassword().equals(authService.findByPassword(auth.getPassword()).getPassword())) {
            return "FAIL";
        }
        return authUtil.generateToken(auth.getUserId());    // 인증 성공시 토큰 생성
    }
//    @PostMapping
//    public String login(@RequestBody Auth auth) {
//        authService.saveAuth(auth);
//        return "SUCCESS";    // 인증 성공시 토큰 생성
//    }
    @GetMapping
    public String login(Authentication authentication) {

        return "SUCCESS";    // 인증 성공시 토큰 생성
    }

}
