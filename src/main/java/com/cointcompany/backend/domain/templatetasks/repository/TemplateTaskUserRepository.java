package com.cointcompany.backend.domain.templatetasks.repository;

import com.cointcompany.backend.domain.templatetasks.entity.TemplateTaskUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateTaskUserRepository extends JpaRepository<TemplateTaskUser, Long> {
}
