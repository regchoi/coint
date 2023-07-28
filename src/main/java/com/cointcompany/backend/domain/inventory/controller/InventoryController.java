package com.cointcompany.backend.domain.inventory.controller;

import com.cointcompany.backend.domain.inventory.entity.Inventory;
import com.cointcompany.backend.domain.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chart")
@CrossOrigin
public class InventoryController {

    private final InventoryService inventoryService;
    @GetMapping
    public List<Inventory> getInventory() {
        return  inventoryService.getAllInventory();
    }
}
