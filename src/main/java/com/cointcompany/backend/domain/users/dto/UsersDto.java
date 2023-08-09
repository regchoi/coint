package com.cointcompany.backend.domain.users.dto;

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

        public GetUsersRes (
                Long idNum, String loginId, String name, String position,
                String phone, String email, String regDate, String regUserName
                ) {

            this.idNum = idNum;
            this.loginId = loginId;
            this.name = name;
            this.position = position;
            this.phone = phone;
            this.email = email;
            this.regDate = regDate;
            this.regUserName = regUserName;

        }
    }

}
