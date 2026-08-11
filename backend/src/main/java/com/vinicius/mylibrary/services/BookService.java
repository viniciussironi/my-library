package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.BookDTO;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.User;
import com.vinicius.mylibrary.enums.BookStatus;
import com.vinicius.mylibrary.repositories.BookRepository;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import nl.siegmann.epublib.epub.EpubReader;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
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
    @Value("${app.covers-dir}")
    private String coversDirProperty;

    private final BookRepository bookRepository;
    private final AuthService authService;

    public BookService(BookRepository bookRepository, UserService userService, AuthService authService) {
        this.bookRepository = bookRepository;
        this.authService = authService;
    }

    public Page<BookDTO> findMyBooks(String title, String author, Pageable pageable) {
        Long userId = authService.authenticated().getId();
        return bookRepository.search(userId, title, author, pageable).map(BookDTO::new);
    }


    public Resource loadCover(Long bookId) throws IOException {
        User user = authService.authenticated();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));

        if (!book.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Livro não encontrado");
        }

        if (book.getCoverFilename() == null) {
            throw new ResourceNotFoundException("Livro não possui capa");
        }

        Path coversDir = Paths.get(coversDirProperty).normalize().toAbsolutePath();
        Path coverPath = coversDir.resolve(book.getCoverFilename()).normalize();

        if (!coverPath.startsWith(coversDir)) {
            throw new IllegalArgumentException("Caminho de capa inválido");
        }

        Resource resource = new UrlResource(coverPath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("Arquivo de capa não encontrado");
        }

        return resource;
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
            if (book.getCoverFilename() != null) {
                Files.deleteIfExists(Paths.get(coversDirProperty).resolve(book.getCoverFilename()));
            }
            throw e;
        }

        return new BookDTO(bookRepository.save(book));
    }

    private void extractPdfMetadata(Path filePath, Book book) throws IOException {
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDDocumentInformation info = document.getDocumentInformation();
            book.setTitle(info.getTitle() != null ? info.getTitle() : "Untitled PDF");
            book.setAuthor(info.getAuthor() != null ? info.getAuthor() : "Unknown Author");
            book.setTotalPages(document.getNumberOfPages());

            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImageWithDPI(0, 150);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            book.setCoverFilename(saveCover(baos.toByteArray()));
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
            book.setTotalPages(epubBook.getSpine().size());

            nl.siegmann.epublib.domain.Resource coverImage = epubBook.getCoverImage();
            if (coverImage != null) {
                book.setCoverFilename(saveCover(coverImage.getData()));
            }
        }
    }

    private String saveCover(byte[] coverBytes) throws IOException {
        if (coverBytes == null) {
            return null;
        }

        Path coversDir = Paths.get(coversDirProperty).normalize().toAbsolutePath();
        Files.createDirectories(coversDir);

        String coverFilename = UUID.randomUUID() + ".png";
        Path coverPath = coversDir.resolve(coverFilename).normalize();
        if (!coverPath.startsWith(coversDir)) {
            throw new IllegalArgumentException("Caminho de capa inválido");
        }

        Files.write(coverPath, coverBytes);
        return coverFilename;
    }


}