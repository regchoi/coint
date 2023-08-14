package com.cointcompany.backend.domain.users.controller;

import com.cointcompany.backend.domain.departments.service.DepartmentsService;
import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;
    private final DepartmentsService departmentsService;

    @GetMapping
    public ResponseEntity<List<UsersDto.GetUsersRes>> getUsers () {

        List<UsersDto.GetUsersRes> usersList = usersService.findAllUsersToGetUsersRes();

        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> postUsers (@RequestBody List<UsersDto.putUsersReq> usersDepartmentsReqList) {

        for (UsersDto.putUsersReq saveUserReq : usersDepartmentsReqList) {
            usersService.saveUsers(saveUserReq);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUsers (@RequestBody List<UsersDto.putUsersReq> listUsers) {

        for (UsersDto.putUsersReq modifyUserReq : listUsers) {
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