package com.spring.vendingmachinespring.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@Table(name = "vm_resource", catalog = "vending_machine")
@ToString(of = {"id", "name", "quantity"})
public class VMResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vm_id")
    @JsonManagedReference
    private VendingMachine vendingMachine;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    private String name;
    private Long quantity;

}
