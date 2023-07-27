package com.cointcompany.backend.domain.user.dto;

import com.cointcompany.backend.domain.user.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class UsersDto {

    @NoArgsConstructor
    @Data
    public static class GetUsersRes {
        private Long id_num;

        private String state;

        private Long seq;

        private String id;

        private String userName;

        private String userPosition;

        private String userDepartment;

        private Boolean isAdmin;

        private String email;

        private String phone;

        private LocalDateTime regDate;

        private LocalDateTime lastLoginDate;

        public GetUsersRes (
                Long id_num, String state, Long seq, String id, String userName,
                String userPosition, String userDepartment, Boolean isAdmin,
                String email, String phone, LocalDateTime regDate, LocalDateTime lastLoginDate
                ) {
            this.id_num = id_num;
            this.state = state;
            this.seq = seq;
            this.id = id;
            this.userName = userName;
            this.userPosition = userPosition;
            this.userDepartment = userDepartment;
            this.isAdmin = isAdmin;
            this.email = email;
            this.phone = phone;
            this.regDate = regDate;
            this.lastLoginDate = lastLoginDate;
        }
    }

    @Data
    public static class ModifyUserReq extends Users {
//        @JsonIgnore
//        private Long id_num;
    }
    @Data
    @NoArgsConstructor
    public static class SaveUserReq extends Users {
        @JsonIgnore
        private Long id_num;
    }

}
