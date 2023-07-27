package com.cointcompany.backend.domain.user.repository;

import com.cointcompany.backend.domain.user.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<Auth, Long> {
    Auth findById(String id);

    Auth findByPassword(String password);
}
