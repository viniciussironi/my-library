package com.vinicius.mylibrary.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reading_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "book_id"}))
public class ReadingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Indexed
    @Column(nullable = false)
    private Long userId;

    @Indexed
    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false)
    private Integer pagesRead;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
