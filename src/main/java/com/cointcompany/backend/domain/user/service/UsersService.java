package com.cointcompany.backend.domain.user.service;

import com.cointcompany.backend.domain.user.dto.UsersDto;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    public void saveUsers(Users users) {
        usersRepository.save(users);
    }

    public void deleteUsers(Long userId) {
        usersRepository.deleteById(userId);
    }

    public Users updateUsers(UsersDto.ModifyUserReq user) {
        Users dbUser = usersRepository.findById(user.getId_num()).orElseThrow();
        dbUser.setState(user.getState());
        dbUser.setSeq(user.getSeq());
        dbUser.setId(user.getId());
        dbUser.setUserName(user.getUserName());
        dbUser.setUserPosition(user.getUserPosition());
        dbUser.setUserDepartment(user.getUserDepartment());
        dbUser.setIsAdmin(user.getIsAdmin());
        dbUser.setEmail(user.getEmail());
        dbUser.setPhone(user.getPhone());
//        dbUser.setModDate(LocalDateTime.now());

        return dbUser;
    }
}
