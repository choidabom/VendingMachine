package com.spring.vendingmachinespring.service;

import com.spring.vendingmachinespring.model.DefaultResource;
import com.spring.vendingmachinespring.model.VMResource;
import com.spring.vendingmachinespring.model.VendingMachine;
import com.spring.vendingmachinespring.repository.DefaultResourceRepository;
import com.spring.vendingmachinespring.repository.VMResourceRepository;
import com.spring.vendingmachinespring.repository.VendingMachineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendingMachineService {
    private final VendingMachineRepository vendingMachineRepository;
    private final VMResourceRepository vmResourceRepository;
    private final DefaultResourceRepository defaultResourceRepository;


    public boolean initializeVendingMachine(Long vmId) {
        try {
            // 1. 자판기 존재 여부 확인
            if (!isVendingMachineExist(vmId)) {
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

    // 자판기 존재 여부 확인
    private boolean isVendingMachineExist(Long vmId) {
        return vendingMachineRepository.existsById(vmId);
    }

    // 자판기 객체 DB 추가
    private void insertVendingMachine(Long vmId) {
        VendingMachine vendingMachine = new VendingMachine();
        vendingMachine.setId(vmId);
        vendingMachine.setLocation("seoul");
        vendingMachineRepository.save(vendingMachine);
    }

    // 자판기 resource 추가: default resource 의 목록을 조회하면서, vm_resource 에 없는 resource 추가
    // 기본 자원을 자판기에 추가
    public void addingDefaultResource(Long vmId) {
        // 기본 자원 데이터 조회
        List<DefaultResource> defaultResources = defaultResourceRepository.findAll();

        // 이미 추가되어 있는 자원 조회
        List<VMResource> existingResources = vmResourceRepository.findByVendingMachineId(vmId);

        // 자판기에 추가되지 않은 기본 자원 추가
        for (DefaultResource defaultResource : defaultResources) {
            Long resourceId = defaultResource.getResource().getId();

            boolean isExisting = existingResources.stream()
                    .anyMatch(vmResource -> vmResource.getResource().getId().equals(resourceId));
// null 인경우 고려

            if (!isExisting) {
                // 자판기에 자원 추가
                VMResource vmResource = new VMResource();
                Optional<VendingMachine> vendingMachine = vendingMachineRepository.findById(vmId);
                vendingMachine.ifPresent(machine -> {
                    vmResource.setVendingMachine(machine);
                    vmResource.setResource(defaultResource.getResource());
                    vmResource.setName(defaultResource.getName());
                    vmResource.setQuantity(defaultResource.getQuantity());

                    // 필요한 데이터베이스 조작 등의 로직을 수행
                    // 예를 들어, vmResourceRepository 를 사용하여 자판기 자원을 저장하거나 업데이트할 수 있습니다.
                    vmResourceRepository.save(vmResource);
                });
            }
        }
    }

//    public boolean checkProductAvailability(Long vmId, List<Product> selectedProducts) {
//        try {
//            return this.checkResource(vmId, selectedProducts);
//
//        } catch (Exception e) {
//            throw new IllegalArgumentException("Failed to check product availability");
//            return false;
//        }
//    }
//
//    public boolean checkResource(Long vmId, List<Product> selectedProducts) {
//        // 1. 누적 자원 필요 수량 정보
//
//        // 2. vm 내 자원 수량 정보
//
//    }

}
