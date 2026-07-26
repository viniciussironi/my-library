package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.UserDTO;
import com.vinicius.mylibrary.DTOs.UserInsertDTO;
import com.vinicius.mylibrary.entities.Role;
import com.vinicius.mylibrary.entities.User;
import com.vinicius.mylibrary.repositories.RoleRepository;
import com.vinicius.mylibrary.repositories.UserRepository;
import com.vinicius.mylibrary.services.exceptions.DatabaseException;
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
        User entity = new User();
        Role role = roleRepository.findByAuthority("USER");
        dtoToEntity(user, entity);
        entity.getRoles().add(role);

        entity = userRepository.save(entity);

        return new UserDTO(entity);
    }

    public UserDTO update(Long id, UserInsertDTO dto) {
        try {
            User entity = userRepository.getReferenceById(id);
            dtoToEntity(dto, entity);
            entity = userRepository.save(entity);
            return new UserDTO(entity);
        }
        catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Usuário não encotrado");
        }
    }

    public void delete(Long id) {
        if(!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encotrado");
        }
        try {
            userRepository.deleteById(id);
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
