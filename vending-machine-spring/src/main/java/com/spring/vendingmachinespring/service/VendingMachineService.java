package com.spring.vendingmachinespring.service;

import com.spring.vendingmachinespring.dto.ProductDTO;
import com.spring.vendingmachinespring.model.*;
import com.spring.vendingmachinespring.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendingMachineService {
    private final VendingMachineRepository vendingMachineRepository;
    private final VMResourceRepository vmResourceRepository;
    private final DefaultResourceRepository defaultResourceRepository;
    private final ProductRepository productRepository;
    private final ProductResourceRepository productResourceRepository;

    public boolean initializeVendingMachine(Long vmId) {
        try {
            // 1. 자판기 존재 여부 확인
            if (!vendingMachineRepository.existsById(vmId)) {
                log.info(String.valueOf(vmId));
                insertVendingMachine(vmId);
            }
            // 2. 기본 자원 목록을 조회하면서 자판기 자원에 없는 자원 추가
            addingDefaultResource(vmId);
            return true;
        } catch (Exception e) {
            log.error("Failed to init vending machine.", e);
            return false;
        }
    }

    // 자판기 객체 DB 추가
    private void insertVendingMachine(Long vmId) {
        VendingMachine vendingMachine = VendingMachine.builder()
                .id(vmId)
                .name("VM" + vmId)
                .location("seoul")
                .build();

        // vendingMachine 객체를 vending_machine 테이블에 저장.
        //이 메서드가 없다면 db에 저장되지 않음.
        vendingMachineRepository.save(vendingMachine);
    }

    // 자판기 resource 추가: default resource 의 목록을 조회하면서, vm_resource 에 없는 resource 추가
    public void addingDefaultResource(Long vmId) {
        List<DefaultResource> defaultResources = defaultResourceRepository.findAll(); // 기본 자원 데이터 조회
        List<VMResource> existingResources = vmResourceRepository.findByVendingMachineId(vmId); // 이미 추가되어 있는 자원 조회

        // 자판기에 추가되지 않은 기본 자원 추가
        for (DefaultResource defaultResource : defaultResources) {
            Long resourceId = defaultResource.getResource().getId();

            boolean isExisting = existingResources.stream()
                    .anyMatch(vmResource -> vmResource.getResource().getId().equals(resourceId));

            if (!isExisting) {
                // 자판기에 자원 추가
                VMResource vmResource = VMResource.builder()
                        .vendingMachine(vendingMachineRepository.findById(vmId).orElse(null))
                        .resource(defaultResource.getResource())
                        .name(defaultResource.getName())
                        .quantity(defaultResource.getQuantity())
                        .build();

                // 필요한 데이터베이스 조작 등의 로직을 수행
                // 예를 들어, vmResourceRepository 를 사용하여 자판기 자원을 저장하거나 업데이트할 수 있습니다.
                vmResourceRepository.save(vmResource);
            }
        }
    }

    // 해당 자판기에 등록된 상품 중 판매 가능한 상품 목록 조회
    public List<ProductDTO> getProductsByVMId(Long vmId) {
        List<Product> productList = productRepository.findAll();

        // 기준: 못 해도 두 개는 팔 수 있는 자판기 !
        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product product : productList) {
            Long doubledQuantity = 2L;

            ProductDTO productDTO = ProductDTO.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .price(Long.valueOf(product.getPrice()))
                    .quantity(doubledQuantity)
                    .build();

            productDTOList.add(productDTO);
            List<ProductResource> productResources = productResourceRepository.findByProductId(product.getId());
            log.info("{}", productResources);

        }
        log.info(productDTOList.toString());

        // checkProductResource : 판매 가능한 상품 리스트 반환
        List<ProductDTO> availableProducts = checkProductResource(vmId, productDTOList);
        if (availableProducts.isEmpty()) {
            return Collections.emptyList();
        }
        return availableProducts;
    }

    // 상품 선택할 때마다, 제품 재고 가능 여부 확인 함수 - 판매 가능한 상품이 있으면 재고 있음!
    public boolean checkAvailable(Long vmId, List<ProductDTO> selectedProducts) {
        List<ProductDTO> availableProducts = checkProductResource(vmId, selectedProducts);
        return !availableProducts.isEmpty();
    }

    // 필요 자원 수량 누적 정보(accumulateResource)와 자판기 내 총 자원 수량 정보(totalVMResource) 비교해서
    // 판매 가능한 상품 리스트 반환
    private List<ProductDTO> checkProductResource(Long vmId, List<ProductDTO> productList) {
        // 1. 필요 자원 수량 누적 정보
        Map<Long, Long> accumulatedResource = getAccumulateResource(productList);
        log.info("accumulatedResource: {}", accumulatedResource);

        // 2. 자판기 내 총 자원 수량 정보
        Map<Long, Long> totalVMResource = getTotalVMResource(vmId);
        log.info("totalVMResource: {}", totalVMResource);

        // 판매 가능한 상품 리스트 확인
        List<ProductDTO> availableProducts = new ArrayList<>();
        for (ProductDTO product : productList) {
            boolean isAvailable = true;
            List<ProductResource> productResources = productResourceRepository.findByProductId(product.getId());
            for (ProductResource productResource : productResources) {
                Long resourceId = productResource.getResource().getId();

                Long accumulatedQuantity = accumulatedResource.get(resourceId);
                Long totalVMQuantity = totalVMResource.get(resourceId);
                if (accumulatedQuantity > totalVMQuantity) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable) {
                availableProducts.add(product);
            }
        }

        return availableProducts;
    }

    // 필요 자원 수량 누적 정보 조회
    private Map<Long, Long> getAccumulateResource(List<ProductDTO> productList) {
        Map<Long, Long> accumulatedResource = new HashMap<>(); // 해시맵 자료구조: 키와 값의 쌍을 저장하고 검색하는데 사용
        for (ProductDTO product : productList) {
            List<ProductResource> productResources = productResourceRepository.findByProductId(product.getId());

            for (ProductResource productResource : productResources) {
                Long resourceId = productResource.getResource().getId();
                Long quantity = product.getQuantity();

                Long accumulatedQuantity = accumulatedResource.getOrDefault(resourceId, 0L);
                accumulatedQuantity += productResource.getAmount() * quantity;
                accumulatedResource.put(resourceId, accumulatedQuantity);
            }
        }
        return accumulatedResource;
    }

    // 자판기 내 총 자원 수량 조회
    private Map<Long, Long> getTotalVMResource(Long vmId) {
        List<VMResource> vmResources = vmResourceRepository.findByVendingMachineId(vmId);
        Map<Long, Long> totalVMResource = new HashMap<>();
        for (VMResource vmResource : vmResources) {
            Long resourceId = vmResource.getResource().getId();
            Long quantity = vmResource.getQuantity();

            totalVMResource.put(resourceId, quantity);
        }
        return totalVMResource;
    }

}
