package com.cointcompany.backend.domain.jwt.repository;


import com.cointcompany.backend.domain.jwt.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
