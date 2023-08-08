package com.cointcompany.backend.common.config.security.jwt.security;

import com.cointcompany.backend.domain.users.entity.Users;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Override
    public UserDetailsImpl loadUserByUsername(String loginId) throws UsernameNotFoundException {
        Users findUsers = usersRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("Can't find user with this loginId. -> " + loginId));

        if(findUsers != null){
            UserDetailsImpl userDetails = new UserDetailsImpl(findUsers);
            return  userDetails;
        }

        return null;
    }
}
