package com.cointcompany.backend.domain.file.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import com.cointcompany.backend.domain.documents.entity.Documents;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Files extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String fileName;

    @Lob
    private byte[] fileData;

    @OneToOne(mappedBy = "files")
    private Documents documents;

    public static Files of (
            String fileName, byte[] fileData
    ) {
        return Files.builder()
                .fileName(fileName)
                .fileData(fileData)
                .build();
    }
    @Builder
    public Files(String fileName, byte[] fileData) {
        this.fileName = fileName;
        this.fileData = fileData;
    }
}