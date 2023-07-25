package com.cointcompany.backend.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.antlr.v4.runtime.atn.PredicateEvalInfo;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Data
@Entity
@Where(clause = "delyn = false")
@SQLDelete(sql = "UPDATE Users SET delyn = true WHERE id = ?")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id_num;

    private String state;

    private Long seq;

    private String id;

    private String userName;

    private String userPosition;

    private String userDepartment;

    private Boolean isAdmin;

    private String email;

    private String phone;

    private String regDate;

    private String lastLoginDate;

    private String modDate;

    private boolean delyn = Boolean.FALSE;

}
