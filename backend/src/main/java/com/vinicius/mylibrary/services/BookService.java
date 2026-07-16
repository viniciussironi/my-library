package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.repositories.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book save(Book book) {
        return bookRepository.save(book);
    }

    public Book uploadBookFile(Long bookId, MultipartFile file) throws IOException {
        Path path = Paths.get("uploads/" + file.getOriginalFilename());
        Files.write(path, file.getBytes());

        Book book = bookRepository.findById(bookId).orElseThrow();
        book.setFilePath(path.toString());
        return bookRepository.save(book);
    }
}