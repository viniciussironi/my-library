package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.BookDetailsDTO;
import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.repositories.AnnotationRepository;
import com.vinicius.mylibrary.repositories.BookRepository;
import com.vinicius.mylibrary.repositories.HighlightRepository;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.Transient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final AnnotationRepository annotationRepository;
    private final HighlightRepository highlightRepository;

    public LibraryService(BookRepository bookRepository,
                       AnnotationRepository annotationRepository,
                       HighlightRepository highlightRepository) {
        this.bookRepository = bookRepository;
        this.annotationRepository = annotationRepository;
        this.highlightRepository = highlightRepository;
    }

    public BookDetailsDTO getBookDetails(Long bookId) throws ResourceNotFoundException {
        Book book = bookRepository.findById(bookId).orElseThrow();
        List<Annotation> annotations = annotationRepository.findByBookId(bookId);
        List<Highlight> highlights = highlightRepository.findByBookId(bookId);
        return new BookDetailsDTO(book, annotations, highlights);
    }
}
