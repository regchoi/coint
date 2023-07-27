package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.entity.Auth;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.service.AuthService;
import com.cointcompany.backend.domain.user.service.AuthUtil;
import com.cointcompany.backend.domain.user.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
