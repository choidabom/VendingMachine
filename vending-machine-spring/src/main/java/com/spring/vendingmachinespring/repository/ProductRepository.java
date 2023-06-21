package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
