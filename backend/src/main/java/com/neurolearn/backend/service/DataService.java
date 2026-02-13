package com.neurolearn.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.neurolearn.backend.model.Question;
import com.neurolearn.backend.model.Student;
import com.neurolearn.backend.model.Topic;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DataService {

    @Value("${app.data.storage-path}")
    private String storagePath;

    private final ObjectMapper objectMapper;
    private final Map<String, Student> students = new ConcurrentHashMap<>();
    private final Map<String, Topic> topics = new ConcurrentHashMap<>();

    private File studentsFile;
    private File topicsFile;

    public DataService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    @PostConstruct
    public void init() throws IOException {
        File dataDir = new File(storagePath);
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }

        studentsFile = new File(dataDir, "students.json");
        topicsFile = new File(dataDir, "topics.json");

        loadData();
    }

    private void loadData() throws IOException {
        if (studentsFile.exists()) {
            List<Student> studentList = objectMapper.readValue(studentsFile, new TypeReference<List<Student>>() {});
            students.putAll(studentList.stream().collect(Collectors.toMap(Student::getId, Function.identity())));
        }

        if (topicsFile.exists()) {
            List<Topic> topicList = objectMapper.readValue(topicsFile, new TypeReference<List<Topic>>() {});
            topics.putAll(topicList.stream().collect(Collectors.toMap(Topic::getId, Function.identity())));
        } else {
            // Seed initial data if topics file doesn't exist
            seedTopics();
        }
    }

    private void seedTopics() {
        // Class 6 Topics
        createAndSaveTopic("topic-6-1", "Basic Fractions", "Mathematics", List.of(6));
        createAndSaveTopic("topic-6-2", "Plants & Roots", "Science", List.of(6));
        
        // Class 7 Topics
        createAndSaveTopic("topic-7-1", "Integers", "Mathematics", List.of(7));
        createAndSaveTopic("topic-7-2", "Acids, Bases and Salts", "Science", List.of(7));

        // Class 8 Topics
        createAndSaveTopic("topic-8-1", "Rational Numbers", "Mathematics", List.of(8));
        createAndSaveTopic("topic-8-2", "Force and Pressure", "Science", List.of(8));

        // Class 9 Topics
        createAndSaveTopic("topic-9-1", "Polynomials", "Mathematics", List.of(9));
        createAndSaveTopic("topic-9-2", "Motion", "Science", List.of(9));

        // Class 10 Topics
        createAndSaveTopic("topic-10-1", "Trigonometry", "Mathematics", List.of(10));
        createAndSaveTopic("topic-10-2", "Electricity", "Science", List.of(10));
    }

    private void createAndSaveTopic(String id, String name, String subject, List<Integer> grades) {
        Topic topic = new Topic();
        topic.setId(id);
        topic.setName(name);
        topic.setSubject(subject);
        topic.setGradeLevels(grades);
        
        // Add sample questions (reusing same logic for simplicity, in real app would differ)
        List<Question> questions = new ArrayList<>();
        questions.add(createQuestion(id + "-q1", "Sample Question for " + name, List.of("Option A", "Option B", "Option C", "Option D"), 0, Question.Difficulty.EASY));
        questions.add(createQuestion(id + "-q2", "Harder Question for " + name, List.of("Option A", "Option B", "Option C", "Option D"), 1, Question.Difficulty.MEDIUM));
        
        topic.setQuestions(questions);
        saveTopic(topic);
    }

    private Question createQuestion(String id, String text, List<String> options, int properIndex, Question.Difficulty diff) {
        Question q = new Question();
        q.setId(id);
        q.setText(text);
        q.setOptions(options);
        q.setCorrectOptionIndex(properIndex);
        q.setDifficulty(diff);
        return q;
    }

    public void saveData() {
        try {
            objectMapper.writeValue(studentsFile, new ArrayList<>(students.values()));
            objectMapper.writeValue(topicsFile, new ArrayList<>(topics.values()));
        } catch (IOException e) {
            e.printStackTrace(); // Log this properly in production
        }
    }

    // CRUD operations
    public List<Student> getAllStudents() {
        return new ArrayList<>(students.values());
    }

    public Student getStudent(String id) {
        return students.get(id);
    }
    
    public Student getStudentByUsername(String username) {
        return students.values().stream()
                .filter(s -> s.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }

    public void saveStudent(Student student) {
        students.put(student.getId(), student);
        saveData();
    }

    public List<Topic> getAllTopics() {
        return new ArrayList<>(topics.values());
    }

    public Topic getTopic(String id) {
        return topics.get(id);
    }

    public void saveTopic(Topic topic) {
        topics.put(topic.getId(), topic);
        saveData();
    }
}
