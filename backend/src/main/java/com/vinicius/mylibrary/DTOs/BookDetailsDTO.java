package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.enums.BookStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BookDetailsDTO {

    private Long id;
    private String title;
    private String author;
    private String genre;
    private BookStatus status;
    private String filePath;
    private List<AnnotationDTO> annotations;
    private List<HighlightDTO> highlights;

    public BookDetailsDTO(Book book, List<Annotation> annotations, List<Highlight> highlights) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.status = book.getStatus();
        this.filePath = book.getFilePath();
        this.annotations = annotations.stream().map(AnnotationDTO::new).toList();
        this.highlights = highlights.stream().map(HighlightDTO::new).toList();
    }
}
