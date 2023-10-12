package com.cointcompany.backend.domain.templates.entity;

import com.cointcompany.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "del = false")
@SQLDelete(sql = "UPDATE template_tag SET del = true WHERE id_num = ?")
public class TemplateTag extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "templateIdNum")
    private Templates templates;

    private String tagName;

    private boolean del = Boolean.FALSE;

    public static TemplateTag of(Templates templates, String tagName) {
        return TemplateTag.builder()
                .templates(templates)
                .tagName(tagName)
                .del(false)
                .build();
    }

    @Builder
    public TemplateTag(Templates templates, String tagName, Boolean del) {
        this.templates = templates;
        this.tagName = tagName;
        this.del = del;
    }
}
