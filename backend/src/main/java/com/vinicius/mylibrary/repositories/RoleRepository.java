package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByAuthority(String authority);
}
