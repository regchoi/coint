package com.cointcompany.backend.domain.users.dto;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.users.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class UsersDto {

    @NoArgsConstructor
    @Data
    public static class GetUsers {
        private Long idNum;

        private String loginId;

        private String name;

        private String position;

        private String phone;

        private String email;

        private String regDate;

        private String regUserid;

        private List<DepartmentsDto.GetUserDepartmentRes> getUserDepartmentResList;

        private List<UserGroupsDto.GetUserUserGroupsRes> getUserUserGroupsResList;

        public GetUsers (Users users, List<DepartmentsDto.GetUserDepartmentRes> getUserDepartmentResList,
                            List<UserGroupsDto.GetUserUserGroupsRes> getUserUserGroupsResList) {

            this.idNum = users.getIdNum();
            this.loginId = users.getLoginId();
            this.name = users.getName();
            this.position = users.getPosition();
            this.phone = users.getPhone();
            this.email = users.getEmail();
            this.regDate = users.getRegDate().toString();
            this.regUserid = null;
            this.getUserDepartmentResList = getUserDepartmentResList;
            this.getUserUserGroupsResList = getUserUserGroupsResList;
        }
    }
    @NoArgsConstructor
    @Data
    public static class GetUsersReq {
        private Long idNum;

        private String name;

        private String position;

        private String phone;

        private String email;


        public GetUsersReq (Users users) {

            this.idNum = users.getIdNum();
            this.name = users.getName();
            this.position = users.getPosition();
            this.phone = users.getPhone();
            this.email = users.getEmail();
        }
    }

    @NoArgsConstructor
    @Data
    public static class SaveUsers {

        private String loginId;

        private String name;

        private String position;

        private String phone;

        private String email;

        public SaveUsers (Users users) {

            this.loginId = users.getLoginId();
            this.name = users.getName();
            this.position = users.getPosition();
            this.phone = users.getPhone();
            this.email = users.getEmail();

        }
    }
    @NoArgsConstructor
    @Data
    public static class ModifyUsers {

        private Long idNum;

        private String loginId;

        private String name;

        private String position;

        private String phone;

        private String email;

        public ModifyUsers (Users users) {

            this.idNum = users.getIdNum();
            this.loginId = users.getLoginId();
            this.name = users.getName();
            this.position = users.getPosition();
            this.phone = users.getPhone();
            this.email = users.getEmail();

        }
    }
    
    @NoArgsConstructor
    @Data
    public static class GetUserUsergroup {

        private Long idNum;

        private GetUsersReq users;

        public GetUserUsergroup(Long userUserGroupId, GetUsersReq users) {

            this.idNum = userUserGroupId;
            this.users = users;
        }
    }


}
