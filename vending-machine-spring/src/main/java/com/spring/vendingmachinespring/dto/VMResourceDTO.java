package com.spring.vendingmachinespring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VMResourceDTO {
    private Long id;
    private Long vmID;
    private Long resourceId;
    private String name;
    private Long quantity;

}
