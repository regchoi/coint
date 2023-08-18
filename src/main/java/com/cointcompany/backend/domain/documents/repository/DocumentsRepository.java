package com.cointcompany.backend.domain.documents.repository;

import com.cointcompany.backend.domain.documents.entity.Documents;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentsRepository extends JpaRepository<Documents, Long> {
}
