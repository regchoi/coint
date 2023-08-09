package com.cointcompany.backend.domain.departments.repository;


import com.cointcompany.backend.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByLoginId (String loginId);
}
