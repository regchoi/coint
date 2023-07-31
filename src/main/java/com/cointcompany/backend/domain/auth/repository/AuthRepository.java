package com.cointcompany.backend.domain.auth.repository;

import com.cointcompany.backend.domain.auth.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<Auth, Long> {
    Auth findByUserId(String id);

    Auth findByPassword(String password);
}