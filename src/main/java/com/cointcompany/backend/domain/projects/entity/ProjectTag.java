package com.cointcompany.backend.domain.projects.entity;

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
@SQLDelete(sql = "UPDATE project_tag SET del = true WHERE id_num = ?")
public class ProjectTag extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId")
    private Projects project;

    private String tagName;

    private boolean del = Boolean.FALSE;

    public static ProjectTag of(Projects project, String tagName) {
        return ProjectTag.builder()
                .project(project)
                .tagName(tagName)
                .del(false)
                .build();
    }

    @Builder
    public ProjectTag(Projects project, String tagName, Boolean del) {
        this.project = project;
        this.tagName = tagName;
        this.del = del;
    }
}
