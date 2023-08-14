package com.cointcompany.backend.domain.tasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.users.entity.Users;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TaskUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tasksIdNum")
    private Tasks tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static TaskUser of(String role, Tasks tasks, Users users) {
        return TaskUser.builder()
                .role(role)
                .tasks(tasks)
                .users(users)
                .build();
    }
    @Builder
    public TaskUser(String role, Tasks tasks, Users users) {
        this.role = role;
        this.tasks = tasks;
        this.users = users;
    }

}
