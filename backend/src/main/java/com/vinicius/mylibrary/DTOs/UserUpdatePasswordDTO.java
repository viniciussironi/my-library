package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdatePasswordDTO {

    private String currentPassword;
    private String password;

    public UpdatePasswordDTO(User user) {
        this.name = user.getName();
        this.profilePicture = (user.getProfilePicture());
    }
}
