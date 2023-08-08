package com.cointcompany.backend.domain.inventory.repository;

import com.cointcompany.backend.domain.inventory.entity.Inventory;
import com.cointcompany.backend.domain.inventory.entity.InventoryId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, InventoryId> {

    List<Inventory> findAllByIpgodateBetween(LocalDateTime start, LocalDateTime end);
}