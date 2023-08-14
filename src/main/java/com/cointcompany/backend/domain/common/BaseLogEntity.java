package com.cointcompany.backend.domain.common;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
public abstract class BaseLogEntity {

    @CreatedDate
    private LocalDateTime modDate;

    @CreatedBy
    private Long modUserid;

//    @CreatedBy
//    @Type
//    private Map<String, String> history = new HashMap<>();
}
