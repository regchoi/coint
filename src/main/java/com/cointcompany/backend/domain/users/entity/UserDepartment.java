package com.cointcompany.backend.domain.users.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.departments.entity.Departments;
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
@SQLDelete(sql = "UPDATE UserDepartment SET del = true WHERE id_num = ?")
public class UserDepartment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usersIdNum")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    private boolean del = Boolean.FALSE;

    public static UserDepartment of(Users users, Departments departments) {
        return UserDepartment.builder()
                .users(users)
                .departments(departments)
                .del(false)
                .build();
    }
    @Builder
    public UserDepartment(Users users, Departments departments, Boolean del) {
        this.users = users;
        this.departments = departments;
        this.del = del;
    }
}
