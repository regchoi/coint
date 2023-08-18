package com.cointcompany.backend.domain.directories.repository;

import com.cointcompany.backend.domain.directories.entity.Directories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectoriesRepository extends JpaRepository<Directories, Long> {
}
