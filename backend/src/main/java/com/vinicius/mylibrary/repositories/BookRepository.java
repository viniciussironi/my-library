package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Book;
import com.vinicius.mylibrary.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("""
        SELECT b FROM Book b
        WHERE b.user.id = :userId
        AND (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')))
        AND (:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')))
        """)
    Page<Book> search(@Param("userId") Long userId,
                      @Param("title") String title,
                      @Param("author") String author,
                      Pageable pageable);
}
