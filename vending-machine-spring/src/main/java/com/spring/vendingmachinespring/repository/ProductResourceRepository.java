package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.ProductResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductResourceRepository extends JpaRepository<ProductResource, Long> {
    List<ProductResource> findByProductId(Long id);
}
