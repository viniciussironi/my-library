package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.BookDTO;
import com.vinicius.mylibrary.services.BookService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/mybooks")
    public ResponseEntity<Page<BookDTO>> findAllBooks(@PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(bookService.findMyBooks(pageable));
    }

    @PostMapping("/upload")
    public ResponseEntity<BookDTO> uploadBook(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(bookService.uploadBookFile(file));
    }

    @GetMapping("/{id}/cover")
    public ResponseEntity<Resource> getCover(@PathVariable Long id) throws IOException {
        Resource resource = bookService.loadCover(id);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
                .body(resource);
    }
}
