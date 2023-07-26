package com.cointcompany.backend.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

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

    private LocalDateTime regDate;

    private LocalDateTime lastLoginDate;

    private LocalDateTime modDate;

    private boolean delyn = Boolean.FALSE;

    public static Users of (
            String state, Long seq, String id, String userName, String userPosition,
            String userDepartment, Boolean isAdmin, String email, String phone
    ) {
        return Users.builder()
                .state(state)
                .seq(seq)
                .id(id)
                .userName(userName)
                .userPosition(userPosition)
                .userDepartment(userDepartment)
                .isAdmin(isAdmin)
                .email(email)
                .phone(phone)
                .build();
    }

    @Builder
    public Users(
            String state, Long seq, String id, String userName, String userPosition,
            String userDepartment, Boolean isAdmin, String email, String phone
    ) {
        this.state = state;
        this.seq = seq;
        this.id = id;
        this.userName = userName;
        this.userPosition = userPosition;
        this.userDepartment = userDepartment;
        this.isAdmin = isAdmin;
        this.email = email;
        this.phone = phone;
    }

}
