package com.cointcompany.backend.domain.usergroups.repository;


import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserGroupsRepository extends JpaRepository<Usergroups, Long> {
    Optional<Usergroups> findByUsergroupName (String userGroupName);
}
