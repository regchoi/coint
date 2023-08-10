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

        private String usergroupName;

        private String description;

        private String regDate;

        private String regUserId;

        private String modDate;

        private String modUserId;

        public GetUserGroupsRes (
                Long idNum, String usergroupName, String description,
                String regDate, String regUserId, String modDate, String modUserId
                ) {

            this.idNum = idNum;
            this.usergroupName = usergroupName;
            this.description = description;
            this.regDate = regDate;
            this.regUserId = regUserId;
            this.modDate = modDate;
            this.modUserId = modUserId;

        }
    }

    @NoArgsConstructor
    @Data
    public static class GetUserUserGroupsRes {
        private Long idNum;

        private String usergroupName;

        public GetUserUserGroupsRes(Long idNum, String usergroupName) {
            this.idNum = idNum;
            this.usergroupName = usergroupName;
        }
    }

}
