package com.cointcompany.backend.domain.user.service;

import com.cointcompany.backend.domain.user.dto.UsersDto;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final ModelMapper mapper;

//    @Transactional
//    public void saveUsers(UsersDto.SaveUserReq users) {
//        Users user = users;
//        user.setRegDate(LocalDateTime.now());
//        usersRepository.save(user);
//    }
    @Transactional
    public void saveUsers(Users users) {
        log.info("save");
        users.setRegDate(LocalDateTime.now());
        usersRepository.save(users);
    }

    @Transactional(readOnly = true)
    public List<UsersDto.GetUsersRes> findAllUsersToGetUsersRes() {

        List<Users> usersList = usersRepository.findAll();
        List<UsersDto.GetUsersRes> usersResList = new ArrayList<>();
        for (Users users : usersList) {
            usersResList.add(mapper.map(users, UsersDto.GetUsersRes.class));
        }

        return usersResList;
    }

    @Transactional
    public void removeUsers(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        user.setDelyn(Boolean.TRUE);
        user.setModDate(LocalDateTime.now());
    }

    @Transactional
    public void modifyUsers(UsersDto.ModifyUserReq users) {
        Users user = usersRepository.getById(users.getId_num());

        user.setState(users.getState());
        user.setSeq(users.getSeq());
        user.setId(users.getId());
        user.setUserName(users.getUserName());
        user.setUserPosition(users.getUserPosition());
        user.setUserDepartment(users.getUserDepartment());
        user.setIsAdmin(users.getIsAdmin());
        user.setEmail(users.getEmail());
        user.setPhone(users.getPhone());
        user.setModDate(LocalDateTime.now());
    }
}
