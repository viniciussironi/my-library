package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.BookDTO;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.enums.BookStatus;
import com.vinicius.mylibrary.repositories.BookRepository;
import nl.siegmann.epublib.domain.Resource;
import nl.siegmann.epublib.epub.EpubReader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class BookService {

    @Value("${app.upload-dir}")
    private String uploadDirProperty;

    private final BookRepository bookRepository;
    private final AuthService authService;

    public BookService(BookRepository bookRepository, UserService userService, AuthService authService) {
        this.bookRepository = bookRepository;
        this.authService = authService;
    }

    public Page<BookDTO> findMyBooks(Pageable pageable) {
        return bookRepository.findBooksByUserId(authService.authenticated().getId(), pageable).map(BookDTO::new);
    }

    public BookDTO uploadBookFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Nome de arquivo inválido");
        }

        String extension = StringUtils.getFilenameExtension(originalFilename);
        if (extension == null || !List.of("pdf", "epub").contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado");
        }

        Path uploadDir = Paths.get(uploadDirProperty).normalize().toAbsolutePath();
        Files.createDirectories(uploadDir);

        String storedFilename = UUID.randomUUID() + "." + extension.toLowerCase();
        Path filePath = uploadDir.resolve(storedFilename).normalize();
        if (!filePath.startsWith(uploadDir)) {
            throw new IllegalArgumentException("Caminho de arquivo inválido");
        }

        Files.write(filePath, file.getBytes());

        Book book = new Book();
        book.setFilePath(filePath.toString());
        book.setTitle(originalFilename);
        book.setStatus(BookStatus.WANT_TO_READ);
        book.setUser(authService.authenticated());

        try {
            if (extension.equalsIgnoreCase("pdf")) {
                extractPdfMetadata(filePath, book);
            } else {
                extractEpubMetadata(filePath, book);
            }
        } catch (Exception e) {
            Files.deleteIfExists(filePath);
            throw e;
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