package com.cointcompany.backend.domain.inventory.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.scheduling.support.SimpleTriggerContext;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inventory {

    @EmbeddedId
    private InventoryId inventoryId;

    private Long cd_factory;
    private String cd_warehouse;
    private String cd_rack;
    private String locationcode;
    private String locationcode_name;
    private Long gitemno;
    private String gitemno_name;
    private String unit;
    private Long stockqty;
    @Column(insertable = false, updatable = false)
    private LocalDateTime ipgodate;
    private String inspectcodenameafter;
    private String groupsetion;
    private LocalDateTime yyyymmdd;






}
