package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
