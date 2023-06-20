package com.spring.vendingmachinespring;

import com.spring.vendingmachinespring.model.VendingMachine;
import com.spring.vendingmachinespring.repository.VendingMachineRepository;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

@SpringBootTest
@Transactional
@Commit
class BackendApplicationTests {

    @Autowired
    private VendingMachineRepository vendingMachineRepository;

    @Test
    void contextLoads() {
    }

    @Test
    public void testSaveVendingMachine() {
        VendingMachine vm = new VendingMachine();
        vm.setId(500L);
        vm.setName("vm");
        vm.setLocation("NewYork");
        VendingMachine savedVm = vendingMachineRepository.save(vm);

        Assertions.assertThat(savedVm.getId()).isEqualTo(vm.getId());
        System.out.println("Saved vending machine ID: " + savedVm.getId());
    }

}
