package com.cointcompany.backend.domain.file.repository;

import com.cointcompany.backend.domain.file.entity.Files;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilesRepository extends JpaRepository<Files, Long> {
}
