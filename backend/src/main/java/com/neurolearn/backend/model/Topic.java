package com.neurolearn.backend.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class Topic {
    private String id;
    private String name;
    private String subject; // e.g., "Mathematics"
    private List<Integer> gradeLevels = new ArrayList<>(); // e.g., [6, 7]
    private List<Question> questions = new ArrayList<>();
}
