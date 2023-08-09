package com.cointcompany.backend.domain.usergroups.controller;

import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.usergroups.service.UserGroupsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/usergroup")
@CrossOrigin
public class UserGroupsController {

    private final UserGroupsService userGroupsService;

    @GetMapping
    public ResponseEntity<List<UserGroupsDto.GetUserGroupsRes>> getUserGroups () {

        List<UserGroupsDto.GetUserGroupsRes> userGroupsList = userGroupsService.findAllUserGroupsToGetUserGroupsRes();

        return new ResponseEntity<>(userGroupsList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> postUserGroups (@RequestBody List<Usergroups> usergroupsList) {

        for (Usergroups saveUserGroups : usergroupsList) {
            userGroupsService.saveUserGroups(saveUserGroups);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUserGroups (@RequestBody List<Usergroups> listUserGroups) {

        for (Usergroups modifyUserGroup : listUserGroups) {
            userGroupsService.modifyUserGroups(modifyUserGroup);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUserGroups (@RequestBody List<Long> userGroupIdList) {

        for (Long userGroupId : userGroupIdList) {
            userGroupsService.removeUserGroups(userGroupId);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}