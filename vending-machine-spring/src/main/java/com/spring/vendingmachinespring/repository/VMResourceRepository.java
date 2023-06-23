package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.VMResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VMResourceRepository extends JpaRepository<VMResource, Long> {
    List<VMResource> findByVendingMachineId(Long vmId);

    VMResource findByVendingMachineIdAndName(Long vmId, String cash);

    VMResource findByVendingMachineIdAndResourceId(Long vmId, Long resourceId);
}
