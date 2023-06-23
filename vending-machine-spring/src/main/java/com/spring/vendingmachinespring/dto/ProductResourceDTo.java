package com.spring.vendingmachinespring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResourceDTO {
    private Long id;
    private Long productId;
    private Long resourceId;
    private Long amount;
}
