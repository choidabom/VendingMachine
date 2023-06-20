package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
