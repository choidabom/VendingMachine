package com.spring.vendingmachinespring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "vm_resource", catalog = "vending_machine")
public class VMResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vm_id")
    private VendingMachine vendingMachine;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    private String name;
    private Long quantity;

}
