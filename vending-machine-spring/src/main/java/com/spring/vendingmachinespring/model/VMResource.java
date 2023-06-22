package com.spring.vendingmachinespring.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
// @Builder 사용 이후, @NoArgsConstructor, @AllArgsConstructor 없다면
// 해당 오류가 발생 org.hibernate.InstantiationException: No default constructor for entity :
@Table(name = "vm_resource", catalog = "vending_machine")
@ToString(of = {"id", "name", "quantity"})
public class VMResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    private String name;
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "vm_id")
    @JsonManagedReference
    private VendingMachine vendingMachine;
}
