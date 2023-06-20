package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.VendingMachine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendingMachineRepository extends JpaRepository<VendingMachine, Long> {
}
