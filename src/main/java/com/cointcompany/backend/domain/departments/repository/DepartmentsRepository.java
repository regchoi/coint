package com.cointcompany.backend.domain.departments.repository;


import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentsRepository extends JpaRepository<Departments, Long> {
    Optional<Departments> findByDepartmentName (String departmentName);
}
