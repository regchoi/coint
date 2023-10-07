package com.cointcompany.backend.domain.templates.repository;

import com.cointcompany.backend.domain.templates.entity.Templates;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplatesRepository extends JpaRepository<Templates, Long> {
}
