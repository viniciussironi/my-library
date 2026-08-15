package com.vinicius.mylibrary.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateDTO {

    @NotBlank(message = "Este campo não pode estar vazio")
    private String name;
}
