package com.cointcompany.backend.domain.users.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
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
@SQLDelete(sql = "UPDATE UserUsergroup SET del = true WHERE id_num = ?")
public class UserUsergroup extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private boolean del = Boolean.FALSE;

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
                .del(false)
                .build();
    }
    @Builder
    public UserUsergroup(Users users, Usergroups usergroups, Boolean del) {
        this.users = users;
        this.usergroups = usergroups;
        this.del = del;
    }
}
