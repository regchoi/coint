package com.cointcompany.backend.domain.usergroups.dto;

import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
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

        private String regUserid;

        private String modDate;

        private String modUserid;

        public GetUserGroupsRes (Usergroups usergroups) {

            this.idNum = usergroups.getIdNum();
            this.usergroupName = usergroups.getUsergroupName();
            this.description = usergroups.getDescription();
            this.regDate = String.valueOf(usergroups.getRegDate());
            this.regUserid = String.valueOf(usergroups.getRegUserid());
            this.modDate = String.valueOf(usergroups.getModDate());
            this.modUserid = String.valueOf(usergroups.getModUserid());

        }
    }

    @NoArgsConstructor
    @Data
    public static class GetUserUserGroupsRes {
        private Long userUsergroupIdNum;

        private Long usergroupIdNum;

        private String usergroupName;

        public GetUserUserGroupsRes(Long userUsergroupIdNum, Usergroups usergroups) {
            this.userUsergroupIdNum = userUsergroupIdNum;
            this.usergroupIdNum = usergroups.getIdNum();
            this.usergroupName = usergroups.getUsergroupName();
        }
    }

}
