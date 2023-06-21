package com.spring.vendingmachinespring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity // JPA 에서 엔티티란, DB 테이블에 대응하는 하나의 클래스.
@Table(name = "default_resource", catalog = "vending_machine")
public class DefaultResource {
    // @Entity 가 붙은 클래스는 JPA 가 관리해주며, JPA 를 사용해서 DB 테이블과 매핑할 클래스는 @Entity 를 꼭 붙여야 매핑 가능하다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource; // JPA 에서는 카멜케이스를 보통 사용, db 에서는 스네이크케이스

    private String name;
    private Long quantity;
}
