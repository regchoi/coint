package com.cointcompany.backend.domain.tasks.repository;

import com.cointcompany.backend.domain.tasks.entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TasksRepository extends JpaRepository<Tasks, Long> {

    List<Tasks> findByProjectsIdNum(Long projectId);

    List<Tasks> findByTaskGroup_IdNum(Long taskGroupId);
}
