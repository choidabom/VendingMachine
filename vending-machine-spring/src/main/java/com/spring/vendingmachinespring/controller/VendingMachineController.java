package com.spring.vendingmachinespring.controller;

import com.spring.vendingmachinespring.service.VendingMachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController // @RestController =  @Controller + @ResponseBody
@RequestMapping("/vending_machine")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VendingMachineController {
    private final VendingMachineService vendingMachineService;

    // 자판기 가동 API
    @GetMapping("/{vmId}")
    public ResponseEntity<Map<String, Object>> startVendingMachine(@PathVariable Long vmId) {
        if (vmId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request body");
        }
        Map<String, Object> response = new HashMap<>();
        try {
            boolean completeInit = vendingMachineService.initializeVendingMachine(vmId);

            if (completeInit) {
                response.put("vmId", vmId);
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            } else {
                response.put("error", "Cannot start vending machine.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            }
        } catch (Exception e) {
            log.error("Failed to start Vending Machine {}", vmId, e);
            response.put("error", "Failed to start vending machine.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
    }


}
