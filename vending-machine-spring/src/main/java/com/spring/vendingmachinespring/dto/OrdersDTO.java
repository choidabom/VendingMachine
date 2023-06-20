package com.spring.vendingmachinespring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdersDTO {
    private Long id;
    private Long vmId;
    private Long productId;
    private Long paymentId;
}
