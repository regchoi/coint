package com.cointcompany.backend.domain.users.service;

import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.entity.Users;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final ModelMapper mapper;

    public String checkUsers(List<Users> users) {
        for (Users user : users) {
            if (usersRepository.findByLoginId(user.getLoginId()).isPresent())
                return "이미 있는 아이디입니다";
        }
        return "SUCCESS";
    }

    @Transactional
    public String saveUsers(Users users) {
        log.info("save");
        if (usersRepository.findByLoginId(users.getLoginId()).isPresent()) {
            return "이미 있는 아이디입니다";
        } else {
            usersRepository.save(users);
            return "SUCCESS";
        }

    }

    @Transactional(readOnly = true)
    public List<UsersDto.GetUsersRes> findAllUsersToGetUsersRes() {

        List<Users> usersList = usersRepository.findAll();
        List<UsersDto.GetUsersRes> usersDtoList = usersList.stream()
                .map(users -> mapper.map(users, UsersDto.GetUsersRes.class))
                .collect(Collectors.toList());

        return usersDtoList;
    }

    @Transactional
    public void removeUsers(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        user.setDel(Boolean.TRUE);
    }

    @Transactional
    public void modifyUsers(Users users) {
        Users user = usersRepository.getReferenceById(users.getIdNum());

        user.setName(users.getName());
        user.setPosition(users.getPosition());
        user.setPhone(users.getPhone());
        user.setEmail(users.getEmail());

    }
}
