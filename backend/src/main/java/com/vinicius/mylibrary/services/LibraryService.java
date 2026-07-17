package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.BookDetailsDTO;
import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.repositories.AnnotationRepository;
import com.vinicius.mylibrary.repositories.BookRepository;
import com.vinicius.mylibrary.repositories.HighlightRepository;

import java.util.List;

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

    // Busca o livro com as anotações e marcações - PRONTO
    public BookDetailsDTO getBookDetails(Long bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        List<Annotation> annotations = annotationRepository.findByBookId(bookId);
        List<Highlight> highlights = highlightRepository.findByBookId(bookId);

        return new BookDetailsDTO(book, annotations, highlights);
    }
}
