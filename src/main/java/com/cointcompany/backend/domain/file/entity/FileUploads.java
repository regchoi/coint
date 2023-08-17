package com.cointcompany.backend.domain.file.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileUploads {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    private String fileName;

    @Lob
    private byte[] fileData;

    public static FileUploads of (
            String fileName, byte[] fileData
    ) {
        return FileUploads.builder()
                .fileName(fileName)
                .fileData(fileData)
                .build();
    }
    @Builder
    public FileUploads(String fileName, byte[] fileData) {
        this.fileName = fileName;
        this.fileData = fileData;
    }
}
