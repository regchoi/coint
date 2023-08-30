package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectRoles;
import com.cointcompany.backend.domain.projects.entity.Projects;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRolesRepository extends JpaRepository<ProjectRoles, Long> {

    Optional<ProjectRoles> findByRoleNameAndProject(String roleName, Projects project);
}
