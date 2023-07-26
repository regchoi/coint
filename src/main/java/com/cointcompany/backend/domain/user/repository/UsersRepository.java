package com.cointcompany.backend.domain.user.repository;

import com.cointcompany.backend.domain.user.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
