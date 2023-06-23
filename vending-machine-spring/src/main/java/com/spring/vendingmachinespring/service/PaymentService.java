package com.spring.vendingmachinespring.service;

import com.spring.vendingmachinespring.dto.ProductDTO;
import com.spring.vendingmachinespring.model.*;
import com.spring.vendingmachinespring.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderRepository orderRepository;
    private final VendingMachineRepository vendingMachineRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final VMResourceRepository vmResourceRepository;
    private final ProductResourceRepository productResourceRepository;

    // 상품 총합 계산
    public Long calculateTotalPrice(List<ProductDTO> selectedProducts) {
        long totalPrice = 0L;
        for (ProductDTO product : selectedProducts) {
            totalPrice += product.getPrice() * product.getQuantity();
        }
        return totalPrice;
    }

    // 자판기 잔액 확인
    @Transactional
    public Long checkLeftChange(Long vmId) {
        VMResource resource = vmResourceRepository.findByVendingMachineIdAndName(vmId, "cash");
        return resource != null ? resource.getQuantity() : 0;
    }

    // 주문 정보 DB 생성
    @Transactional
    public boolean addOrder(Long vmId, Long paymentMethod, List<ProductDTO> products) {
        boolean isOkay = true;

        VendingMachine vendingMachine = vendingMachineRepository.findById(vmId)
                .orElseThrow(() -> new RuntimeException("Vending machine not found"));

        Payment payment = paymentRepository.findById(paymentMethod)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        for (ProductDTO product : products) {
            Product productEntity = productRepository.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            for (int i = 0; i < product.getQuantity(); i++) {
                Order order = Order.builder()
                        .vendingMachine(vendingMachine)
                        .product(productEntity)
                        .payment(payment)
                        .build();

                try {
                    orderRepository.save(order);
                } catch (Exception e) {
                    log.error("Failed to add order in DB.");
                    isOkay = false;
                }
            }
        }
        return isOkay;
    }

    // 가격 결제 로직
    @Transactional
    public boolean pay(Long vmId, Long paymentMethod, Long totalPrice, Long inputMoney) {
        try {
            Long leftMoney = checkLeftChange(vmId);
            if (paymentMethod == 1) {
                return cashPay(vmId, totalPrice, inputMoney, leftMoney);
            } else if (paymentMethod == 2) {
                return cardPay(vmId, totalPrice, inputMoney, leftMoney);
            }
            throw new IllegalArgumentException("Unsupported payment type");
        } catch (Exception e) {
            log.error("Failed to pay product.", e);
            throw new RuntimeException("Failed to pay product.");
        }
    }

    @Transactional
    public boolean cashPay(Long vmId, Long totalPrice, Long inputMoney, Long leftMoney) {
        try {
            if (inputMoney == null || inputMoney < totalPrice) {
                log.info("지불 금액이 부족하거나 올바르지 않습니다.");
                return false;
            } else {
                Long returnChange = inputMoney - totalPrice; // 반환 금액 = 입금액 - 상품 총합
                // 정상적 현금 결제
                if (leftMoney - returnChange >= 0 && returnChange >= 0) {
                    log.info("Total Price is {}.", totalPrice);
                    log.info("Refund Price is {}.", returnChange);
                    return true;
                }
                // 비정상적 현금 결제
                else {
                    log.error("Failed to update left money in VM.");
                    return false;
                }
            }
        } catch (Exception e) {
            log.error("Failed to update left money in VM.");
            return false;
        }
    }

    @Transactional
    public boolean cardPay(Long vmId, Long totalPrice, Long inputMoney, Long leftMoney) {
        try {
            Long leftCardMoney = inputMoney - totalPrice;
            log.info("카드 결제:  {} 원입니다.", totalPrice);
            log.info("결제 중입니다...");

            if (leftCardMoney >= 0) { // 카드 결제 성공
                Thread.sleep(2000);
                log.info("[판매] 카드 결제를 완료하였습니다.");
                return true;
            } else { // 카드 결제 실패
                Thread.sleep(2000);
                log.error("[판매] 카드 결제를 실패하였습니다.");
                return false;
            }
        } catch (Exception e) {
            log.error("카드 결제 중 오류가 발생했습니다: " + e);
            return false;
        }
    }

    @Transactional
    public boolean reduceResource(Long vmId, List<ProductDTO> selectedProducts, Long inputMoney, Long totalPrice) {
        try {
            // 1. 필요 자원 수량 누적 정보
            Map<Long, Long> accumulatedResource = getAccumulateResource(selectedProducts);
            log.info("accumulatedResource: {}", accumulatedResource);

            // 2. 자판기 내 총 자원 수량 정보
            Map<Long, Long> totalVMResource = getTotalVMResource(vmId);
            log.info("totalVMResource: {}", totalVMResource);

            // 자판기 내 resource 양(vmResource)에서 누적 재고 필요 수량(accumulateResource) 차감
            for (ProductDTO product : selectedProducts) {
                List<ProductResource> productResources = productResourceRepository.findByProductId(product.getId());
                for (ProductResource productResource : productResources) {
                    Long resourceId = productResource.getResource().getId();

                    Long accumulatedQuantity = accumulatedResource.get(resourceId);
                    Long totalVMQuantity = totalVMResource.get(resourceId);

                    totalVMQuantity = totalVMQuantity - accumulatedQuantity;
                    VMResource vmResource = vmResourceRepository.findByVendingMachineIdAndResourceId(vmId, resourceId);
                    if (vmResource != null) {
                        vmResource.setQuantity(totalVMQuantity);
                        vmResourceRepository.save(vmResource);
                    }
                }
            }
            // 반환금 잔고 차감
            Long lastMoney = checkLeftChange(vmId) - (inputMoney - totalPrice);
            VMResource cashResource = vmResourceRepository.findByVendingMachineIdAndName(vmId, "cash");
            if (cashResource != null) {
                cashResource.setQuantity(lastMoney);
                vmResourceRepository.save(cashResource);
            }
            return true;
        } catch (Exception e) {
            log.error("Failed to reduce resource in VM: {}", e.getMessage());
            return false;
        }
    }

    // 필요 자원 수량 누적 정보 조회
    private Map<Long, Long> getAccumulateResource(List<ProductDTO> selectedProducts) {
        Map<Long, Long> accumulatedResource = new HashMap<>();
        for (ProductDTO product : selectedProducts) {
            List<ProductResource> productResources = productResourceRepository.findByProductId(product.getId());

            for (ProductResource productResource : productResources) {
                Long resourceId = productResource.getResource().getId();
                Long quantity = product.getQuantity();

                Long accumulatedQuantity = accumulatedResource.getOrDefault(resourceId, 0L);
                accumulatedQuantity += productResource.getAmount() * quantity;
                accumulatedResource.put(resourceId, accumulatedQuantity);
            }
        }
        return accumulatedResource;
    }

    // 자판기 내 총 자원 수량 조회
    private Map<Long, Long> getTotalVMResource(Long vmId) {
        List<VMResource> vmResources = vmResourceRepository.findByVendingMachineId(vmId);
        Map<Long, Long> totalVMResource = new HashMap<>();
        for (VMResource vmResource : vmResources) {
            Long resourceId = vmResource.getResource().getId();
            Long quantity = vmResource.getQuantity();

            totalVMResource.put(resourceId, quantity);
        }
        return totalVMResource;
    }

    @Transactional
    public Long processOrderTransaction(Long vmId, Long inputMoney, Long paymentMethod, List<ProductDTO> selectedProducts) {
        // 0. 상품 총합 계산
        Long totalPrice = calculateTotalPrice(selectedProducts);

        try {
            // 1. 주문 정보 DB 생성
            if (addOrder(vmId, paymentMethod, selectedProducts)) {
                // 2. 가격 결제 로직
                if (pay(vmId, paymentMethod, totalPrice, inputMoney)) {
                    // 3. 재료 차감 로직
                    if (reduceResource(vmId, selectedProducts, inputMoney, totalPrice)) {
                        Long refund = inputMoney - totalPrice;
                        log.info("{}", refund);
                        return refund;
                    } else {
                        throw new RuntimeException("Failed to reduce resource for vending machine " + vmId);
                    }
                } else {
                    throw new RuntimeException("Failed to pay for your purchase in vending machine " + vmId);
                }
            } else {
                throw new RuntimeException("Failed to add order in vending machine " + vmId);
            }

        } catch (Exception e) {
            log.error("Transaction rolled back due to error: " + e.getMessage());
            throw e;
        }
    }
}
