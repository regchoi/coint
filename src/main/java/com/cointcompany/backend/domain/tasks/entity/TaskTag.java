package com.cointcompany.backend.domain.tasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
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
@SQLDelete(sql = "UPDATE TaskTag SET del = true WHERE id_num = ?")
public class TaskTag extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taskId")
    private Tasks task;

    private String tagName;

    private boolean del = Boolean.FALSE;

    public static TaskTag of(Tasks task, String tagName) {
        return TaskTag.builder()
                .task(task)
                .tagName(tagName)
                .del(false)
                .build();
    }

    @Builder
    public TaskTag(Tasks task, String tagName, Boolean del) {
        this.task = task;
        this.tagName = tagName;
        this.del = del;
    }

}
