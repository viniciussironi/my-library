package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {}
