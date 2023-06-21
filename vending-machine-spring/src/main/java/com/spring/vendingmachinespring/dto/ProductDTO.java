package com.spring.vendingmachinespring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Long id;
    private String name;
    private Long price;
    private Long quantity;

}
