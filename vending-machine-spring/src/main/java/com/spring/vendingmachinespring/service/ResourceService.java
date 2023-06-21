package com.spring.vendingmachinespring.service;

import com.spring.vendingmachinespring.repository.VMResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceService {
    private final VMResourceRepository vmResourceRepository;

//    // Vending Machine 내 총 자원(Total VMResource) 수량
//    public List<VMResource> checkTotalVMResource(Long vmId) {
//        try {
//            List<VMResource> totalVMResource = vmResourceRepository.findByVendingMachineId(vmId);
//            log.info("totalVMResource {}", totalVMResource);
//            return totalVMResource;
//        } catch (Exception e) {
//            log.error("Checking Vending Machine Resource failed", e);
//            throw new ServiceException("Failed to check Vending Machine Resource");
//        }
//    }
//
//    // 필요 자원 수량 누적
//    public List<VMResourceDTO> accumulateProductResource(Long vmId, List<Product> products) {
//        List<VMResourceDTO> accumulateResource = new ArrayList<>();
//        for (Product product : products) {
//            // 각 상품별 필요 재고 수량 (amount)
//            List<VMResourceDTO> calculateProductResourceAmount = vmResourceRepository.findByVendingMachineIdAndProductId(vmId, product.getId());
//            log.info("calculateProductResourceAmount: {} ", calculateProductResourceAmount);
//        }
//        return accumulateResource;
//    }
}
