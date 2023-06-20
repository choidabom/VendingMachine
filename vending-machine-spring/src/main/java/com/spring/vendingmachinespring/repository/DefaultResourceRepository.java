package com.spring.vendingmachinespring.repository;

import com.spring.vendingmachinespring.model.DefaultResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DefaultResourceRepository extends JpaRepository<DefaultResource, Long> {
}
