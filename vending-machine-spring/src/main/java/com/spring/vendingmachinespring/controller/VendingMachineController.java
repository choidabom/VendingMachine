package com.spring.vendingmachinespring.controller;

import com.spring.vendingmachinespring.service.VendingMachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController // @RestController =  @Controller + @ResponseBody
@RequestMapping("/vending_machine")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VendingMachineController {
    private final VendingMachineService vendingMachineService;

    // 자판기 가동 API
    @GetMapping("/{vmId}")
    public ResponseEntity<?> startVendingMachine(@PathVariable Long vmId) {
        if (vmId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request body");
        }
        try {
            boolean completeInit = vendingMachineService.initializeVendingMachine(vmId);
            JSONObject json = new JSONObject(); // json 객체 생성

            if (completeInit) {
                json.put("vmId", vmId);
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(json.toString());
            } else {
                json.put("error", "Cannot start vending machine.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(json.toString());
            }
        } catch (Exception e) {
            log.error("Failed to start Vending Machine {}", vmId, e);
            JSONObject json = new JSONObject();
            json.put("error", "Failed to start vending machine.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(json.toString());
        }
    }


    // 상품 선택할 때마다, 제품 재고 가능 여부 확인
//    @PostMapping("/{vmId}/checkAvailability")
//    public ResponseEntity<?> checkProductAvailability(@PathVariable Long vmId, @RequestBody List<Product> selectedProducts) {
//        try {
//            boolean checkAvailable = vendingMachineService.checkProductAvailability(vmId, selectedProducts);
//            if (checkAvailable) {
//                return ResponseEntity.ok(true);
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
//        }
//    }

}
