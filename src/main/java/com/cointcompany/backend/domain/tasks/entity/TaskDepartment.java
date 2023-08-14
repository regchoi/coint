package com.cointcompany.backend.domain.tasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.projects.entity.Projects;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TaskDepartment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tasksIdNum")
    private Tasks tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    public static TaskDepartment of(
            String role, Tasks tasks, Departments departments
    ) {
        return TaskDepartment.builder()
                .role(role)
                .tasks(tasks)
                .departments(departments)
                .build();
    }

    @Builder
    public TaskDepartment(
            String role, Tasks tasks, Departments departments
    ) {
        this.role = role;
        this.tasks = tasks;
        this.departments = departments;
    }
}
