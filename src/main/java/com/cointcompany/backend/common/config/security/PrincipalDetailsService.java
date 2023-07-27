package com.cointcompany.backend.common.config.security;

import com.cointcompany.backend.domain.user.entity.Auth;
import com.cointcompany.backend.domain.user.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final AuthRepository authRepository;
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Auth userEntity = authRepository.findById(userId);
        return new PrincipalDetails(userEntity);
    }
}
