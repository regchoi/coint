package com.cointcompany.backend.domain.templates.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.tasks.entity.Tasks;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE Templates SET del = true WHERE id_num = ?")
public class Templates extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String templateName;

    private String description;

    private Integer period;

    private boolean del = Boolean.FALSE;

//    @OneToMany(mappedBy = "templates", orphanRemoval = true, cascade = CascadeType.ALL)
//    private List<Tasks> tasksList = new ArrayList<>();

    @OneToMany(mappedBy = "templates", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TemplateDepartment> templateDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "templates", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TemplateUser> templateUsers = new ArrayList<>();

    public static Templates of (
            String templateName, String description, Integer period
    ) {
        return Templates.builder()
                .templateName(templateName)
                .description(description)
                .period(period)
                .del(false)
                .build();
    }

    @Builder
    public Templates (
            String templateName, String description, Integer period,
            Boolean del
    ) {
        this.templateName = templateName;
        this.description = description;
        this.period = period;
        this.del = del;
    }

}
