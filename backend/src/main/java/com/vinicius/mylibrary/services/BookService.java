package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.BookDTO;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.enums.BookStatus;
import com.vinicius.mylibrary.repositories.BookRepository;
import nl.siegmann.epublib.epub.EpubReader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Upload do documento - PRONTO
    public BookDTO uploadBookFile(MultipartFile file) throws IOException {
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path filePath = uploadDir.resolve(file.getOriginalFilename());
        Files.write(filePath, file.getBytes());

        Book book = new Book();
        book.setFilePath(filePath.toString());
        book.setStatus(BookStatus.WANT_TO_READ);

        String filename = file.getOriginalFilename().toLowerCase();

        if (filename.endsWith(".pdf")) {
            extractPdfMetadata(filePath, book);
        } else if (filename.endsWith(".epub")) {
            extractEpubMetadata(filePath, book);
        } else {
            book.setTitle("Unknown Title");
            book.setAuthor("Unknown Author");
        }

        return new BookDTO(bookRepository.save(book));
    }

    private void extractPdfMetadata(Path filePath, Book book) throws IOException {
        try (PDDocument document = PDDocument.load(filePath.toFile())) {
            PDDocumentInformation info = document.getDocumentInformation();
            book.setTitle(info.getTitle() != null ? info.getTitle() : "Untitled PDF");
            book.setAuthor(info.getAuthor() != null ? info.getAuthor() : "Unknown Author");
        }
    }

    private void extractEpubMetadata(Path filePath, Book book) throws IOException {
        try (InputStream in = Files.newInputStream(filePath)) {
            EpubReader reader = new EpubReader();
            nl.siegmann.epublib.domain.Book epubBook = reader.readEpub(in);

            book.setTitle(epubBook.getTitle() != null ? epubBook.getTitle() : "Untitled EPUB");
            book.setAuthor(epubBook.getMetadata().getAuthors().isEmpty()
                    ? "Unknown Author"
                    : epubBook.getMetadata().getAuthors().get(0).toString());
        }
    }
}