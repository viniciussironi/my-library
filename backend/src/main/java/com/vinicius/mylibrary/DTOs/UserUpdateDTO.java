package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateUserDTO {

    private String name;
    private String profilePicture;

    public UpdateUserDTO(User user) {
        this.name = user.getName();
        this.profilePicture = (user.getProfilePicture());
    }
}
