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
        AND (
            :search IS NULL 
            OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) 
            OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        """)
    Page<Book> search(@Param("userId") Long userId,
                      @Param("search") String search,
                      Pageable pageable);
}
