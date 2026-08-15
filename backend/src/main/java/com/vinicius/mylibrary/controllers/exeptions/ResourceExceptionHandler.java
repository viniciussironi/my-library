package com.vinicius.mylibrary.controllers.exeptions;

import com.vinicius.mylibrary.services.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


import java.time.Instant;


@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> entityNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.NOT_FOUND;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Rosource not found");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<StandardError> database(DatabaseException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.CONFLICT;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Database exception");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<StandardError> handleEmailExists(EmailAlreadyExistsException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Email exception");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardError> handleEmailExists(IllegalArgumentException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.FORBIDDEN;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Upload exception");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(PasswordException.class)
    public ResponseEntity<StandardError> passwordError(PasswordException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Password exception");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardError> validation (MethodArgumentNotValidException e, HttpServletRequest request) {
        ValidationError err = new ValidationError();
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Validation error");
        err.setMessage("Um ou mais campos são inválidos");
        err.setPath(request.getRequestURI());
        e.getFieldErrors().forEach(x -> err.getListErrors().add(new FieldError(x.getField(), x.getDefaultMessage())));

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<StandardError> invalidFile(InvalidFileException e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("File exception");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleGeneric(Exception e, HttpServletRequest request) {
        StandardError err = new StandardError();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        err.setTimestamp(Instant.now());
        err.setStatus(status.value());
        err.setError("Internal server error");
        err.setMessage("Ocorreu um erro inesperado");
        err.setPath(request.getRequestURI());

        return ResponseEntity.status(status).body(err);
    }
}

