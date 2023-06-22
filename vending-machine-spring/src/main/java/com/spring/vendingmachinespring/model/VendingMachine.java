package com.spring.vendingmachinespring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vending_machine", catalog = "vending_machine")
public class VendingMachine {
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY) 이 부분을 추가했을 때, 기본 키 생성을 데이터베이스에 위임함.
    // DB가 알아서 AUTO_INCREMENT 를 하기 때문에, vendingMachine.setId(vmId)를 했을 때 vmId 값이 들어가지 않았음.
    private Long id;
    private String name;
    private String location;

    @OneToMany(mappedBy = "vendingMachine")
    @JsonBackReference
    private List<Orders> orders;

    @OneToMany(mappedBy = "vendingMachine")
    @JsonBackReference
    private List<VMResource> vmResource;

}
