package com.cointcompany.backend.domain.templatetasks.controller;

import com.cointcompany.backend.domain.templatetasks.dto.TemplateTasksDto;
import com.cointcompany.backend.domain.templatetasks.service.TemplateTasksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "템플릿_업무", description = "템플릿_업무 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/template/task")
public class TemplateTasksController {

    private final TemplateTasksService templateTasksService;

    // TemplateTask
    @Operation(summary = "업무 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/{templateId}")
    public ResponseEntity<Long> createTemplateTask (
            @PathVariable Long templateId,
            @RequestBody TemplateTasksDto.TasksDto tasksDto
    ) {
        return new ResponseEntity<>(templateTasksService.saveTemplateTask(templateId, tasksDto).getIdNum(), HttpStatus.OK);
    }

    @Operation(summary = "업무 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/{templateId}")
    public ResponseEntity<String> updateTemplateTask (
            @PathVariable Long templateId,
            @RequestBody List<TemplateTasksDto.TasksDto> tasksDtoList
    ) {
        templateTasksService.updateTemplateTask(templateId, tasksDtoList);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    // TemplateTaskUser
    @Operation(summary = "업무 작업자 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/user/{templateId}")
    public ResponseEntity<String> createTemplateTaskUser (
            @PathVariable Long templateId,
            @RequestBody TemplateTasksDto.TemplateTaskUsersDto tasksUserDto
    ) {
        templateTasksService.saveTemplateTaskUser(templateId, tasksUserDto);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "업무 작업자 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/user/{taskId}")
    public ResponseEntity<String> updateTemplateTaskUser (
            @PathVariable Long taskId,
            @RequestBody List<TemplateTasksDto.TemplateTaskUsersDto> tasksUserDtoList
    ) {
        templateTasksService.updateTemplateTaskUser(taskId, tasksUserDtoList);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

}
