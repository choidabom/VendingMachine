//package com.spring.vendingmachinespring.service;
//
//import com.spring.vendingmachinespring.model.Product;
//import com.spring.vendingmachinespring.model.Resource;
//import com.spring.vendingmachinespring.repository.DefaultResourceRepository;
//import com.spring.vendingmachinespring.repository.VMResourceRepository;
//import com.spring.vendingmachinespring.repository.VendingMachineRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class ResourceService {
//    private final VendingMachineRepository vendingMachineRepository;
//    private final VMResourceRepository vmResourceRepository;
//    private final DefaultResourceRepository defaultResourceRepository;
//
//    public List<Resource> accumulateProductResource(Long vmId, List<Product> products) {
//        List<Resource> accumulateResource = new ArrayList<>();
//
//        try {
//            for (Product product : products) {
//                for (int i = 0; i < product.getQuantity(); i++) {
//                    // Get the required resource quantity for each product
//                    List<Object[]> checkResource = VMResourceRepository.findProductResourcedQuantity(vmId, product.getId());
//
//                    // Accumulate the required resource quantities in the vending machine
//                    for (Object[] resource : checkResource) {
//                        Long resourceId = (Long) resource[0];
//                        Integer quantity = (Integer) resource[1];
//                        Integer amount = (Integer) resource[2];
//
//                        Resource existingResource = accumulateResource.stream()
//                                .filter(r -> r.getId().equals(resourceId))
//                                .findFirst()
//                                .orElse(null);
//
//                        if (existingResource == null) {
//                            Resource newResource = new Resource();
//                            newResource.setId(resourceId);
//                            newResource.setAmount(amount);
//                            accumulateResource.add(newResource);
//                        } else {
//                            existingResource.setAmount(existingResource.getAmount() + amount);
//                        }
//                    }
//                }
//            }
//
//            return accumulateResource;
//        } catch (Exception e) {
//            throw new IllegalArgumentException("Accumulating product resource failed", e);
//        }
//    }
//}
