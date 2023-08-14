package com.cointcompany.backend.domain.usergroups.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UsergroupsLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String usergroupName;

    @Lob
    private String description;


    public static UsergroupsLog of(String usergroupName, String description) {
        return UsergroupsLog.builder()
                .usergroupName(usergroupName)
                .description(description)
                .build();
    }

    @Builder
    public UsergroupsLog(String usergroupName, String description) {
        this.usergroupName = usergroupName;
        this.description = description;
    }

}
