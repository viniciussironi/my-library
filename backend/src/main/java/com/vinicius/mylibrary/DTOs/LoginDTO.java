package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginDTO {

    private String email;
    private String password;

    public LoginDTO(User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
    }
}
