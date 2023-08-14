package com.cointcompany.backend.domain.projects.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.users.entity.UserDepartment;
import com.cointcompany.backend.domain.users.entity.Users;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectsIdNum")
    private Projects projects;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static ProjectUser of(String role, Projects projects, Users users) {
        return ProjectUser.builder()
                .role(role)
                .projects(projects)
                .users(users)
                .build();
    }
    @Builder
    public ProjectUser(String role, Projects projects, Users users) {
        this.role = role;
        this.projects = projects;
        this.users = users;
    }

}
