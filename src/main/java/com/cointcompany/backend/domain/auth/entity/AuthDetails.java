//package com.cointcompany.backend.domain.auth.entity;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.ArrayList;
//import java.util.Collection;
//
//public class AuthDetails implements UserDetails {
//
//    private final Auth auth;
//
//    public AuthDetails(Auth auth) {
//        this.auth = auth;
//    }
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        Collection<GrantedAuthority> authorities = new ArrayList<>();
//        authorities.add(() -> auth.getRole().getKey()); // key: ROLE_권한
//        return authorities;
//    }
//
//    @Override
//    public String getPassword() {
//        return auth.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return auth.getUserId();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return false;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return false;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return false;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return false;
//    }
//}
