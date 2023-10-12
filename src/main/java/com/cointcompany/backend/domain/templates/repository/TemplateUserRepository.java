package com.cointcompany.backend.domain.templates.repository;

import com.cointcompany.backend.domain.templates.entity.TemplateUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TemplateUserRepository extends JpaRepository<TemplateUser, Long> {

    List<TemplateUser> findByTemplatesIdNum(Long templateIdNum);

    Optional<TemplateUser> findByTemplatesIdNumAndUsersIdNum(Long templateIdNum, Long userIdNum);

}
