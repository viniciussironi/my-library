package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Getter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String profilePicture;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.profilePicture = (user.getProfilePicture());
    }
}
