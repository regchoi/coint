package com.cointcompany.backend.domain.tasks.controller;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.service.ProjectsService;
import com.cointcompany.backend.domain.tasks.dto.TasksDto;
import com.cointcompany.backend.domain.tasks.entity.Tasks;
import com.cointcompany.backend.domain.tasks.service.TasksService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/task")
@CrossOrigin
public class TasksController {

    private final TasksService tasksService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<TasksDto.GetTaskRes>> getProjects (Authentication authentication) {
        UserDetailsImpl users = (UserDetailsImpl) authentication.getPrincipal();
        List<TasksDto.GetTaskRes> taskResList = tasksService.getTasks(users.getUserId());

        return new ResponseEntity<>(taskResList, HttpStatus.OK);
    }
    @PostMapping("/{projectId}")
    public ResponseEntity<Long> postTasks (
            @PathVariable Long projectId,
            @RequestBody TasksDto.PostTaskReq postTaskReq
    ) {
        return new ResponseEntity<>(tasksService.saveTasks(postTaskReq, projectId).getIdNum(), HttpStatus.OK);
    }
    @PostMapping("/user/{projectId}")
    public ResponseEntity<String> postTasksUser (
            @RequestBody List<TasksDto.TaskUserDto> taskUserDtoList
    ) {

        tasksService.saveTaskUser(taskUserDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/department/{projectId}")
    public ResponseEntity<String> postTasksDepartment (
            @RequestBody List<TasksDto.TasksDepartmentDto> tasksDepartmentDtoList
    ) {

        tasksService.saveTaskDepartment(tasksDepartmentDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping("/{pojectId}")
    public ResponseEntity<String> putTasks (
            @PathVariable Long projectId,
            @RequestBody TasksDto.PostTaskReq postTaskReq
    ) {

        tasksService.modifyTasks(postTaskReq, projectId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @GetMapping("/{projectId}/delete/{taskId}")
    public ResponseEntity<String> deleteUserGroups (
            @PathVariable Long taskId
    ) {

        tasksService.deleteTasks(taskId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}