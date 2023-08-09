package com.cointcompany.backend.domain.users.dto;

import com.cointcompany.backend.domain.users.entity.Users;
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
        private Long idNum;

        private String loginId;

        private String name;

        private String position;

        private String phone;

        private String email;

        private String regDate;

        private String regUserName;

        public GetUsersRes (Users users) {

            this.idNum = users.getIdNum();
            this.loginId = users.getLoginId();
            this.name = users.getName();
            this.position = users.getPosition();
            this.phone = users.getPhone();
            this.email = users.getEmail();
            this.regDate = users.getRegDate().toString();
            this.regUserName = null;

        }
    }

}
