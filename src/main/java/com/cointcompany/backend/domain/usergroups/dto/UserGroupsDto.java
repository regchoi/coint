package com.cointcompany.backend.domain.usergroups.dto;

import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class UserGroupsDto {

    @NoArgsConstructor
    @Data
    public static class GetUserGroupsRes {
        private Long idNum;

        private String loginId;

        private String name;

        private String position;

        private String phone;

        private String email;

        private String regDate;

        private String regUserName;

        public GetUserGroupsRes (
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
