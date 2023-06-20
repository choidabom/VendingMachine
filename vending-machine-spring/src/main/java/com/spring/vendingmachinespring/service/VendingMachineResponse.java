package com.spring.vendingmachinespring.service;

public class VendingMachineResponse {
    private String message;

    public VendingMachineResponse(String message) {
        this.message = message;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
