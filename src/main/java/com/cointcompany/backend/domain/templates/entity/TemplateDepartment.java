package com.cointcompany.backend.domain.templates.entity;


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
@SQLDelete(sql = "UPDATE template_department SET del = true WHERE id_num = ?")
public class TemplateDepartment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateIdNum")
    private Templates templates;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    public static TemplateDepartment of(String role, Templates templates, Departments departments) {
        return TemplateDepartment.builder()
                .role(role)
                .templates(templates)
                .departments(departments)
                .del(false)
                .build();
    }

    @Builder
    public TemplateDepartment(
            String role, Templates templates , Departments departments, Boolean del
    ) {
        this.role = role;
        this.templates = templates;
        this.departments = departments;
        this.del = del;
    }
}

