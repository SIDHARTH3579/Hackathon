package com.neurolearn.backend.controller;

import com.neurolearn.backend.model.Question;
import com.neurolearn.backend.model.QuizAttempt;
import com.neurolearn.backend.model.Student;
import com.neurolearn.backend.model.Topic;
import com.neurolearn.backend.service.DataService;
import com.neurolearn.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {

    private final DataService dataService;
    private final QuizService quizService;

    public QuizController(DataService dataService, QuizService quizService) {
        this.dataService = dataService;
        this.quizService = quizService;
    }

    @GetMapping("/topics")
    public List<Topic> getAllTopics() {
        return dataService.getAllTopics();
    }

    @GetMapping("/topics/{id}")
    public Topic getTopic(@PathVariable String id) {
        return dataService.getTopic(id);
    }

    // Example: /api/quiz/generate?topicId=topic-1&studentId=result-uuid
    @GetMapping("/quiz/generate")
    public ResponseEntity<List<Question>> generateQuiz(@RequestParam String topicId, @RequestParam String studentId) {
        try {
            return ResponseEntity.ok(quizService.generateQuiz(studentId, topicId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(@RequestBody Map<String, Object> payload) {
        String studentId = (String) payload.get("studentId");
        String topicId = (String) payload.get("topicId");
        Map<String, Integer> answers = (Map<String, Integer>) payload.get("answers");

        return ResponseEntity.ok(quizService.processAttempt(studentId, topicId, answers));
    }
    
    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable String id) {
        Student student = dataService.getStudent(id);
        if (student != null) return ResponseEntity.ok(student);
        return ResponseEntity.notFound().build();
    }
}
