package com.cointcompany.backend.domain.users.entity;

import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserUsergroup {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usersIdNum")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usergroupsIdNum")
    private Usergroups usergroups;

    public static UserUsergroup of(Users users, Usergroups usergroups) {
        return UserUsergroup.builder()
                .users(users)
                .usergroups(usergroups)
                .build();
    }
    @Builder
    public UserUsergroup(Users users, Usergroups usergroups) {
        this.users = users;
        this.usergroups = usergroups;
    }
}
