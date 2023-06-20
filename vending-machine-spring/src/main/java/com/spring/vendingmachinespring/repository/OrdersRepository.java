package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
}
