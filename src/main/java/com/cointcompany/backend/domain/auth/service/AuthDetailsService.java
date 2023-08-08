//package com.cointcompany.backend.domain.auth.service;
//
//import com.cointcompany.backend.domain.auth.entity.Auth;
//import com.cointcompany.backend.domain.auth.entity.AuthDetails;
//import com.cointcompany.backend.domain.auth.repository.AuthRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class AuthDetailsService implements UserDetailsService {
//
//    private final AuthRepository authRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
//        Auth findUser = authRepository.findByUserId(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("Can't find user -> " + userId));
//
//        return new AuthDetails(findUser);
//
//    }
//}
