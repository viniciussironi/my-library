package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Getter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    @NotBlank(message = "Este campo não pode estar vazio")
    private String name;
    @NotBlank
    @Email(message = "Digite um email válido")
    private String email;
    private String profilePicture;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.profilePicture = (user.getProfilePicture());
    }
}
