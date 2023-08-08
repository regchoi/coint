package com.cointcompany.backend.domain.users.entity;

import com.cointcompany.backend.common.config.security.jwt.dto.AuthDto;
import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
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
@SQLDelete(sql = "UPDATE Users SET del = true WHERE id = ?")
public class Users extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String loginId;

    private String loginPw;

    private String name;

    private String position;

    private String phone;

    private String email;

    private boolean del = Boolean.FALSE;

    @OneToMany(mappedBy = "users", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<UserUsergroup> userUsergroups = new ArrayList<>();

    @OneToMany(mappedBy = "users", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<UserDepartment> userDepartments = new ArrayList<>();

    public static Users of(
            String loginId, String loginPw, String name,
            String position, String phone, String email
    ) {
        return Users.builder()
                .loginId(loginId)
                .loginPw(loginPw)
                .name(name)
                .position(position)
                .phone(phone)
                .email(email)
                .del(false)
                .build();
    }

    @Builder
    public Users(
            String loginId, String loginPw, String name,
            String position, String phone, String email, Boolean del
    ) {
        this.loginId = loginId;
        this.loginPw = loginPw;
        this.name = name;
        this.position = position;
        this.phone = phone;
        this.email = email;
        this.del = del;
    }

    public static Users registerUser(AuthDto.SignupDto signupDto) {
        Users users = new Users();

        users.loginId = signupDto.getLoginId();
        users.loginPw = signupDto.getLoginPw();

        return users;

    }
}
