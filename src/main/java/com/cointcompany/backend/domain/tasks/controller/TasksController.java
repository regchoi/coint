package com.cointcompany.backend.domain.tasks.controller;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.service.ProjectsService;
import com.cointcompany.backend.domain.tasks.dto.TasksDto;
import com.cointcompany.backend.domain.tasks.entity.Tasks;
import com.cointcompany.backend.domain.tasks.service.TasksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "업무", description = "업무 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/task")
@CrossOrigin
public class TasksController {

    private final TasksService tasksService;
    private final ModelMapper modelMapper;

    @Operation(summary = "업무 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<TasksDto.GetTaskRes>> getProjects (Authentication authentication) {
        UserDetailsImpl users = (UserDetailsImpl) authentication.getPrincipal();
        List<TasksDto.GetTaskRes> taskResList = tasksService.getTasks(users.getUserId());

        return new ResponseEntity<>(taskResList, HttpStatus.OK);
    }

    @Operation(summary = "업무 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/{projectId}")
    public ResponseEntity<Long> postTasks (
            @PathVariable Long projectId,
            @RequestBody TasksDto.PostTaskReq postTaskReq
    ) {
        return new ResponseEntity<>(tasksService.saveTasks(postTaskReq, projectId).getIdNum(), HttpStatus.OK);
    }

    @Operation(summary = "업무 사용자 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/user/{projectId}")
    public ResponseEntity<String> postTasksUser (
            @RequestBody List<TasksDto.TaskUserDto> taskUserDtoList
    ) {

        tasksService.saveTaskUser(taskUserDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "업무 부서 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/department/{projectId}")
    public ResponseEntity<String> postTasksDepartment (
            @RequestBody List<TasksDto.TasksDepartmentDto> tasksDepartmentDtoList
    ) {

        tasksService.saveTaskDepartment(tasksDepartmentDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "업무 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/{pojectId}")
    public ResponseEntity<String> putTasks (
            @PathVariable Long projectId,
            @RequestBody TasksDto.PostTaskReq postTaskReq
    ) {

        tasksService.modifyTasks(postTaskReq, projectId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "업무 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @GetMapping("/{projectId}/delete/{taskId}")
    public ResponseEntity<String> deleteUserGroups (
            @PathVariable Long taskId
    ) {

        tasksService.deleteTasks(taskId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}