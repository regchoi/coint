package com.cointcompany.backend.domain.tasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.projects.entity.Projects;
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
@SQLDelete(sql = "UPDATE TaskUser SET del = true WHERE id_num = ?")
public class TaskUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    // project에 정의된 Role을 사용
    // 외래키를 사용하지 않고, Integer로 명시적으로 사용 -> 프론트엔드에서 자체적으로 가공해 정보 사용
    private Integer taskRole;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tasksIdNum")
    private Tasks tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userIdNum")
    private Users users;

    public static TaskUser of(Integer taskRole, Tasks tasks, Users users) {
        return TaskUser.builder()
                .taskRole(taskRole)
                .del(false)
                .tasks(tasks)
                .users(users)
                .build();
    }
    @Builder
    public TaskUser(Integer taskRole, Boolean del, Tasks tasks, Users users) {
        this.taskRole = taskRole;
        this.del = del;
        this.tasks = tasks;
        this.users = users;
    }

}
