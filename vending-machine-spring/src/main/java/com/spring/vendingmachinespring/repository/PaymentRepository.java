package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
