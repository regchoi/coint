package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectRoles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRolesRepository extends JpaRepository<ProjectRoles, Long> {

    List<ProjectRoles> findProjectRolesByProject_IdNum(Long projectIdNum);

    Optional<ProjectRoles> findByRoleLevelAndProjectIdNum(Integer roleLevel, Long projectIdNum);
}
