package com.vinicius.mylibrary.entities;

import com.vinicius.mylibrary.enums.BookStatus;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    private BookStatus status;
    private String filePath;
}
