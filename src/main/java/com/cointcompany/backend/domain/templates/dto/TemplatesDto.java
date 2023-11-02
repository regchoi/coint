package com.cointcompany.backend.domain.templates.dto;

import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class TemplatesDto {

    @NoArgsConstructor
    @Data
    public static class TemplateRolesDto {
        private Long templateId;
        private String roleName;
        private Integer roleLevel;
        private String description;

        public TemplateRolesDto (Long templateId, String roleName, Integer roleLevel, String description) {
            this.templateId = templateId;
            this.roleName = roleName;
            this.roleLevel = roleLevel;
            this.description = description;
        }
    }

    @NoArgsConstructor
    @Data
    public static class TemplateUsersDto {
        private Long templateId;
        private Long userId;
        private Integer templateRoleId;

        public TemplateUsersDto(Long templateId, Long userId, Integer templateRoleId) {
            this.templateId = templateId;
            this.userId = userId;
            this.templateRoleId = templateRoleId;
        }

    }

    @NoArgsConstructor
    @Data
    public static class TemplateTagDto {
        private Long templateId;
        private String tagName;

        public TemplateTagDto (Long templateId, String tagName) {
            this.templateId = templateId;
            this.tagName = tagName;
        }
    }

    @NoArgsConstructor
    @Data
    public static class UpdateTemplate {
        private Long idNum;
        private String templateName;
        private String description;
        private Integer period;

        public UpdateTemplate (Long idNum, String templateName, String description, Integer period) {
            this.idNum = idNum;
            this.templateName = templateName;
            this.description = description;
            this.period = period;
        }
    }

    @NoArgsConstructor
    @Data
    public static class GetTemplateRes {
        private Long idNum;
        private String templateName;
        private String description;
        private Integer period;
        private String regDate;
        private String regUserid;

        public GetTemplateRes (Long idNum, String templateName, String description, Integer period, String regDate, String regUserid) {
            this.idNum = idNum;
            this.templateName = templateName;
            this.description = description;
            this.period = period;
            this.regDate = regDate;
            this.regUserid = regUserid;
        }
    }

    @NoArgsConstructor
    @Data
    public static class GetTemplateListRes {
        private Long idNum;
        private String templateName;
        private String description;
        private Integer period;
        private Integer taskNum;
        private Integer workerNum;
        private String regDate;
        private String regUserid;

        public GetTemplateListRes (Long idNum, String templateName, String description, Integer period, Integer taskNum, Integer workerNum, String regDate, String regUserid) {
            this.idNum = idNum;
            this.templateName = templateName;
            this.description = description;
            this.period = period;
            this.taskNum = taskNum;
            this.workerNum = workerNum;
            this.regDate = regDate;
            this.regUserid = regUserid;
        }
    }
}
