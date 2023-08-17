package com.cointcompany.backend.domain.projects.controller;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.service.ProjectsService;
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

@Tag(name = "프로젝트", description = "프로젝트 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/project")
@CrossOrigin
public class ProjectsController {

    private final ProjectsService projectsService;
    private final ModelMapper modelMapper;

    @Operation(summary = "프로젝트 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<ProjectsDto.GetProjectRes>> getProjects (Authentication authentication) {
        UserDetailsImpl users = (UserDetailsImpl) authentication.getPrincipal();
        List<ProjectsDto.GetProjectRes> projectsList = projectsService.getProjects(users.getUserId());

        return new ResponseEntity<>(projectsList, HttpStatus.OK);
    }

    @Operation(summary = "프로젝트 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<Long> postProjects (@RequestBody ProjectsDto.GetProjectRes getProjectRes) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(getProjectRes.getStartDate(), formatter);
        LocalDate endDate = LocalDate.parse(getProjectRes.getEndDate(), formatter);

        Projects project = modelMapper.map(getProjectRes, Projects.class);
        project.setStartDate(startDate);
        project.setEndDate(endDate);
        return new ResponseEntity<>(projectsService.saveProjects(project).getIdNum(), HttpStatus.OK);
    }

    @Operation(summary = "프로젝트 사용자 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/user/{projectId}")
    public ResponseEntity<String> postProjectsUser (
            @RequestBody List<ProjectsDto.ProjectUserDto> projectUserDtoList
    ) {

        projectsService.saveProjectUser(projectUserDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "프로젝트 부서 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/department/{projectId}")
    public ResponseEntity<String> postProjectsDepartment (
            @RequestBody List<ProjectsDto.ProjectDepartmentDto> projectDepartmentDtoList
    ) {

        projectsService.saveProjectDepartment(projectDepartmentDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "프로젝트 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping
    public ResponseEntity<String> putProjects (@RequestBody ProjectsDto.GetProjectRes getProjectRes) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(getProjectRes.getStartDate(), formatter);
        LocalDate endDate = LocalDate.parse(getProjectRes.getEndDate(), formatter);

        Projects project = modelMapper.map(getProjectRes, Projects.class);
        project.setStartDate(startDate);
        project.setEndDate(endDate);

        projectsService.modifyProjects(project);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "프로젝트 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @GetMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteProjects (@PathVariable Long projectId) {

        projectsService.deleteProjects(projectId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}