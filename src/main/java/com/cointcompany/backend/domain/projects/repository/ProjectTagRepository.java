package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {

    List<ProjectTag> findProjectTagByProject_IdNum(Long projectIdNum);
}
