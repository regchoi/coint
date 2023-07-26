package com.cointcompany.backend.domain.user.service;

import com.cointcompany.backend.domain.user.dto.UsersDto;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;

    public Users saveUsers(Users users) {
        return usersRepository.save(users);
    }

    public List<Users> findAllUsers() {
        return usersRepository.findAll();
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

    @Transactional
    public void removeUsers(Long userId) {
        usersRepository.findById(userId).orElseThrow().setDelyn(Boolean.TRUE);

    }

    @Transactional
    public void modifyUsers(Users users) {
        Users user = usersRepository.getById(users.getId_num());
        user.setState(user.getState());
        user.setSeq(users.getSeq());
        user.setId(users.getId());
        user.setUserName(users.getUserName());
        user.setUserPosition(users.getUserPosition());
        user.setUserDepartment(users.getUserDepartment());
        user.setIsAdmin(users.getIsAdmin());
        user.setEmail(users.getEmail());
        user.setPhone(users.getPhone());
    }
}
