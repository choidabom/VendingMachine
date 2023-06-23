package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
