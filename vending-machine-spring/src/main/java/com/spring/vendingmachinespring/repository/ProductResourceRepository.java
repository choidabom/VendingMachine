package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.ProductResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductResourceRepository extends JpaRepository<ProductResource, Long> {
}
