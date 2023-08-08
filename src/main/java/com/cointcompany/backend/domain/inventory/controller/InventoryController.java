package com.cointcompany.backend.domain.inventory.controller;

import com.cointcompany.backend.domain.inventory.entity.Inventory;
import com.cointcompany.backend.domain.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    @GetMapping("/date")
//    public List<Inventory> getAllByIpgodateBetween(@RequestParam LocalDateTime start, LocalDateTime end) {
    public List<Inventory> getAllByIpgodateBetween() {
        LocalDateTime start = LocalDateTime.of(LocalDate.now().minusMonths(8), LocalTime.of(0, 0, 0));
        LocalDateTime end = LocalDateTime.of(LocalDate.now().minusMonths(2), LocalTime.of(0, 0, 0));
        return inventoryService.getAllByIpgodateBetween(start, end);
    }
}