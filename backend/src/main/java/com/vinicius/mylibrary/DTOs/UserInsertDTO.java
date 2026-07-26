package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserInsertDTO extends UserDTO {

    private String password;

    public UserInsertDTO(User user) {
        super(user);
        this.password = user.getPassword();
    }
}
