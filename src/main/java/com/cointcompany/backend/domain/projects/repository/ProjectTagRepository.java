package com.cointcompany.backend.domain.projects.repository;

import com.cointcompany.backend.domain.projects.entity.ProjectTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {
    List<ProjectTag> findProjectTagByProject_IdNum(Long projectIdNum);

    // 전달받은 태그배열을 통해 해당 태그를 모두 포함하는 projectIdNum들을 반환
    // Service 코드에서 projectTagRepository.findProjectIdsByTags(tags, (long) tags.size()); 로 사용
    @Query(value = "SELECT project_id FROM project_tag WHERE tag_name IN :tags GROUP BY project_id HAVING COUNT(*) = :tagSize", nativeQuery = true)
    List<Long> findProjectIdsByTags(@Param("tags") List<String> tags, @Param("tagSize") Long tagSize);
}
