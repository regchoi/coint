package com.cointcompany.backend.domain.templatetasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.templates.entity.TemplateRoles;
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
@SQLDelete(sql = "UPDATE template_task_user SET del = true WHERE id_num = ?")
public class TemplateTaskUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateRoleId")
    private TemplateRoles templateRoles;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateTaskIdNum")
    private TemplateTasks templateTasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static TemplateTaskUser of(TemplateRoles templateRoles, TemplateTasks templateTasks, Users users) {
        return TemplateTaskUser.builder()
                .templateRoles(templateRoles)
                .templateTasks(templateTasks)
                .users(users)
                .del(false)
                .build();
    }

    @Builder
    public TemplateTaskUser(TemplateRoles templateRoles, Boolean del, TemplateTasks templateTasks, Users users) {
        this.templateRoles = templateRoles;
        this.del = del;
        this.templateTasks = templateTasks;
        this.users = users;
    }
}