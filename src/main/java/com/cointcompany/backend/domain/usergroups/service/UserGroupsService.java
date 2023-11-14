package com.cointcompany.backend.domain.usergroups.service;

import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.usergroups.repository.UserGroupsRepository;
import com.cointcompany.backend.domain.users.repository.UserUsergroupRepository;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserGroupsService {

    private final UserGroupsRepository userGroupsRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper mapper;

    @Transactional
    public String saveUserGroups(Usergroups usergroups) {

            userGroupsRepository.save(usergroups);
            return "SUCCESS";
    }

    @Transactional(readOnly = true)
    public List<UserGroupsDto.GetUserGroupsRes> findAllUserGroupsToGetUserGroupsRes() {

        List<Usergroups> usergroupsList = userGroupsRepository.findAll();
        List<UserGroupsDto.GetUserGroupsRes> usersResList = new ArrayList<>();

        for (Usergroups usergroups : usergroupsList) {
            UserGroupsDto.GetUserGroupsRes getUserGroupsRes = new UserGroupsDto.GetUserGroupsRes(usergroups);
            if (usergroups.getModUserid() != null) {
                getUserGroupsRes.setModUserid(usersRepository.findById(usergroups.getModUserid()).orElseThrow().getName());
            }
            if (usergroups.getRegUserid() != null) {
                getUserGroupsRes.setRegUserid(usersRepository.findById(usergroups.getRegUserid()).orElseThrow().getName());
            }
            usersResList.add(getUserGroupsRes);
        }
        return usersResList;
    }

    @Transactional
    public void removeUserGroups(Long userGroupsId) {
        Usergroups usergroups = userGroupsRepository.findById(userGroupsId).orElseThrow();
        usergroups.setDel(Boolean.TRUE);
    }

    @Transactional
    public void modifyUserGroups(Usergroups usergroups) {
        Usergroups userGroup = userGroupsRepository.getReferenceById(usergroups.getIdNum());

        userGroup.setDescription(usergroups.getDescription());
    }

}
