package com.vinicius.mylibrary.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdatePasswordDTO {

    @NotBlank(message = "Digite a senha")
    private String currentPassword;
    @Size(min = 8, max = 32, message = "A Senha deve ter de 8 a 32 caracteres")
    @NotBlank(message = "Digite a senha")
    private String newPassword1;
    @Size(min = 8, max = 32, message = "A Senha deve ter de 8 a 32 caracteres")
    @NotBlank(message = "Digite a senha")
    private String newPassword2;
}
