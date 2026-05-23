package com.nupur.taskflow.service;

import com.nupur.taskflow.model.Task;
import com.nupur.taskflow.model.User;
import com.nupur.taskflow.repository.TaskRepository;
import com.nupur.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepo;
    @Autowired private UserRepository userRepo;

    private User getUser(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get all tasks for logged-in user
    public List<Task> getAllTasks(String username) {
        return taskRepo.findByUserOrderByCreatedAtDesc(getUser(username));
    }

    // Create a new task
    public Task createTask(String username, Task task) {
        task.setUser(getUser(username));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepo.save(task);
    }

    // Update a task (only if it belongs to this user)
    public Task updateTask(String username, Long taskId, Task updated) {
        Task task = taskRepo.findByIdAndUser(taskId, getUser(username))
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());
        task.setPriority(updated.getPriority());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepo.save(task);
    }

    // Delete a task (only if it belongs to this user)
    public void deleteTask(String username, Long taskId) {
        Task task = taskRepo.findByIdAndUser(taskId, getUser(username))
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepo.delete(task);
    }

    // Get task stats
    public Map<String, Long> getStats(String username) {
        User user = getUser(username);
        long total = taskRepo.findByUserOrderByCreatedAtDesc(user).size();
        long todo = taskRepo.findByUserAndStatus(user, "TODO").size();
        long inProgress = taskRepo.findByUserAndStatus(user, "IN_PROGRESS").size();
        long done = taskRepo.findByUserAndStatus(user, "DONE").size();
        return Map.of("total", total, "todo", todo, "inProgress", inProgress, "done", done);
    }
}