package com.cointcompany.backend.domain.tasks.repository;

import com.cointcompany.backend.domain.tasks.entity.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskTagRepository extends JpaRepository<TaskTag, Long> {
    List<TaskTag> findTaskTagByTask_IdNum(Long taskId);
}
