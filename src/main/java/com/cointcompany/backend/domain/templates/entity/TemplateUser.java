package com.cointcompany.backend.domain.templates.entity;

import com.cointcompany.backend.domain.users.entity.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE template_user SET del = true WHERE id_num = ?")
public class TemplateUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateRoleId")
    private TemplateRoles templateRoles;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templatesIdNum")
    private Templates templates;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static TemplateUser of(TemplateRoles templateRoles, Templates templates, Users users) {
        return TemplateUser.builder()
                .templateRoles(templateRoles)
                .templates(templates)
                .users(users)
                .del(false)
                .build();
    }

    @Builder
    public TemplateUser(TemplateRoles templateRoles, Templates templates, Users users, Boolean del) {
        this.templateRoles = templateRoles;
        this.templates = templates;
        this.users = users;
        this.del = del;
    }
}
