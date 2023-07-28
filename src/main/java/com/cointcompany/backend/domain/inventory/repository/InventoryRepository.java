package com.cointcompany.backend.domain.inventory.repository;

import com.cointcompany.backend.domain.inventory.entity.Inventory;
import com.cointcompany.backend.domain.inventory.entity.InventoryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, InventoryId> {
}