package com.cointcompany.backend.common.config.security.jwt.security;

import com.cointcompany.backend.domain.users.entity.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class UserDetailsImpl implements UserDetails {

    private final Users users;

    public UserDetailsImpl(Users users) {
        this.users = users;
    }

    //JWT "role" value 값 설정 - 권한 설정
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> users.getRole()); // key: ROLE_권한
        return authorities;
    }

    @Override
    public String getUsername() {
        return users.getLoginId();
    }

    @Override
    public String getPassword() {
        return users.getLoginPw();
    }

    public Long getUserId() {
        return users.getIdNum();
    }


    // == 세부 설정 == //

    @Override
    public boolean isAccountNonExpired() { // 계정의 만료 여부
        return true;
    }

    @Override
    public boolean isAccountNonLocked() { // 계정의 잠김 여부
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() { // 비밀번호 만료 여부
        return true;
    }

    @Override
    public boolean isEnabled() { // 계정의 활성화 여부
        return true;
    }
}
