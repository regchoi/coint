package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.dto.UsersDto.SaveUserReq;
import com.cointcompany.backend.domain.user.dto.UsersDto;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.service.UsersService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/table")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;

    @GetMapping
    public ResponseEntity<List<UsersDto.GetUsersRes>> getUsers () {

        List<UsersDto.GetUsersRes> usersList = usersService.findAllUsersToGetUsersRes();

        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }
//    @PostMapping
//    public ResponseEntity<String> postUsers (@RequestBody List<UsersDto.SaveUserReq> listUsers) {
//
//        for (UsersDto.SaveUserReq saveUserReq : listUsers) {
//            usersService.saveUsers(saveUserReq);
//
//        }
//        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
//    }
    @PostMapping
    public ResponseEntity<String> postUsers (@RequestBody List<Users> listUsers) {

        for (Users saveUserReq : listUsers) {
            usersService.saveUsers(saveUserReq);

        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUsers (
            @RequestBody List<UsersDto.ModifyUserReq> listUsers) {

        List<UsersDto.ModifyUserReq> usersList = new ArrayList<>();
        for (UsersDto.ModifyUserReq modifyUserReq : listUsers) {
            usersService.modifyUsers(modifyUserReq);

        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUsers (
            @RequestBody List<Long> userId) {
        for (Long aLong : userId) {
            usersService.removeUsers(aLong);
        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
