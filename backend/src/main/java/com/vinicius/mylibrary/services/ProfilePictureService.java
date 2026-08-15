package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.UserDTO;
import com.vinicius.mylibrary.entities.User;
import com.vinicius.mylibrary.repositories.UserRepository;
import com.vinicius.mylibrary.services.exceptions.InvalidFileException;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProfilePictureService {

    @Value("${app.profile-picture-dir}")
    private String profilePictureDir;

    private final UserRepository userRepository;
    private final AuthService authService;


    public ProfilePictureService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public Resource getProfilePhoto() throws IOException {
        User user = authService.authenticated();

        Path photo = Paths.get(profilePictureDir).normalize().toAbsolutePath();
        Path photoPath = photo.resolve(user.getProfilePicture()).normalize();


        Resource resource = new UrlResource(photoPath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("Arquivo não encontrado");
        }

        return resource;
    }

    public UserDTO uploadProfilePhoto(MultipartFile file) {
        User entity = authService.authenticated();

        validateImage(file);

        String imgUrl = upload(file);
        entity.setProfilePicture(imgUrl);

        entity = userRepository.save(entity);
        return new UserDTO(entity);
    }

    private String upload(MultipartFile multipartFile) {
        try {
            String profilePhotoFileName = UUID.randomUUID() + ".png";

            Path filePath = Paths.get(profilePictureDir).resolve(profilePhotoFileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return profilePhotoFileName;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage());
        }
    }

    private void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Arquivo vazio");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileException("Arquivo deve ser uma imagem");
        }
        long maxSize = 20 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new InvalidFileException("Imagem muito grande (máx. 20MB)");
        }
    }
}
