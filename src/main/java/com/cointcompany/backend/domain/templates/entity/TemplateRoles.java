package com.cointcompany.backend.domain.templates.entity;

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
@SQLDelete(sql = "UPDATE TemplateRoles SET del = true WHERE id_num = ?")
public class TemplateRoles extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateIdNum")
    private Templates templates;

    private String roleName;

    private Integer roleLevel;

    private String description;

    private boolean del = Boolean.FALSE;

    public static TemplateRoles of(Templates templates, String roleName, Integer roleLevel, String description) {
        return TemplateRoles.builder()
                .templates(templates)
                .roleName(roleName)
                .roleLevel(roleLevel)
                .description(description)
                .del(false)
                .build();
    }

    @Builder
    public TemplateRoles(Templates templates, String roleName, Integer roleLevel, String description, Boolean del) {
        this.templates = templates;
        this.roleName = roleName;
        this.roleLevel = roleLevel;
        this.description = description;
        this.del = del;
    }
}
