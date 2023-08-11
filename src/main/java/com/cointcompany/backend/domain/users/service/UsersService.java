package com.cointcompany.backend.domain.users.service;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.usergroups.repository.UserGroupsRepository;
import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.entity.UserDepartment;
import com.cointcompany.backend.domain.users.entity.UserUsergroup;
import com.cointcompany.backend.domain.users.entity.Users;
import com.cointcompany.backend.domain.users.repository.UserDepartmentRepository;
import com.cointcompany.backend.domain.users.repository.UserUsergroupRepository;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
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
public class UsersService {

    private final UsersRepository usersRepository;
    private final DepartmentsRepository departmentsRepository;
    private final UserGroupsRepository userGroupsRepository;
    private final UserDepartmentRepository userDepartmentRepository;
    private final UserUsergroupRepository userUsergroupRepository;
    private final ModelMapper mapper;

    public String checkUsers(List<Users> users) {
        for (Users user : users) {
            if (usersRepository.findByLoginId(user.getLoginId()).isPresent())
                return "이미 있는 아이디입니다";
        }
        return "SUCCESS";
    }

    @Transactional
    public String saveUsers(UsersDto.putUsersReq putUsersDepartmentsReq) {
//        log.info("save");
//
//        Users users = Users.of(
//                putUsersDepartmentsReq.getLoginId(), putUsersDepartmentsReq.getName(),
//                putUsersDepartmentsReq.getPosition(), putUsersDepartmentsReq.getPhone(),
//                putUsersDepartmentsReq.getEmail()
//        );
//        usersRepository.save(users);
//        // 받은 데이터 중에서 부서만 따로 추출
//        List<DepartmentsDto.GetUserDepartmentRes> getUserDepartmentResList = putUsersDepartmentsReq.getGetUserDepartmentResList();
//
//        // 부서가 있다면 진행
//        for (DepartmentsDto.GetUserDepartmentRes getUserDepartmentRes : getUserDepartmentResList) {
//            Long departmentIdNum =
//                userDepartmentRepository.save(UserDepartment.of(
//                        users,
//                        departmentsRepository.findById(getUserDepartmentRes.getIdNum()).orElseThrow()
//                ));
//        }
//
//        List<UserGroupsDto.GetUserUserGroupsRes> getUserUserGroupsResList = putUsersDepartmentsReq.getGetUserUserGroupsResList();
//
//        for (UserGroupsDto.GetUserUserGroupsRes getUserUserGroupsRes : getUserUserGroupsResList) {
//                userUsergroupRepository.save(UserUsergroup.of(
//                        users,
//                        userGroupsRepository.findById(getUserUserGroupsRes.getIdNum()).orElseThrow()
//                ));
//
//        }



        return "SUCCESS";

    }

    /**
     * users 테이블에 reg_userid가 비어있으면 안됨!
     */
    @Transactional(readOnly = true)
    public List<UsersDto.GetUsersRes> findAllUsersToGetUsersRes() {

        List<UsersDto.GetUsersRes> usersDtoList = new ArrayList<>();
        List<Users> usersList = usersRepository.findAll();

        List<UserDepartment> userDepartmentList;
        List<UserUsergroup> userUsergroupsList;

        for (Users users : usersList) {

            userDepartmentList = userDepartmentRepository.findByUsers_IdNum(users.getIdNum());
            List<DepartmentsDto.GetUserDepartmentRes> getUserDepartmentResList = new ArrayList<>();
            for (UserDepartment userDepartment : userDepartmentList) {
                DepartmentsDto.GetUserDepartmentRes getUserDepartmentRes = new DepartmentsDto.GetUserDepartmentRes(
                        userDepartment.getIdNum(), userDepartment.getDepartments());
                getUserDepartmentResList.add(getUserDepartmentRes);
            }

            userUsergroupsList = userUsergroupRepository.findByUsers_IdNum(users.getIdNum());
            List<UserGroupsDto.GetUserUserGroupsRes> getUserUserGroupsResList = new ArrayList<>();
            for (UserUsergroup userUsergroup : userUsergroupsList) {
                UserGroupsDto.GetUserUserGroupsRes getUserUserGroupsRes = new UserGroupsDto.GetUserUserGroupsRes(
                        userUsergroup.getIdNum(), userUsergroup.getUsergroups()
                );
                getUserUserGroupsResList.add(getUserUserGroupsRes);
            }

            UsersDto.GetUsersRes usersRes = new UsersDto.GetUsersRes(users, getUserDepartmentResList, getUserUserGroupsResList);
            usersRes.setRegUserid(usersRepository.findById(users.getRegUserid()).orElseThrow().getName());
            usersDtoList.add(usersRes);
        }


        return usersDtoList;
    }

    @Transactional
    public void removeUsers(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        user.setDel(Boolean.TRUE);
    }

    @Transactional
    public void modifyUsers(UsersDto.putUsersReq putUsersDepartmentsReq) {
//        Users user = usersRepository.getReferenceById(putUsersDepartmentsReq.getIdNum());
//
//        user.setName(putUsersDepartmentsReq.getName());
//        user.setPosition(putUsersDepartmentsReq.getPosition());
//        user.setPhone(putUsersDepartmentsReq.getPhone());
//        user.setEmail(putUsersDepartmentsReq.getEmail());
//
//        List<DepartmentsDto.GetUserDepartmentRes> getUserDepartmentResList = putUsersDepartmentsReq.getGetUserDepartmentResList();
//
//        // 부서가 있다면 진행
//        for (DepartmentsDto.GetUserDepartmentRes getUserDepartmentRes : getUserDepartmentResList) {
//            if (userDepartmentRepository.findByDepartments_IdNumAndUsers_IdNum(getUserDepartmentRes.getIdNum(), user.getIdNum()) == null){
//                userDepartmentRepository.save(UserDepartment.of(
//                        user,
//                        departmentsRepository.findById(getUserDepartmentRes.getIdNum()).orElseThrow()
//                ));
//            }
//        }
//
//        List<UserGroupsDto.GetUserUserGroupsRes> getUserUserGroupsResList = putUsersDepartmentsReq.getGetUserUserGroupsResList();
//
//        for (UserGroupsDto.GetUserUserGroupsRes getUserUserGroupsRes : getUserUserGroupsResList) {
//                userUsergroupRepository.save(UserUsergroup.of(
//                        user,
//                        userGroupsRepository.findById(getUserUserGroupsRes.getIdNum()).orElseThrow()
//                ));
//        }

    }

    public List<Users> getUsersByDepartmentId(Long departmentId) {
        List<UserDepartment> userDepartments = userDepartmentRepository.findByDepartments_IdNum(departmentId);
        return userDepartments.stream()
                .map(UserDepartment::getUsers)
                .collect(Collectors.toList());
    }
}
