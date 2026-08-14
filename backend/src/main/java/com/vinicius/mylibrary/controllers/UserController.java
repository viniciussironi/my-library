package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.UserDTO;
import com.vinicius.mylibrary.DTOs.UserInsertDTO;
import com.vinicius.mylibrary.services.ProfilePictureService;
import com.vinicius.mylibrary.services.UserService;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ProfilePictureService profilePictureService;

    public UserController(UserService userService, ProfilePictureService profilePictureService) {
        this.userService = userService;
        this.profilePictureService = profilePictureService;
    }

    @GetMapping(value = "/me")
    public ResponseEntity<UserDTO> getMe() {
        return ResponseEntity.ok().body(userService.getMe());
    }

    @PostMapping(value = "/register")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserInsertDTO user) {
        UserDTO dto = userService.save(user);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();

        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserInsertDTO dto) {
        UserDTO newDto = userService.update(id, dto);
        return ResponseEntity.ok().body(newDto);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profilephoto")
    public ResponseEntity<Resource> getCover() throws IOException {
        Resource resource = profilePictureService.loadProfilePhoto();

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
                .body(resource);
    }

    @PostMapping(value = "/profilephoto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        UserDTO dto = profilePictureService.uploadProfilePhoto(file);
        return ResponseEntity.ok(dto);
    }
}
