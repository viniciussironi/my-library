package com.vinicius.mylibrary.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "annotations")
@Data
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private int page;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book bookReference;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userReference;
}
