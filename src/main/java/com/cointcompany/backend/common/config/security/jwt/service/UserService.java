package com.cointcompany.backend.common.config.security.jwt.service;


import com.cointcompany.backend.common.config.security.jwt.dto.AuthDto;
import com.cointcompany.backend.domain.users.entity.Users;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UsersRepository usersRepository;

    @Transactional
    public void registerUser(AuthDto.SignupDto signupDto) {
        Users users = Users.registerUser(signupDto);
        usersRepository.save(users);
    }
}
