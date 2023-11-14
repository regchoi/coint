package com.cointcompany.backend.domain.users.repository;


import com.cointcompany.backend.domain.users.dto.UsersDto;
import com.cointcompany.backend.domain.users.entity.UserUsergroup;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserUsergroupRepository extends JpaRepository<UserUsergroup, Long> {

    List<UserUsergroup> findByUsers_IdNum (Long userId);

    @Query("SELECT uu FROM UserUsergroup uu JOIN FETCH uu.users WHERE uu.usergroups.idNum = :usergroupId")
    List<UserUsergroup> findByUsergroupsWithUsers (@Param("usergroupId") Long usergroupId);
}
