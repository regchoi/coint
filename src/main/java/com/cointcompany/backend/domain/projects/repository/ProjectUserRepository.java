package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.projects.entity.Projects;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {
    List<ProjectUser> findProjectUserByUsers_IdNum (Long userId);
}
