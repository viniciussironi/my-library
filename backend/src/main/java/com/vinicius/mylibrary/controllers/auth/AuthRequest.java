package com.vinicius.mylibrary.controllers.auth;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
