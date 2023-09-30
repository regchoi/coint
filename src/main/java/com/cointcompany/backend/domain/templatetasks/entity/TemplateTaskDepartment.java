package com.cointcompany.backend.domain.templatetasks.entity;

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
@SQLDelete(sql = "UPDATE TemplateTaskDepartment SET del = true WHERE id_num = ?")
public class TemplateTaskDepartment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateTaskIdNum")
    private TemplateTasks templateTasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    public static TemplateTaskDepartment of(
            String role, TemplateTasks templateTasks, Departments departments
    ) {
        return TemplateTaskDepartment.builder()
                .role(role)
                .templateTasks(templateTasks)
                .departments(departments)
                .del(false)
                .build();
    }

    @Builder
    public TemplateTaskDepartment(
            String role, TemplateTasks templateTasks, Departments departments, Boolean del
    ) {
        this.role = role;
        this.templateTasks = templateTasks;
        this.departments = departments;
        this.del = del;
    }
}
