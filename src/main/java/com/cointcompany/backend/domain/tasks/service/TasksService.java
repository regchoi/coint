package com.cointcompany.backend.domain.tasks.service;

import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.projects.dto.ProjectsDto;
import com.cointcompany.backend.domain.projects.entity.ProjectDepartment;
import com.cointcompany.backend.domain.projects.entity.ProjectUser;
import com.cointcompany.backend.domain.projects.entity.Projects;
import com.cointcompany.backend.domain.projects.repository.ProjectDepartmentRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectUserRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectsRepository;
import com.cointcompany.backend.domain.tasks.dto.TasksDto;
import com.cointcompany.backend.domain.tasks.entity.TaskDepartment;
import com.cointcompany.backend.domain.tasks.entity.TaskTag;
import com.cointcompany.backend.domain.tasks.entity.TaskUser;
import com.cointcompany.backend.domain.tasks.entity.Tasks;
import com.cointcompany.backend.domain.tasks.repository.TaskDepartmentRepository;
import com.cointcompany.backend.domain.tasks.repository.TaskTagRepository;
import com.cointcompany.backend.domain.tasks.repository.TaskUserRepository;
import com.cointcompany.backend.domain.tasks.repository.TasksRepository;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TasksService {

    private final TasksRepository tasksRepository;
    private final ProjectsRepository projectsRepository;
    private final TaskUserRepository taskUserRepository;
    private final TaskDepartmentRepository taskDepartmentRepository;
    private final TaskTagRepository taskTagRepository;
    private final DepartmentsRepository departmentsRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;


    @Transactional(readOnly = true)
    public List<TasksDto.GetTaskRes> getTasks (Long userId) {

        List<TaskUser> taskUserList = taskUserRepository.findTaskUserByUsers_IdNum(userId);
        for (TaskUser taskUser : taskUserList) {
            log.info("userID = {}", taskUser.getUsers().getIdNum());
            log.info("projectID = {}", taskUser.getTasks().getIdNum());
        }

        List<TasksDto.GetTaskRes> getTaskResList = new ArrayList<>();

        for (TaskUser taskUser : taskUserList) {
            TasksDto.GetTaskRes getTaskRes =
                    new TasksDto.GetTaskRes(tasksRepository.findById(taskUser.getTasks().getIdNum()).orElseThrow());
            getTaskResList.add(getTaskRes);
        }

        return getTaskResList;
    }
    @Transactional
    public Tasks saveTasks(TasksDto.PostTaskReq postTaskReq, Long projectId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(postTaskReq.getStartDate(), formatter);
        LocalDate endDate = LocalDate.parse(postTaskReq.getEndDate(), formatter);

        Tasks tasks = modelMapper.map(postTaskReq, Tasks.class);
        tasks.setStartDate(startDate);
        tasks.setEndDate(endDate);

        tasks.setProjects(projectsRepository.findById(projectId).orElseThrow());

        return tasksRepository.save(tasks);
    }
    @Transactional
    public String saveTaskUser (List<TasksDto.TaskUserDto> taskUserDtoList) {

        for (TasksDto.TaskUserDto taskUserDto : taskUserDtoList) {
            TaskUser taskUser = TaskUser.of(
                    taskUserDto.getTaskRoleId(),
                    tasksRepository.findById(taskUserDto.getTaskId()).orElseThrow(),
                    usersRepository.findById(taskUserDto.getUserId()).orElseThrow()
            );
            taskUserRepository.save(taskUser);
        }

        return "SUCCESS";
    }
    @Transactional
    public List<TasksDto.TaskTagDto> saveTaskTag(List<TasksDto.TaskTagDto> taskTagDtoList, Long taskId) {

        // Project의 태그 관리 기능과 동일
        List<TaskTag> existTaskTagList = taskTagRepository.findTaskTagByTask_IdNum(taskId);

        for (TasksDto.TaskTagDto taskTagDto : taskTagDtoList) {
            if (existTaskTagList.stream().noneMatch(taskTag -> taskTag.getTagName().equals(taskTagDto.getTagName()))) {
                TaskTag taskTag = TaskTag.of(
                        tasksRepository.findById(taskId).orElseThrow(),
                        taskTagDto.getTagName()
                );
                taskTagRepository.save(taskTag);
            }
        }

        for (TaskTag taskTag : existTaskTagList) {
            if (taskTagDtoList.stream().noneMatch(taskTagDto -> taskTagDto.getTagName().equals(taskTag.getTagName()))) {
                taskTagRepository.delete(taskTag);
            }
        }

        return taskTagDtoList;
    }
    @Transactional
    public String saveTaskDepartment (List<TasksDto.TasksDepartmentDto> tasksDepartmentDtoList) {

        for (TasksDto.TasksDepartmentDto tasksDepartmentDto : tasksDepartmentDtoList) {
            TaskDepartment taskDepartment = TaskDepartment.of(
                    tasksDepartmentDto.getRole(),
                    tasksRepository.findById(tasksDepartmentDto.getTaskId()).orElseThrow(),
                    departmentsRepository.findById(tasksDepartmentDto.getDepartmentId()).orElseThrow()
            );
            taskDepartmentRepository.save(taskDepartment);
        }

        return "SUCCESS";
    }

    @Transactional
    public void modifyTasks (TasksDto.PostTaskReq postTaskReq, Long projectId) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(postTaskReq.getStartDate(), formatter);
        LocalDate endDate = LocalDate.parse(postTaskReq.getEndDate(), formatter);

        Tasks tasks = modelMapper.map(postTaskReq, Tasks.class);
        tasks.setStartDate(startDate);
        tasks.setEndDate(endDate);

        tasks.setProjects(projectsRepository.findById(projectId).orElseThrow());

        Tasks task = tasksRepository.findById(tasks.getIdNum()).orElseThrow();
        task.setTaskName(tasks.getTaskName());
        task.setDescription(tasks.getDescription());
        task.setStartDate(tasks.getStartDate());
        task.setEndDate(tasks.getEndDate());
        task.setStatus(tasks.getStatus());

    }
    @Transactional
    public void deleteTasks (Long taskId) {

        projectsRepository.deleteById(taskId);

    }
}
