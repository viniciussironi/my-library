package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.UserUpdatePasswordDTO;
import com.vinicius.mylibrary.DTOs.UserUpdateDTO;
import com.vinicius.mylibrary.DTOs.UserDTO;
import com.vinicius.mylibrary.DTOs.UserInsertDTO;
import com.vinicius.mylibrary.entities.Role;
import com.vinicius.mylibrary.entities.User;
import com.vinicius.mylibrary.repositories.RoleRepository;
import com.vinicius.mylibrary.repositories.UserRepository;
import com.vinicius.mylibrary.services.exceptions.DatabaseException;
import com.vinicius.mylibrary.services.exceptions.EmailAlreadyExistsException;
import com.vinicius.mylibrary.services.exceptions.PasswordException;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, AuthService authService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getMe() {
        User entity = authService.authenticated();
        return new UserDTO(entity);
    }

    public UserDTO save(UserInsertDTO user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Este e-mail já está cadastrado");
        }

        User entity = new User();
        Role role = roleRepository.findByAuthority("USER");
        if (role == null) {
            throw new IllegalStateException("Role não encontrada");
        }
        dtoToEntity(user, entity);
        entity.getRoles().add(role);
        entity.setProfilePicture("default-profile.png");
        entity = userRepository.save(entity);

        return new UserDTO(entity);
    }

    public UserDTO update(UserUpdateDTO dto) {
        try {
            User entity = authService.authenticated();
            entity.setName(dto.getName());
            entity = userRepository.save(entity);
            return new UserDTO(entity);
        }
        catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Usuário não encotrado");
        }
    }

    public UserDTO updatePassword(UserUpdatePasswordDTO dto) {
        try {
            User entity = authService.authenticated();

            if (!passwordEncoder.matches(dto.getCurrentPassword(), entity.getPassword())) {
                throw new PasswordException("Senha atual incorreta");
            }

            if (!dto.getNewPassword1().equals(dto.getNewPassword2())) {
                throw new PasswordException("As senhas não são iguais");
            }

            entity.setPassword(passwordEncoder.encode(dto.getNewPassword1()));

            entity = userRepository.save(entity);

            return new UserDTO(entity);
        }
        catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Usuário não encotrado");
        }
    }

    public void delete() {
        User entity = authService.authenticated();

        try {
            userRepository.delete(entity);
        }
        catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Falha de integridade");
        }
    }


    private void dtoToEntity(UserInsertDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
    }
}
