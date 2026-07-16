package com.vinicius.mylibrary.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles;

    @OneToMany(mappedBy = "userReference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Annotation> annotations;

    @OneToMany(mappedBy = "userReference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Highlight> highlights;
}
