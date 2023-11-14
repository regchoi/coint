package com.cointcompany.backend.domain.templates.repository;

import com.cointcompany.backend.domain.templates.entity.TemplateRoles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TemplateRolesRepository extends JpaRepository<TemplateRoles, Long> {

    List<TemplateRoles> findByTemplatesIdNum(Long templatesIdNum);
    Optional<TemplateRoles> findByRoleLevelAndTemplatesIdNum(Integer roleLevel, Long templatesIdNum);

}
