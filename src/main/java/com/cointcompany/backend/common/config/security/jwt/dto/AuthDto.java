package com.cointcompany.backend.common.config.security.jwt.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class LoginDto {
        private String loginId;
        private String loginPw;

        @Builder
        public LoginDto(String loginId, String loginPw) {
            this.loginId = loginId;
            this.loginPw = loginPw;
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class SignupDto {
        private String loginId;
        private String loginPw;

        @Builder
        public SignupDto(String loginId, String loginPw) {
            this.loginId = loginId;
            this.loginPw = loginPw;
        }

        public static SignupDto encodePassword(SignupDto signupDto, String encodedPassword) {
            SignupDto newSignupDto = new SignupDto();
            newSignupDto.loginId = signupDto.getLoginId();
            newSignupDto.loginPw = encodedPassword;
            return newSignupDto;
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class TokenDto {
        private String accessToken;
        private String refreshToken;

        public TokenDto(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}
