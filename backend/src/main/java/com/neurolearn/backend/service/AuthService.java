package com.neurolearn.backend.service;

import com.neurolearn.backend.model.Student;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final DataService dataService;

    public AuthService(DataService dataService) {
        this.dataService = dataService;
    }

    public Student register(String username, String password, int grade) {
        if (dataService.getStudentByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        Student student = new Student();
        student.setId(UUID.randomUUID().toString());
        student.setUsername(username);
        student.setPassword(password); // Simple storage as requested
        student.setGradeLevel(grade);
        dataService.saveStudent(student);
        return student;
    }

    public Student login(String username, String password) {
        Student student = dataService.getStudentByUsername(username);
        if (student != null && student.getPassword().equals(password)) {
            return student;
        }
        return null; // Or throw exception
    }
}
