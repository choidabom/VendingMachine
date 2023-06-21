package com.spring.vendingmachinespring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "product", catalog = "vending_machine")
@ToString(of = {"id", "name", "price"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String price;

    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<ProductResource> productResource = new ArrayList<>();


}
