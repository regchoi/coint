package com.cointcompany.backend.domain.templatetasks.repository;

import com.cointcompany.backend.domain.templatetasks.entity.TemplateTasks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemplateTasksRepository extends JpaRepository<TemplateTasks, Long> {
    List<TemplateTasks> findAllByTemplates_IdNum(Long templateId);
    // 카운트 메서드 추가
    Long countByTemplates_IdNum(Long templateId);


}
