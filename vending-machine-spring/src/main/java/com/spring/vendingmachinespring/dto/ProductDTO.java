package com.spring.vendingmachinespring.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ProductDTO {
    private Long id;
    private String name;
    private Long price;
    private Long quantity;

}
