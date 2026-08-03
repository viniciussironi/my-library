package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b WHERE b.user.id = :userId")
    Page<Book> findBooksByUserId(@Param("userId") Long userId, Pageable pageable);
}
