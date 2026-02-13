package com.neurolearn.backend.model;

import com.neurolearn.backend.model.Question;
import lombok.Data;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class Student {
    private String id;
    private String username;
    private String password; // In a real app, this should be hashed. Storing plain/simple as requested.
    private int gradeLevel; // 6 to 10
    
    // Topic ID -> Mastery Score (0.0 to 100.0)
    private Map<String, Double> masteryScores = new HashMap<>();

    // Topic ID -> Current Difficulty Level
    private Map<String, Question.Difficulty> topicDifficulty = new HashMap<>();
    
    // history of quiz attempts
    private List<QuizAttempt> attempts = new ArrayList<>();
}
