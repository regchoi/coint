package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.Projects;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectsRepository extends JpaRepository<Projects, Long> {
}
