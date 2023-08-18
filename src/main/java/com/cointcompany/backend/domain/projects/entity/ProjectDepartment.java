package com.cointcompany.backend.domain.projects.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.departments.entity.Departments;
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
@SQLDelete(sql = "UPDATE ProjectDepartment SET del = true WHERE id_num = ?")
public class ProjectDepartment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectsIdNum")
    private Projects projects;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    public static ProjectDepartment of(
            String role, Projects projects, Departments departments
    ) {
        return ProjectDepartment.builder()
                .role(role)
                .projects(projects)
                .departments(departments)
                .del(false)
                .build();
    }

    @Builder
    public ProjectDepartment(
            String role, Projects projects, Departments departments, Boolean del
    ) {
        this.role = role;
        this.projects = projects;
        this.departments = departments;
        this.del = del;
    }
}
