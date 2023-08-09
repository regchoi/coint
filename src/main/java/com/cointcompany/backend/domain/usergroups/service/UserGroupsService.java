package com.cointcompany.backend.domain.usergroups.service;

import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.usergroups.repository.UserGroupsRepository;
import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.entity.Users;
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
public class UserGroupsService {

    private final UserGroupsRepository userGroupsRepository;
    private final ModelMapper mapper;

    @Transactional
    public String saveUserGroups(Usergroups usergroups) {

            userGroupsRepository.save(usergroups);
            return "SUCCESS";
    }

    @Transactional(readOnly = true)
    public List<UserGroupsDto.GetUserGroupsRes> findAllUserGroupsToGetUserGroupsRes() {

        List<Usergroups> usersList = userGroupsRepository.findAll();
        List<UserGroupsDto.GetUserGroupsRes> usersResList = usersList.stream()
                .map(usergroups -> mapper.map(usergroups, UserGroupsDto.GetUserGroupsRes.class))
                .collect(Collectors.toList());

        return usersResList;
    }

    @Transactional
    public void removeUserGroups(Long userGroupsId) {
        Usergroups usergroups = userGroupsRepository.findById(userGroupsId).orElseThrow();
        usergroups.setDel(Boolean.TRUE);
    }

    // TODO 유저 권한 수정
    @Transactional
    public void modifyUserGroups(Usergroups usergroups) {
        Usergroups userGroup = userGroupsRepository.getReferenceById(usergroups.getIdNum());

        userGroup.setDescription(usergroups.getDescription());

    }
}
