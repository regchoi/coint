package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.entity.Auth;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    private final AuthUtil authUtil;

    @PostMapping
    public String login(@RequestBody Auth auth) {
        Auth authInDB = authService.findById(auth.getId());
        if (authInDB == null || !authInDB.getPassword().equals(authService.findByPassword(auth.getPassword()).getPassword())) {
            return "FAIL";
        }
        return authUtil.generateToken(auth.getId());    // 인증 성공시 토큰 생성
    }

}
