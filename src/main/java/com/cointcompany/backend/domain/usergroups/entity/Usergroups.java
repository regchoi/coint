package com.cointcompany.backend.domain.usergroups.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.users.entity.UserUsergroup;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE Usergroups SET del = true WHERE id = ?")
public class Usergroups extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String usergroupName;

    @Lob
    private String description;

    private boolean del = Boolean.FALSE;

    @OneToMany(mappedBy = "usergroups", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<UserUsergroup> userUsergroups = new ArrayList<>();

    public static Usergroups of(String usergroupName, String description) {
        return Usergroups.builder()
                .usergroupName(usergroupName)
                .description(description)
                .del(false)
                .build();
    }

    @Builder
    public Usergroups(String usergroupName, String description, Boolean del) {
        this.usergroupName = usergroupName;
        this.description = description;
        this.del = del;
    }

}
