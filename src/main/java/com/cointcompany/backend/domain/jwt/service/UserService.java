package com.cointcompany.backend.domain.jwt.service;


import com.cointcompany.backend.domain.jwt.domain.User;
import com.cointcompany.backend.domain.jwt.dto.AuthDto;
import com.cointcompany.backend.domain.jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public void registerUser(AuthDto.SignupDto signupDto) {
        User user = User.registerUser(signupDto);
        userRepository.save(user);
    }
}
