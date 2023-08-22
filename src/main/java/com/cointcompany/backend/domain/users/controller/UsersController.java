package com.cointcompany.backend.domain.users.controller;

import com.cointcompany.backend.domain.departments.service.DepartmentsService;
import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "사용자", description = "사용자 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
//@CrossOrigin
public class UsersController {

    private final UsersService usersService;
    private final DepartmentsService departmentsService;

    @Operation(summary = "사용자 정보 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<UsersDto.GetUsers>> getUsers () {

        List<UsersDto.GetUsers> usersList = usersService.findAllUsersToGetUsersRes();

        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }

//    @Operation(summary = "사용자 신규 등록")
//    @ApiResponse(responseCode = "200", description = "등록 성공")
//    @PostMapping
//    public ResponseEntity<String> postUsers (@RequestBody List<UsersDto.putUsersReq> usersDepartmentsReqList) {
//
//        for (UsersDto.putUsersReq saveUserReq : usersDepartmentsReqList) {
//            usersService.saveUsers(saveUserReq);
//        }
//
//        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
//    }
    @Operation(summary = "사용자 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<String> saveUsers (@RequestBody List<UsersDto.SaveUsers> usersDepartmentsReqList) {

        for (UsersDto.SaveUsers saveUserReq : usersDepartmentsReqList) {
            usersService.saveUsers(saveUserReq);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

//    @Operation(summary = "사용자 수정")
//    @ApiResponse(responseCode = "200", description = "수정 성공")
//    @PutMapping
//    public ResponseEntity<String> putUsers (@RequestBody List<UsersDto.modifyUsers> modifyUsersList) {
//
//        for (UsersDto.modifyUsers modifyUsers : modifyUsersList) {
//            usersService.modifyUsers(modifyUserReq);
//
//        }
//
//        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
//    }
    @Operation(summary = "사용자 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping
    public ResponseEntity<String> putUsers (@RequestBody List<UsersDto.ModifyUsers> modifyUsersList) {

        for (UsersDto.ModifyUsers modifyUsers : modifyUsersList) {
            usersService.modifyUsers(modifyUsers);

        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    /**
     * 일괄 삭제를 사용하기 위하여 DeleteMapping 대신 PostMapping 사용
     */
    @Operation(summary = "사용자 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUsers (@RequestBody List<Long> userId) {

        for (Long aLong : userId) {
            usersService.removeUsers(aLong);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @Operation(summary = "사용자&사용자그룹 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/usergroup/{userGroupId}")
    public ResponseEntity<List<UsersDto.GetUserUsergroup>> getUserUserGroups (@PathVariable Long userGroupId) {

        return new ResponseEntity<>(usersService.getUserUserGroups(userGroupId), HttpStatus.OK);
    }

    @Operation(summary = "사용자&사용자그룹 이동")
    @ApiResponse(responseCode = "200", description = "이동 성공")
    @PutMapping("/usergroup/{userGroupId}/{userUserGroupId}")
    public ResponseEntity<String> shiftUserUserGroups (
            @PathVariable Long userGroupId,
            @PathVariable Long userUserGroupId
    ) {

        usersService.shiftUserUserGroups(userGroupId, userUserGroupId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "사용자&사용자그룹 추가")
    @ApiResponse(responseCode = "200", description = "추가 성공")
    @PostMapping("/usergroup/{userGroupId}/{userId}")
    public ResponseEntity<String> createUserUserGroups (
            @PathVariable Long userGroupId,
            @PathVariable Long userId
    ) {

        usersService.createUserUserGroups(userGroupId, userId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "사용자&사용자그룹 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/usergroup/{userUserGroupId}")
    public ResponseEntity<String> deleteUserUserGroups (@PathVariable Long userUserGroupId) {

        usersService.deleteUserUserGroups(userUserGroupId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}