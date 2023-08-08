//package com.cointcompany.backend.domain.auth.repository;
//
//import com.cointcompany.backend.domain.auth.entity.Auth;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface AuthRepository extends JpaRepository<Auth, Long> {
//    Optional<Auth> findByUserId(String userId);
//}