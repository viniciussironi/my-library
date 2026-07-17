package com.vinicius.mylibrary.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "reading_progress")
public class ReadingProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long bookId;
    private Integer pagesRead;
    private LocalDate startDate;
    private LocalDate endDate;
}
