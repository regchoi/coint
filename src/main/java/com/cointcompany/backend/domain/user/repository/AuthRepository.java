package com.cointcompany.backend.domain.user.repository;

import com.cointcompany.backend.domain.user.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<Auth, Long> {
    Auth findByUserId(String id);

    Auth findByPassword(String password);
}