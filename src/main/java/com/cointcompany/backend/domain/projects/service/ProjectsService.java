package com.cointcompany.backend.domain.projects.service;

import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.ProjectDepartment;
import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.repository.ProjectDepartmentRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectUserRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectsRepository;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProjectsService {

    private final ProjectsRepository projectsRepository;
    private final ProjectDepartmentRepository projectDepartmentRepository;
    private final ProjectUserRepository projectUserRepository;
    private final DepartmentsRepository departmentsRepository;
    private final UsersRepository usersRepository;


    @Transactional(readOnly = true)
    public List<ProjectsDto.GetProjectRes> getProjects(Long userId) {

        List<ProjectUser> projectUserList = projectUserRepository.findProjectUserByUsers_IdNum(userId);
        for (ProjectUser projectUser : projectUserList) {
            log.info("userID = {}", projectUser.getUsers().getIdNum());
            log.info("projectID = {}", projectUser.getProjects().getIdNum());
        }

        List<ProjectsDto.GetProjectRes> getProjectResList = new ArrayList<>();

        for (ProjectUser projectUser : projectUserList) {
            ProjectsDto.GetProjectRes getProjectRes =
                    new ProjectsDto.GetProjectRes(projectsRepository.findById(projectUser.getProjects().getIdNum()).orElseThrow());
            getProjectResList.add(getProjectRes);
        }

        return getProjectResList;
    }
    @Transactional
    public Projects saveProjects(Projects projects) {

        return projectsRepository.save(projects);
    }
    @Transactional
    public String saveProjectDepartment (List<ProjectsDto.ProjectDepartmentDto> projectDepartmentDtoList) {

        for (ProjectsDto.ProjectDepartmentDto projectDepartmentDto : projectDepartmentDtoList) {
            ProjectDepartment projectDepartment = ProjectDepartment.of(
                    projectDepartmentDto.getRole(),
                    projectsRepository.findById(projectDepartmentDto.getProjectId()).orElseThrow(),
                    departmentsRepository.findById(projectDepartmentDto.getDepartmentId()).orElseThrow()
            );
            projectDepartmentRepository.save(projectDepartment);
        }

        return "SUCCESS";
    }
    @Transactional
    public String saveProjectUser (List<ProjectsDto.ProjectUserDto> projectUserDtoList) {

        for (ProjectsDto.ProjectUserDto userDto : projectUserDtoList) {
            ProjectUser projectUser = ProjectUser.of(
                    userDto.getRole(),
                    projectsRepository.findById(userDto.getProjectId()).orElseThrow(),
                    usersRepository.findById(userDto.getUserId()).orElseThrow()
            );
            projectUserRepository.save(projectUser);
        }

        return "SUCCESS";
    }

    @Transactional
    public void modifyProjects (Projects getProjectRes) {

        Projects projects = projectsRepository.findById(getProjectRes.getIdNum()).orElseThrow();
        projects.setProjectName(projects.getProjectName());
        projects.setDescription(projects.getDescription());
        projects.setStartDate(projects.getStartDate());
        projects.setEndDate(projects.getEndDate());
        projects.setStatus(projects.getStatus());

    }
    @Transactional
    public void deleteProjects (Long projectId) {
        Projects projects = projectsRepository.findById(projectId).orElseThrow();

        projectsRepository.deleteById(projectId);

    }
}
