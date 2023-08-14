package com.cointcompany.backend.domain.tasks.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.projects.entity.ProjectDepartment;
import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.projects.entity.Projects;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE Tasks SET del = true WHERE id_num = ?")
public class Tasks extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String taskName;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;

    private boolean del = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectsIdNum")
    private Projects projects;

    @OneToMany(mappedBy = "tasks", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TaskDepartment> taskDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "tasks", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TaskUser> taskUsers = new ArrayList<>();

    public static Tasks of (
            String taskName, String description, LocalDate startDate,
            LocalDate endDate, String status, Projects projects
    ) {
        return Tasks.builder()
                .taskName(taskName)
                .description(description)
                .startDate(startDate)
                .endDate(endDate)
                .status(status)
                .del(false)
                .projects(projects)
                .build();
    }

    @Builder
    public Tasks(
            String taskName, String description, LocalDate startDate,
            LocalDate endDate, String status, Boolean del, Projects projects
    ) {
        this.taskName = taskName;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.del = del;
        this.projects = projects;
    }


}
