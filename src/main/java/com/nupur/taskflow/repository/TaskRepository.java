package com.nupur.taskflow.repository;

import com.nupur.taskflow.model.Task;
import com.nupur.taskflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Get all tasks belonging to a specific user
    List<Task> findByUserOrderByCreatedAtDesc(User user);

    // Get tasks by status for a user
    List<Task> findByUserAndStatus(User user, String status);

    // Find a specific task by id and user (security check)
    Optional<Task> findByIdAndUser(Long id, User user);
}