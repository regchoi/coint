package com.cointcompany.backend.domain.inventory.service;

import com.cointcompany.backend.domain.inventory.entity.Inventory;
import com.cointcompany.backend.domain.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getAllByIpgodateBetween(LocalDateTime start, LocalDateTime end) {
        return inventoryRepository.findAllByIpgodateBetween(start, end);
    }
}