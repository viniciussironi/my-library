package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserInsertDTO extends UserDTO {

    @Size(min = 8, max = 32, message = "A Senha deve ter de 8 a 32 caracteres")
    @NotBlank(message = "Digite a senha")
    private String password;

    public UserInsertDTO(User user) {
        super(user);
        this.password = user.getPassword();
    }
}
