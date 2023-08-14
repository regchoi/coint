package com.cointcompany.backend.domain.departments.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.projects.entity.ProjectDepartment;
import com.cointcompany.backend.domain.users.entity.UserDepartment;
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
@SQLDelete(sql = "UPDATE Departments SET del = true WHERE id_num = ?")
public class Departments extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String departmentName;

    @Lob
    private String description;

    private boolean del = Boolean.FALSE;

    @OneToMany(mappedBy = "departments", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<UserDepartment> userDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "departments", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<ProjectDepartment> projectsDepartments = new ArrayList<>();

    public static Departments of(String departmentName, String description) {
        return Departments.builder()
                .departmentName(departmentName)
                .description(description)
                .del(false)
                .build();
    }

    @Builder
    public Departments(String departmentName, String description, Boolean del) {
        this.departmentName = departmentName;
        this.description = description;
        this.del = del;
    }

}
