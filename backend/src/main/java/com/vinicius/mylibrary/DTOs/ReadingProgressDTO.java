package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.ReadingProgress;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class ReadingProgressDTO {

    private Long id;
    private Long userId;
    private Long bookId;
    private Integer pagesRead;
    private LocalDate startDate;
    private LocalDate endDate;

    public ReadingProgressDTO(ReadingProgress readingProgress) {
        this.id = readingProgress.getId();
        this.userId = readingProgress.getUserId();
        this.bookId = readingProgress.getBookId();
        this.pagesRead = readingProgress.getPagesRead();
        this.startDate = readingProgress.getStartDate();
        this.endDate = readingProgress.getEndDate();
    }
}
