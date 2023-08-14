package com.cointcompany.backend.domain.users.repository;


import com.cointcompany.backend.domain.users.entity.UserUsergroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserUsergroupRepository extends JpaRepository<UserUsergroup, Long> {
    List<UserUsergroup> findByUsergroups_IdNum (Long usergroupId);
    List<UserUsergroup> findByUsers_IdNum (Long userId);

}
