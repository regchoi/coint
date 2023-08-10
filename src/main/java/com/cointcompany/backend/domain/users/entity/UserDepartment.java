package com.cointcompany.backend.domain.users.entity;

import com.cointcompany.backend.domain.departments.entity.Departments;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usersIdNum")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentsIdNum")
    private Departments departments;

    public static UserDepartment of(Users users, Departments departments) {
        return UserDepartment.builder()
                .users(users)
                .departments(departments)
                .build();
    }
    @Builder
    public UserDepartment(Users users, Departments departments) {
        this.users = users;
        this.departments = departments;
    }
}
