package com.cointcompany.backend.domain.templatetasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.templates.entity.TemplateDepartment;
import com.cointcompany.backend.domain.templates.entity.TemplateUser;
import com.cointcompany.backend.domain.templates.entity.Templates;
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
@SQLDelete(sql = "UPDATE TemplateTasks SET del = true WHERE id_num = ?")
public class TemplateTasks extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String taskName;

    private String description;

    private Integer period;

    private Integer offsetDay;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateIdNum")
    private Templates templates;

    @OneToMany(mappedBy = "templatetasks", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TemplateDepartment> taskDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "templatetasks", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TemplateUser> taskUsers = new ArrayList<>();

    public static TemplateTasks of (
            String taskName, String description, Integer period, Integer offsetDay, Templates templates
    ) {
        return TemplateTasks.builder()
                .taskName(taskName)
                .description(description)
                .period(period)
                .offsetDay(offsetDay)
                .templates(templates)
                .del(false)
                .build();
    }

    @Builder
    public TemplateTasks(
            String taskName, String description, Integer period, Integer offsetDay, Templates templates, Boolean del
    ) {
        this.taskName = taskName;
        this.description = description;
        this.period = period;
        this.offsetDay = offsetDay;
        this.templates = templates;
        this.del = del;
    }
}
