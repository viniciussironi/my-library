package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.BookDTO;
import com.vinicius.mylibrary.services.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/upload")
    public ResponseEntity<BookDTO> uploadBook(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(bookService.uploadBookFile(file));
    }
}
