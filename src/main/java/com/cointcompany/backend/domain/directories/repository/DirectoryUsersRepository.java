package com.cointcompany.backend.domain.directories.repository;

import com.cointcompany.backend.domain.directories.entity.DirectoryUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirectoryUsersRepository extends JpaRepository<DirectoryUsers, Long> {

    List<DirectoryUsers> findByUsers_IdNum(Long usersIdNum);
}
