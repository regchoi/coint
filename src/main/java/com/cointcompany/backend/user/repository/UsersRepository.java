package com.cointcompany.backend.user.repository;

import com.cointcompany.backend.user.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
