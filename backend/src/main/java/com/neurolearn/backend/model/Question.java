package com.neurolearn.backend.model;

import lombok.Data;
import java.util.List;

@Data
public class Question {
    private String id;
    private String text;
    private List<String> options;
    private int correctOptionIndex;
    private Difficulty difficulty;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}
