package com.cointcompany.backend.domain.tasks.repository;

import com.cointcompany.backend.domain.tasks.entity.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskTagRepository extends JpaRepository<TaskTag, Long> {
    List<TaskTag> findTaskTagByTask_IdNum(Long taskId);

    // 전달받은 태그배열을 통해 해당 태그를 모두 포함하는 taskIdNum 반환
    // Service 코드에서 taskTagRepository.findTaskIdsByTags(tags, (long) tags.size()); 로 사용
    @Query(value = "SELECT task_id FROM task_tag WHERE tag_name IN :tags GROUP BY task_id HAVING COUNT(*) = :tagSize", nativeQuery = true)
    List<Long> findTaskIdsByTags(@Param("tags") List<String> tags, @Param("tagSize") Long tagSize);

}
