package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}
