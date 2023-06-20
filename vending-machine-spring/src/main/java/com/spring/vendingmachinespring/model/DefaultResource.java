package com.spring.vendingmachinespring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "default_resource", catalog = "vending_machine")
public class DefaultResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource; // JPA 에서는 카멜케이스를 보통 사용, db 에서는 스네이크케이스

    private String name;
    private Long quantity;
}
