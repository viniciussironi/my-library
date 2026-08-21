package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.User;
import com.vinicius.mylibrary.enums.BookStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookDTO {

    private Long id;
    private String title;
    private String author;
    private BookStatus status;
    private String coverUrl;
    private String fileType;

    public BookDTO(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.status = book.getStatus();
        this.coverUrl = book.getCoverFilename()!= null ? "/books/" + book.getId() + "/cover" : null;
        this.fileType = book.getFileType();
    }
}