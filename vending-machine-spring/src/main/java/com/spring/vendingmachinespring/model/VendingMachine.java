package com.spring.vendingmachinespring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "vending_machine", catalog = "vending_machine")
public class VendingMachine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String location;

    @OneToMany(mappedBy = "vendingMachine")
    @JsonBackReference
    private List<Orders> orders = new ArrayList<>();

    @OneToMany(mappedBy = "vendingMachine")
    @JsonBackReference
    private List<VMResource> vmResource = new ArrayList<>();

}
