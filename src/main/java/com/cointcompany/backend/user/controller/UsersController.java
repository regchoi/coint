package com.cointcompany.backend.user.controller;

import com.cointcompany.backend.user.entity.Users;
import com.cointcompany.backend.user.service.UsersService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/table")
public class UsersController {

    private final UsersService usersService;

    @GetMapping
    public ResponseEntity<String> getUsers () {

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<String> postUsers (Users users) {
        usersService.saveUsers(users);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PutMapping
    public ResponseEntity<String> putUsers () {

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<String> deleteUsers () {

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
