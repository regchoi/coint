package com.cointcompany.backend.domain.templates.repository;

import com.cointcompany.backend.domain.templates.entity.TemplateUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateUserRepository extends JpaRepository<TemplateUser, Long> {
}
