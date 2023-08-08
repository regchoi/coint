//package com.cointcompany.backend.domain.auth.dto;
//
//import lombok.AccessLevel;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//public class AuthDto {
//
//    @Getter
//    @NoArgsConstructor(access = AccessLevel.PROTECTED)
//    public static class LoginDto {
//        private String userId;
//        private String password;
//
//        @Builder
//        public LoginDto(String userId, String password) {
//            this.userId = userId;
//            this.password = password;
//        }
//    }
//
//    @Getter
//    @NoArgsConstructor(access = AccessLevel.PROTECTED)
//    public static class SignupDto {
//        private String userId;
//        private String password;
//
//        @Builder
//        public SignupDto(String userId, String password) {
//            this.userId = userId;
//            this.password = password;
//        }
//
//        public static SignupDto encodePassword(SignupDto signupDto, String encodedPassword) {
//            SignupDto newSignupDto = new SignupDto();
//            newSignupDto.userId = signupDto.getUserId();
//            newSignupDto.password = encodedPassword;
//            return newSignupDto;
//        }
//    }
//
//    @Getter
//    @NoArgsConstructor(access = AccessLevel.PROTECTED)
//    public static class TokenDto {
//        private String accessToken;
//        private String refreshToken;
//
//        public TokenDto(String accessToken, String refreshToken) {
//            this.accessToken = accessToken;
//            this.refreshToken = refreshToken;
//        }
//    }
//}