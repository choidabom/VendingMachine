package com.spring.vendingmachinespring.controller;

import com.spring.vendingmachinespring.dto.ProductDTO;
import com.spring.vendingmachinespring.service.VendingMachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
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

    // 상품 조회 API
    @GetMapping("{vmId}/product")
    public ResponseEntity<List<ProductDTO>> getProduct(@PathVariable Long vmId) {
        if (vmId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request body");
        }
        try {
            // (일단!!!) 현재 구현된 것으로썬 vmId에 해당하는 자판기에서 판매할 수 있는 상품을 가져온 것이 아닌 기본 상품 목록을 보여주는 것.
            List<ProductDTO> products = vendingMachineService.getProductsByVMId(vmId);

            if (!products.isEmpty()) {
                return ResponseEntity.ok(products);
            } else {
                // ResponseEntity 는 스프링 프레임워크에서 HTTP 응답을 나타내는 클래스
                // ResponseEntity 상태 코드, 응답 본문을 설정하고, build() 메서드를 호출하여 최종적으로 ResponseEntity 객체 생성
                // ResponseEntity.notFound().build() 는 상태 코드 404를 설정하고, 별도의 응답 본문이 없는 ResponseEntity 객체 생성하여 반환
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Failed to get product from Vending Machine {}", vmId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 상품 선택할 때마다, 제품 재고 가능 여부 확인 API
    @PostMapping("{vmId}/checkAvailability")
    public ResponseEntity<Boolean> checkProductAvailability(@PathVariable Long vmId, @RequestBody List<ProductDTO> selectedProducts) {
        if (vmId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request body");
        }
        try {
            boolean isAvailable = vendingMachineService.checkAvailable(vmId, selectedProducts);
            if (isAvailable) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
            }
        } catch (Exception e) {
            log.error("Failed to select product.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
