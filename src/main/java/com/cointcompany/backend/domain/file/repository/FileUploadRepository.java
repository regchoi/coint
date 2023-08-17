package com.cointcompany.backend.domain.file.repository;

import com.cointcompany.backend.domain.file.entity.FileUploads;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileUploadRepository extends JpaRepository<FileUploads, Long> {
}
