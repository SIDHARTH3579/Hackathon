package com.neurolearn.backend.controller;

import com.neurolearn.backend.model.Student;
import com.neurolearn.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all for prototype
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            int grade = Integer.parseInt(payload.get("grade").toString());
            
            Student student = authService.register(username, password, grade);
            return ResponseEntity.ok(student);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        Student student = authService.login(payload.get("username"), payload.get("password"));
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
