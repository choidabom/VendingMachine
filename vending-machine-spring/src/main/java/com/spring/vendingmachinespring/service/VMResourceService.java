package com.spring.vendingmachinespring.service;

import com.spring.vendingmachinespring.repository.VMResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class VMResourceService {
    private final VMResourceRepository vmResourceRepository;
//
//    public List<VMResource> checkingVMResource(Long vmId) {
//        return vmResourceRepository.findByVendingMachineId(vmId);
//    }

}
