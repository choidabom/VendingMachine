package com.spring.vendingmachinespring.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    private Long vmId;
    private Long inputMoney;
    private Long paymentMethod;
    private List<ProductDTO> selectedProducts;
}
