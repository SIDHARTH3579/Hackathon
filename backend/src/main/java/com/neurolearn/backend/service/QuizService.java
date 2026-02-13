package com.neurolearn.backend.service;

import com.neurolearn.backend.model.Question;
import com.neurolearn.backend.model.QuizAttempt;
import com.neurolearn.backend.model.Student;
import com.neurolearn.backend.model.Topic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final DataService dataService;

    public QuizService(DataService dataService) {
        this.dataService = dataService;
    }

    public List<Question> generateQuiz(String studentId, String topicId) {
        Student student = dataService.getStudent(studentId);
        Topic topic = dataService.getTopic(topicId);
        
        if (student == null || topic == null) {
            throw new IllegalArgumentException("Invalid student or topic");
        }

        Question.Difficulty currentDifficulty = student.getTopicDifficulty().getOrDefault(topicId, Question.Difficulty.MEDIUM);
        
        // Adaptive Logic: Fetch questions matching difficulty, but verify availability
        List<Question> eligibleQuestions = topic.getQuestions().stream()
                .filter(q -> q.getDifficulty() == currentDifficulty)
                .collect(Collectors.toList());
        
        // Fallback if not enough questions in that difficulty: mix in others
        if (eligibleQuestions.size() < 5) {
             List<Question> otherQuestions = topic.getQuestions().stream()
                .filter(q -> q.getDifficulty() != currentDifficulty)
                .collect(Collectors.toList());
             eligibleQuestions.addAll(otherQuestions);
        }

        Collections.shuffle(eligibleQuestions);
        return eligibleQuestions.stream().limit(10).collect(Collectors.toList());
    }

    public QuizAttempt submitQuiz(String studentId, String topicId, List<String> userAnswers) { 
        // Note: userAnswers logic needs to be robust (map questionId -> answer). 
        // For simplicity assuming we receive a QuizAttempt object or structured data.
        // Let's refactor to accept a partial Attempt object.
        return null;
    }

    public QuizAttempt processAttempt(String studentId, String topicId, Map<String, Integer> answers) {
        Student student = dataService.getStudent(studentId);
        Topic topic = dataService.getTopic(topicId);
        
        int correct = 0;
        int total = answers.size();
        List<String> questionIds = new ArrayList<>(answers.keySet());
        
        for (Map.Entry<String, Integer> entry : answers.entrySet()) {
            String qId = entry.getKey();
            Integer selectedOption = entry.getValue();
            
            Question q = topic.getQuestions().stream().filter(qu -> qu.getId().equals(qId)).findFirst().orElse(null);
            if (q != null && q.getCorrectOptionIndex() == selectedOption) {
                correct++;
            }
        }
        
        double score = (total == 0) ? 0 : ((double) correct / total) * 100;
        
        QuizAttempt attempt = new QuizAttempt();
        attempt.setId(UUID.randomUUID().toString());
        attempt.setStudentId(studentId);
        attempt.setTopicId(topicId);
        attempt.setTotalQuestions(total);
        attempt.setCorrectAnswers(correct);
        attempt.setScore(score);
        attempt.setTimestamp(LocalDateTime.now());
        attempt.setQuestionIdsAttempted(questionIds);
        
        student.getAttempts().add(attempt);
        
        updateMasteryAndDifficulty(student, topicId);
        
        dataService.saveStudent(student);
        return attempt;
    }

    private void updateMasteryAndDifficulty(Student student, String topicId) {
        // Mastery Formula: Average of last 3 attempts
        List<QuizAttempt> recentAttempts = student.getAttempts().stream()
                .filter(a -> a.getTopicId().equals(topicId))
                .sorted(Comparator.comparing(QuizAttempt::getTimestamp).reversed())
                .limit(3)
                .collect(Collectors.toList());
        
        if (recentAttempts.isEmpty()) return;

        double avgScore = recentAttempts.stream().mapToDouble(QuizAttempt::getScore).average().orElse(0.0);
        student.getMasteryScores().put(topicId, avgScore);

        // Adaptive Difficulty Logic
        Question.Difficulty currentDiff = student.getTopicDifficulty().getOrDefault(topicId, Question.Difficulty.MEDIUM);
        Question.Difficulty newDiff = currentDiff;

        if (avgScore < 50) {
            if (currentDiff == Question.Difficulty.MEDIUM) newDiff = Question.Difficulty.EASY;
            else if (currentDiff == Question.Difficulty.HARD) newDiff = Question.Difficulty.MEDIUM;
        } else if (avgScore > 80) {
            if (currentDiff == Question.Difficulty.EASY) newDiff = Question.Difficulty.MEDIUM;
            else if (currentDiff == Question.Difficulty.MEDIUM) newDiff = Question.Difficulty.HARD;
        }
        // 50-80% -> keep same ID (User said medium, but logic implies maintaining current unless boundary crossed? 
        // Requirement: "Accuracy between 50-80% -> medium". This implies force set to medium? 
        // Or implies if currently executing at that range, it stays/moves to medium. 
        // Let's assume standard adaptive: if performing well, increase. If poor, decrease. 
        // The prompt says "Accuracy between 50-80% -> medium". This might mean strict mapping.
        // Let's implement strict mapping logic if that's what's meant, but usually it's "Maintain".
        // Let's stick to "Maintain if 50-80".
        // Actually, let's follow the prompt strictly: "Accuracy between 50–80% -> medium"
        
        if (avgScore >= 50 && avgScore <= 80) {
             newDiff = Question.Difficulty.MEDIUM;
        }
        
        student.getTopicDifficulty().put(topicId, newDiff);
    }
}
