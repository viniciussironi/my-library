package com.vinicius.mylibrary.DTOs;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
}
