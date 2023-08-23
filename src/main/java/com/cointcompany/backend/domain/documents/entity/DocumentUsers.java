package com.cointcompany.backend.domain.documents.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
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
@SQLDelete(sql = "UPDATE DocumentsUsers SET del = true WHERE id_num = ?")
public class DocumentUsers extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private boolean star = Boolean.FALSE;

    private boolean del = Boolean.FALSE;

    @Column(name = "level", nullable = false)
    private int level;


    @ManyToOne
    @JoinColumn(name = "usersIdNum")
    private Users users;

    @ManyToOne
    @JoinColumn(name = "documentsIdNum")
    private Documents documents;

    public Long getDocumentsIdNum() {
        return (documents != null) ? documents.getIdNum() : null;
    }

    public static DocumentUsers of(Users users, Documents documents) {
        return DocumentUsers.builder()
                .star(false)
                .del(false)
                .users(users)
                .documents(documents)
                .build();
    }
    @Builder
    public DocumentUsers(
            Boolean star, Boolean del,
            Users users, Documents documents
            ) {
        this.star = star;
        this.del = del;
        this.users = users;
        this.documents = documents;
        this.level = 1;
    }
}
