package com.cointcompany.backend.user.service;

import com.cointcompany.backend.user.entity.Users;
import com.cointcompany.backend.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    public void saveUsers(Users users) {
        usersRepository.save(users);
    }

}
