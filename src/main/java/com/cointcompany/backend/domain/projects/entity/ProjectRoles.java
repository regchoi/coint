package com.cointcompany.backend.domain.projects.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE ProjectRoles SET del = true WHERE id_num = ?")
public class ProjectRoles extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId")
    private Projects project;

    private String roleName;

    private Integer roleLevel;

    private String description;

    private boolean del = Boolean.FALSE;

    public static ProjectRoles of(Projects project, String roleName, Integer roleLevel, String description) {
        return ProjectRoles.builder()
                .project(project)
                .roleName(roleName)
                .roleLevel(roleLevel)
                .description(description)
                .del(false)
                .build();
    }

    @Builder
    public ProjectRoles(Projects project, String roleName, Integer roleLevel, String description, Boolean del) {
        this.project = project;
        this.roleName = roleName;
        this.roleLevel = roleLevel;
        this.description = description;
        this.del = del;
    }
}
