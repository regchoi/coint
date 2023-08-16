package com.cointcompany.backend.domain.usergroups.controller;

import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.usergroups.service.UserGroupsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "사용자 그룹", description = "사용자 그룹 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/usergroup")
@CrossOrigin //ToDO cors문제 해결
public class UserGroupsController {

    private final UserGroupsService userGroupsService;

    @Operation(summary = "사용자 그룹 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<UserGroupsDto.GetUserGroupsRes>> getUserGroups () {

        List<UserGroupsDto.GetUserGroupsRes> userGroupsList = userGroupsService.findAllUserGroupsToGetUserGroupsRes();

        return new ResponseEntity<>(userGroupsList, HttpStatus.OK);
    }

    @Operation(summary = "사용자 그룹 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<String> postUserGroups (@RequestBody List<Usergroups> usergroupsList) {

        for (Usergroups saveUserGroups : usergroupsList) {
            userGroupsService.saveUserGroups(saveUserGroups);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "사용자 그룹 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping
    public ResponseEntity<String> putUserGroups (@RequestBody List<Usergroups> listUserGroups) {

        for (Usergroups modifyUserGroup : listUserGroups) {
            userGroupsService.modifyUserGroups(modifyUserGroup);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @Operation(summary = "사용자 그룹 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUserGroups (@RequestBody List<Long> userGroupIdList) {

        for (Long userGroupId : userGroupIdList) {
            userGroupsService.removeUserGroups(userGroupId);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}