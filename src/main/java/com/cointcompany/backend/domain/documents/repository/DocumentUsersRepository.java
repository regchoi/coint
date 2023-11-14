package com.cointcompany.backend.domain.documents.repository;

import com.cointcompany.backend.domain.documents.entity.DocumentUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentUsersRepository extends JpaRepository<DocumentUsers, Long> {
    List<DocumentUsers> findAllByUsersIdNum(Long userId);
}
