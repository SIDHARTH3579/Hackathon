package com.neurolearn.backend.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizAttempt {
    private String id;
    private String studentId;
    private String topicId;
    private int totalQuestions;
    private int correctAnswers;
    private double score; // Percentage
    private LocalDateTime timestamp;
    private List<String> questionIdsAttempted;
}
