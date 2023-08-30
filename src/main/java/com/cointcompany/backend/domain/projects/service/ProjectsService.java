package com.cointcompany.backend.domain.projects.service;

import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.ProjectDepartment;
import com.cointcompany.backend.domain.projects.entity.ProjectRoles;
import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.repository.ProjectDepartmentRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectRolesRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectUserRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectsRepository;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.users.entity.Users;
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
    private final ProjectRolesRepository projectRolesRepository;
    private final DepartmentsRepository departmentsRepository;
    private final UsersRepository usersRepository;


    @Transactional(readOnly = true)
    public List<ProjectsDto.GetProjectRes> getProjects(Long userId) {

        List<ProjectUser> projectUserList = projectUserRepository.findProjectUserByUsers_IdNum(userId);
        List<ProjectsDto.GetProjectRes> getProjectResList = new ArrayList<>();

        for (ProjectUser projectUser : projectUserList) {
            ProjectsDto.GetProjectRes getProjectRes =
                    new ProjectsDto.GetProjectRes(projectsRepository.findById(projectUser.getProjects().getIdNum()).orElseThrow(null));
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
    public String saveProjectUser(List<ProjectsDto.ProjectUserDto> projectUserDtoList) {

        List<ProjectUser> projectUsersToSave = new ArrayList<>();

        for (ProjectsDto.ProjectUserDto userDto : projectUserDtoList) {

            // 프로젝트, 사용자, 그리고 프로젝트 역할을 조회합니다.
            Projects project = projectsRepository.findById(userDto.getProjectId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found for ID: " + userDto.getProjectId()));

            Users user = usersRepository.findById(userDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + userDto.getUserId()));

            ProjectRoles projectRole = projectRolesRepository.findById(userDto.getProjectRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found for id: " + userDto.getProjectRoleId()));

            ProjectUser projectUser = ProjectUser.of(projectRole, project, user);
            projectUsersToSave.add(projectUser);
        }

        projectUserRepository.saveAll(projectUsersToSave);

        return "SUCCESS";
    }



    @Transactional
    public void modifyProjects (Projects getProjectRes) {

        Projects projects = projectsRepository.findById(getProjectRes.getIdNum()).orElseThrow();
        projects.setProjectName(getProjectRes.getProjectName());
        projects.setDescription(getProjectRes.getDescription());
        projects.setStartDate(getProjectRes.getStartDate());
        projects.setEndDate(getProjectRes.getEndDate());
        projects.setStatus(getProjectRes.getStatus());

    }
    @Transactional
    public void deleteProjects (Long projectId) {

        projectsRepository.deleteById(projectId);

    }
}
