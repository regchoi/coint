package com.cointcompany.backend.domain.tasks.repository;

import com.cointcompany.backend.domain.tasks.entity.TaskDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskDepartmentRepository extends JpaRepository<TaskDepartment, Long> {
}
