package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.BookDetailsDTO;
import com.vinicius.mylibrary.services.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/library")
public class LibraryController {

    private LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailsDTO> getBookDetails(@PathVariable Long id) {
        return ResponseEntity.ok(libraryService.getBookDetails(id));
    }
}
