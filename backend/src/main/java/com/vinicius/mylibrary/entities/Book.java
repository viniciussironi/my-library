package com.vinicius.mylibrary.entities;

import com.vinicius.mylibrary.enums.BookStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "books")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String genre;

    @Enumerated(EnumType.STRING)
    private BookStatus status;

    private String filePath;

    @OneToMany(mappedBy = "bookReference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Annotation> annotations;

    @OneToMany(mappedBy = "bookReference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Highlight> highlights;
}
