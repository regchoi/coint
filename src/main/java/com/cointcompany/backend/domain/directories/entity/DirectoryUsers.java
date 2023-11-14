package com.cointcompany.backend.domain.directories.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.documents.entity.Documents;
import com.cointcompany.backend.domain.users.entity.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE DirectoryUsers SET del = true WHERE id_num = ?")
public class DirectoryUsers extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private boolean del = Boolean.FALSE;

    @Column(name = "level", nullable = false)
    private int level;

    @ManyToOne
    @JoinColumn(name = "usersIdNum")
    private Users users;

    @ManyToOne
    @JoinColumn(name = "directoriesIdNum")
    private Directories directories;

    public Long getDirectoriesIdNum() {
        return (directories != null) ? directories.getIdNum() : null;
    }

    public static DirectoryUsers of(Users users, Directories directories) {
        return DirectoryUsers.builder()
                .del(false)
                .users(users)
                .directories(directories)
                .build();
    }

    @Builder
    public DirectoryUsers(
            Boolean del, Users users, Directories directories
            ) {
        this.del = del;
        this.users = users;
        this.directories = directories;
        this.level = 1; // TODO: 권한 레벨 설정
    }
}
