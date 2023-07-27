package com.cointcompany.backend.domain.user.service;

import com.cointcompany.backend.domain.user.entity.Auth;
import com.cointcompany.backend.domain.user.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthService implements UserDetailsService {

    private final AuthRepository authRepository;


    public Auth findByUserId(String id) { return authRepository.findByUserId(id); }

    public Auth saveAuth(Auth auth) {
        return authRepository.save(auth);
    }

    public Auth findByPassword(String password) { return authRepository.findByPassword(password); }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authRepository.findByUserId(username);
    }
}
