package com.cointcompany.backend.domain.projects.dto;

import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class ProjectsDto {

    @NoArgsConstructor
    @Data
    public static class ProjectDepartmentDto {
        private Long projectId;
        private Long departmentId;
        private String role;

        public ProjectDepartmentDto (Long projectId, Long departmentId, String role) {
            this.projectId = projectId;
            this.departmentId = departmentId;
            this.role = role;
        }
    }

    @NoArgsConstructor
    @Data
    public static class ProjectUserDto {
        private Long projectId;
        private Long userId;
        private Integer projectRoleId;

        public ProjectUserDto(Long projectId, Long userId, Integer projectRoleId) {
            this.projectId = projectId;
            this.userId = userId;
            this.projectRoleId = projectRoleId;
        }
    }

    @NoArgsConstructor
    @Data
    public static class ProjectRolesDto {
        private Long projectId;
        private String roleName;
        private Integer roleLevel;
        private String description;

        public ProjectRolesDto (Long projectId, String roleName, Integer roleLevel, String description) {
            this.projectId = projectId;
            this.roleName = roleName;
            this.roleLevel = roleLevel;
            this.description = description;
        }
    }

    @NoArgsConstructor
    @Data
    public static class ProjectTagDto {
        private Long projectId;
        private String tagName;

        public ProjectTagDto (Long projectId, String tagName) {
            this.projectId = projectId;
            this.tagName = tagName;
        }
    }

    @NoArgsConstructor
    @Data
    public static class GetProjectRes {
        private Long idNum;
        private String projectName;
        private String description;
        private String startDate;
        private String endDate;
        private String status;
        private String regDate;
        private String regUserid;

        public GetProjectRes (Projects projects) {

            this.idNum = projects.getIdNum();
            this.projectName = projects.getProjectName();
            this.description = projects.getDescription();
            this.startDate = String.valueOf(projects.getStartDate());
            this.endDate = String.valueOf(projects.getEndDate());
            this.status = projects.getStatus();
            this.regDate = String.valueOf(projects.getRegDate());
            this.regUserid = String.valueOf(projects.getRegUserid());

        }
    }

    @NoArgsConstructor
    @Data
    public static class ProjectTaskDto {
        private String projectName;

        public ProjectTaskDto (Projects projects) {
            this.projectName = projects.getProjectName();
        }
    }

}
