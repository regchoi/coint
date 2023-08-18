package com.cointcompany.backend.domain.directories.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.documents.entity.Documents;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE Directories SET del = true WHERE id_num = ?")
public class Directories extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String dirName;

    private Boolean del;

    @ManyToOne
    @JoinColumn(name = "parentIdNum")
    private Directories parentDirectories;

    @OneToMany(mappedBy = "parentDirectories", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Directories> subDirectories;

    @OneToMany(mappedBy = "directories", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Documents> documents;

    public static Directories of (
            String dirName, Directories directories
    ) {
        return Directories.builder()
                .dirName(dirName)
                .directories(directories)
                .del(false)
                .build();
    }
    @Builder
    public Directories(String dirName, Directories directories, Boolean del) {
        this.dirName = dirName;
        this.parentDirectories = directories;
        this.del = del;
    }
}
