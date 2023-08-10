package com.cointcompany.backend.domain.users.repository;


import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.users.entity.UserDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDepartmentRepository extends JpaRepository<UserDepartment, Long> {
    List<UserDepartment> findByDepartments_IdNum (Long departmentsId);
    List<UserDepartment> findByUsers_IdNum (Long userId);

}
