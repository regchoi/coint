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
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE ProjectUser SET del = true WHERE id_num = ?")
public class ProjectUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectRoleId")
    private ProjectRoles projectRole;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectsIdNum")
    private Projects projects;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static ProjectUser of(ProjectRoles projectRole, Projects projects, Users users) {
        return ProjectUser.builder()
                .projectRole(projectRole)
                .projects(projects)
                .users(users)
                .del(false)
                .build();
    }
    @Builder
    public ProjectUser(ProjectRoles projectRole, Projects projects, Users users, Boolean del) {
        this.projectRole = projectRole;
        this.projects = projects;
        this.users = users;
        this.del = del;
    }

}
