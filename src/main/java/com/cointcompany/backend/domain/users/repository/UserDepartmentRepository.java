package com.cointcompany.backend.domain.users.repository;


import com.cointcompany.backend.domain.users.entity.UserDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDepartmentRepository extends JpaRepository<UserDepartment, Long> {
    List<UserDepartment> findByDepartments_IdNum (Long departmentsId);
    List<UserDepartment> findByUsers_IdNum (Long userId);

    UserDepartment findByDepartments_IdNumAndUsers_IdNum(Long departmentsId, Long userId);

}
