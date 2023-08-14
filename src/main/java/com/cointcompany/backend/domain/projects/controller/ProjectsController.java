package com.cointcompany.backend.domain.projects.controller;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.service.ProjectsService;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.users.entity.Users;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/project")
@CrossOrigin
public class ProjectsController {

    private final ProjectsService projectsService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<ProjectsDto.GetProjectRes>> getProjects (Authentication authentication) {
        UserDetailsImpl users = (UserDetailsImpl) authentication.getPrincipal();
        List<ProjectsDto.GetProjectRes> projectsList = projectsService.getProjects(users.getUserId());

        return new ResponseEntity<>(projectsList, HttpStatus.OK);
    }
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
    @PostMapping("/user/{projectId}")
    public ResponseEntity<String> postProjectsUser (
            @RequestBody List<ProjectsDto.ProjectUserDto> projectUserDtoList
    ) {

        projectsService.saveProjectUser(projectUserDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/department/{projectId}")
    public ResponseEntity<String> postProjectsDepartment (
            @RequestBody List<ProjectsDto.ProjectDepartmentDto> projectDepartmentDtoList
    ) {

        projectsService.saveProjectDepartment(projectDepartmentDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

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
    @GetMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteUserGroups (@PathVariable Long projectId) {

        projectsService.deleteProjects(projectId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}