package com.cointcompany.backend.domain.departments.controller;

import com.cointcompany.backend.domain.departments.dto.UsersDto;
import com.cointcompany.backend.domain.departments.service.UsersService;
import com.cointcompany.backend.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/table")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;
    private final ModelMapper mapper;

    @GetMapping
    public ResponseEntity<List<UsersDto.GetUsersRes>> getUsers () {

        List<Users> usersList = usersService.findAllUsersToGetUsersRes();
        List<UsersDto.GetUsersRes> usersDtoList = usersList.stream()
                .map(users -> mapper.map(users, UsersDto.GetUsersRes.class))
                .collect(Collectors.toList());

        return new ResponseEntity<>(usersDtoList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> postUsers (@RequestBody List<Users> listUsers) {

        String check = usersService.checkUsers(listUsers);
        if ( check != "SUCCESS")

            return new ResponseEntity<>(check , HttpStatus.BAD_REQUEST);

        for (Users saveUserReq : listUsers) {
            usersService.saveUsers(saveUserReq);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUsers (@RequestBody List<Users> listUsers) {

        List<Users> usersList = new ArrayList<>();
        for (Users modifyUserReq : listUsers) {
            usersService.modifyUsers(modifyUserReq);

        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUsers (@RequestBody List<Long> userId) {

        for (Long aLong : userId) {
            usersService.removeUsers(aLong);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}