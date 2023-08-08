//package com.cointcompany.backend.domain.auth.entity;
//
//import com.cointcompany.backend.domain.auth.dto.AuthDto;
//import jakarta.persistence.*;
//import lombok.*;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Collection;
//
//@Getter
//@Entity
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//public class Auth {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    private String userId;
//
//    private String password;
//
//    @Enumerated(EnumType.STRING)
//    private Role role; // 사용자 권한
//
//    public static Auth registerUser(AuthDto.SignupDto signupDto) {
//        Auth auth = new Auth();
//
//        auth.userId = signupDto.getUserId();
//        auth.password = signupDto.getPassword();
//        auth.role = Role.USER;
//
//        return auth;
//    }
//}
