package com.cointcompany.backend.domain.documents.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.file.entity.Files;
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
@SQLDelete(sql = "UPDATE Documents SET del = true WHERE id_num = ?")
public class Documents extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String docName;

    private boolean del = Boolean.FALSE;

    @OneToOne
    @JoinColumn(name = "fileIdNum")
    private Files files;

    @ManyToOne
    @JoinColumn(name = "directoriesIdNum")
    private Directories directories;


    @OneToMany(mappedBy = "documents", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<DocumentUsers> documentUsers = new ArrayList<>();

    public static Documents of(
            String docName, Directories directories, Files files
    ) {
        return Documents.builder()
                .docName(docName)
                .directories(directories)
                .files(files)
                .del(false)
                .build();
    }
    @Builder
    public Documents(
            String docName, Directories directories,
            Files files, Boolean del
    ) {
        this.docName = docName;
        this.directories = directories;
        this.files = files;
        this.del = del;
    }


}
