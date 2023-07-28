package com.cointcompany.backend.domain.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.time.LocalDateTime;

@Embeddable
public class InventoryId implements Serializable {

    @Column(name = "id_num")
    private Long id_num;

    @Column(name = "ipgodate")
    private LocalDateTime ipgoDate;
}
