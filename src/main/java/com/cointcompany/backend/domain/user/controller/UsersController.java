package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.dto.UsersDto.ModifyUserReq;
import com.cointcompany.backend.domain.user.dto.UsersDto.GetUsersRes;
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
    public ResponseEntity<List<Users>> getUsers () {

        List<Users> usersList = usersService.findAllUsers();


        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<String> postUsers (@RequestBody List<Users> listUsers) {

        for (Users user : listUsers) {
            usersService.saveUsers(user);

        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUsers (
            @RequestBody List<Users> listUsers) {

        List<Users> usersList = new ArrayList<>();
        for (Users user : listUsers) {
            usersService.modifyUsers(user);

        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<String> deleteUsers (
            @RequestBody List<Long> userId) {
        for (Long aLong : userId) {
            usersService.removeUsers(aLong);
        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
