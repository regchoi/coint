package com.cointcompany.backend.domain.departments.entity;

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
@SQLDelete(sql = "UPDATE Post SET del = true WHERE id = ?")
public class Departments extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String departmentName;

    @Lob
    private String description;

    private boolean del = Boolean.FALSE;

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
