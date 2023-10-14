package com.cointcompany.backend.domain.templatetasks.repository;

import com.cointcompany.backend.domain.templatetasks.entity.TemplateTaskUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TemplateTaskUserRepository extends JpaRepository<TemplateTaskUser, Long> {
    List<TemplateTaskUser> findAllByTemplateTasks_IdNum(Long templateTaskId);

    Optional<TemplateTaskUser> findByTemplateTasksIdNumAndUsersIdNum(Long templateTaskId, Long userId);

}
