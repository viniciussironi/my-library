package com.vinicius.mylibrary.controllers.exeptions;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ValidationError extends StandardError {

    private List<FieldError> listErrors = new ArrayList<>();

}
