package com.nupur.taskflow.controller;

import com.nupur.taskflow.model.Task;
import com.nupur.taskflow.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET /tasks — get all my tasks
    @GetMapping
    public ResponseEntity<?> getAllTasks(Authentication auth) {
        return ResponseEntity.ok(taskService.getAllTasks(auth.getName()));
    }

    // POST /tasks — create a task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(auth.getName(), task));
    }

    // PUT /tasks/{id} — update a task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                         @RequestBody Task task,
                                         Authentication auth) {
        try {
            return ResponseEntity.ok(taskService.updateTask(auth.getName(), id, task));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /tasks/{id} — delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication auth) {
        try {
            taskService.deleteTask(auth.getName(), id);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /tasks/stats — get task counts by status
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        return ResponseEntity.ok(taskService.getStats(auth.getName()));
    }
}