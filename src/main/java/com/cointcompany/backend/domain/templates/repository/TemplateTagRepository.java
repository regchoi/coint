package com.cointcompany.backend.domain.templates.repository;

import com.cointcompany.backend.domain.templates.entity.TemplateTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TemplateTagRepository extends JpaRepository<TemplateTag, Long> {

    // 전달받은 태그배열을 통해 해당 태그를 모두 포함하는 templateIdNum 반환
    @Query(value = "SELECT template_id_num FROM template_tag WHERE tag_name IN :tags GROUP BY template_id_num HAVING COUNT(*) = :tagSize", nativeQuery = true)
    List<Long> findTemplateIdsByTags(@Param("tags") List<String> tags, @Param("tagSize") Long tagSize);

}
