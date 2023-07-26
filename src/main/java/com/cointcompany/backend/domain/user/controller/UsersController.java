package com.cointcompany.backend.domain.user.controller;

import com.cointcompany.backend.domain.user.dto.UsersDto.ModifyUserReq;
import com.cointcompany.backend.domain.user.dto.UsersDto.GetUsersRes;
import com.cointcompany.backend.domain.user.entity.Users;
import com.cointcompany.backend.domain.user.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/table")
@CrossOrigin
public class UsersController {

    private final UsersService usersService;

    @GetMapping
    public ResponseEntity<String> getUsers () {

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<String> postUsers (Users users) {
        usersService.saveUsers(users);

        log.info("데이터 받기");
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    // TODO: 나중에 response 코드 리팩토링
    @PutMapping
    public ResponseEntity<String> putUsers (
            @RequestBody ModifyUserReq[] usersDto) {

        log.info("");
        List<GetUsersRes> getUsersRes;

        for (ModifyUserReq modifyUserReq : usersDto) {
            usersService.updateUsers(modifyUserReq);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<String> deleteUsers (Long userId) {
        usersService.deleteUsers(userId);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
