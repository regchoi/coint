package com.cointcompany.backend.domain.tasks.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.tasks.entity.TaskUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {
    List<TaskUser> findTaskUserByUsers_IdNum (Long userId);

    Optional<TaskUser> findByUsers_IdNumAndTasks_IdNum(Long userId, Long taskId);
}
