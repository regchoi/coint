package com.cointcompany.backend.domain.templatetasks.service;

import com.cointcompany.backend.domain.templates.repository.TemplateRolesRepository;
import com.cointcompany.backend.domain.templates.repository.TemplatesRepository;
import com.cointcompany.backend.domain.templatetasks.dto.TemplateTasksDto;
import com.cointcompany.backend.domain.templatetasks.entity.TemplateTaskUser;
import com.cointcompany.backend.domain.templatetasks.entity.TemplateTasks;
import com.cointcompany.backend.domain.templatetasks.repository.TemplateTaskUserRepository;
import com.cointcompany.backend.domain.templatetasks.repository.TemplateTasksRepository;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class TemplateTasksService {

    private final TemplateTasksRepository templateTasksRepository;
    private final TemplatesRepository templatesRepository;
    private final TemplateRolesRepository templateRolesRepository;
    private final UsersRepository usersRepository;
    private final TemplateTaskUserRepository templateTaskUserRepository;

    private final ModelMapper modelMapper;

    // TemplateTask
    @Transactional(readOnly = true)
    public List<TemplateTasksDto.TasksDto> getTemplateTask(Long templateId) {
        return templateTasksRepository.findAllByTemplates_IdNum(templateId).stream()
                .map(templateTasks -> modelMapper.map(templateTasks, TemplateTasksDto.TasksDto.class))
                .collect(Collectors.toList());
    }

    public TemplateTasks saveTemplateTask(Long templateId, TemplateTasksDto.TasksDto templateTasks) {

        TemplateTasks templateTask = modelMapper.map(templateTasks, TemplateTasks.class);
        templateTask.setTemplates(templatesRepository.findById(templateId).orElseThrow());

        return templateTasksRepository.save(templateTask);
    }

    public String updateTemplateTask(Long templateId, List<TemplateTasksDto.TasksDto> templateTasksList) {
        // 같은 templateId를 가진 업무들을 전부 조회한 뒤
        List<TemplateTasks> existingTemplateTasks = templateTasksRepository.findAllByTemplates_IdNum(templateId);

        for(TemplateTasksDto.TasksDto taskDto : templateTasksList) {
            TemplateTasks existingTask = templateTasksRepository.findById(taskDto.getIdNum()).orElse(null);

            if(existingTask == null) {
                // 새로 추가
                TemplateTasks newTask = TemplateTasks.of(
                        taskDto.getTaskName(),
                        taskDto.getDescription(),
                        taskDto.getPeriod(),
                        taskDto.getOffsetDay(),
                        templatesRepository.findById(templateId).orElseThrow()
                );

                templateTasksRepository.save(newTask);
            } else {
                // 수정
                existingTask.setTaskName(taskDto.getTaskName());
                existingTask.setDescription(taskDto.getDescription());
                existingTask.setPeriod(taskDto.getPeriod());
                existingTask.setOffsetDay(taskDto.getOffsetDay());

                templateTasksRepository.save(existingTask);
            }
        }

        // existingTemplateTasks에서 templateTasksList에 없는 항목 삭제
        for(TemplateTasks task : existingTemplateTasks) {
            if(!existsInTasksDtoList(templateTasksList, task)) {
                templateTasksRepository.delete(task);
            }
        }

        return "SUCCESS";
    }
    private boolean existsInTasksDtoList(List<TemplateTasksDto.TasksDto> dtos, TemplateTasks task) {
        return dtos.stream().anyMatch(dto -> dto.getIdNum().equals(task.getIdNum()));
    }

    // TemplateTaskUser
    @Transactional(readOnly = true)
    public List<TemplateTasksDto.TemplateTaskUsersDto> getTemplateTaskUser(Long taskId) {
        List<TemplateTaskUser> templateTaskUsers = templateTaskUserRepository.findAllByTemplateTasks_IdNum(taskId);
        List<TemplateTasksDto.TemplateTaskUsersDto> templateTaskUsersDtoList = new ArrayList<>();

        for(TemplateTaskUser templateTaskUser : templateTaskUsers) {
            TemplateTasksDto.TemplateTaskUsersDto templateTaskUsersDto = new TemplateTasksDto.TemplateTaskUsersDto(
                    templateTaskUser.getIdNum(),
                    templateTaskUser.getTemplateTasks().getIdNum(),
                    templateTaskUser.getTemplateRoles().getRoleLevel()
            );
            templateTaskUsersDtoList.add(templateTaskUsersDto);
        }

        return templateTaskUsersDtoList;

    }

    public String saveTemplateTaskUser(Long templateId, TemplateTasksDto.TemplateTaskUsersDto templateTaskUserDto) {

        TemplateTaskUser templateTaskUser = TemplateTaskUser.of(
                templateRolesRepository.findByRoleLevelAndTemplatesIdNum(templateTaskUserDto.getTemplateRoleId(), templateId).orElse(null),
                templateTasksRepository.findById(templateTaskUserDto.getTemplateTaskId()).orElse(null),
                usersRepository.findById(templateTaskUserDto.getUserId()).orElse(null)
        );

        templateTaskUserRepository.save(templateTaskUser);

        return "SUCCESS";
    }

    public void updateTemplateTaskUser(Long taskId, List<TemplateTasksDto.TemplateTaskUsersDto> templateTaskUserDto) {
        // 같은 taskId를 가진 업무들을 전부 조회한 뒤
        List<TemplateTaskUser> existingTemplateTaskUsers = templateTaskUserRepository.findAllByTemplateTasks_IdNum(taskId);

        for(TemplateTasksDto.TemplateTaskUsersDto taskUserDto : templateTaskUserDto) {
            TemplateTaskUser existingTaskUser = templateTaskUserRepository.findByTemplateTasksIdNumAndUsersIdNum(taskId, taskUserDto.getUserId()).orElse(null);

            if(existingTaskUser == null) {
                // 새로 추가
                TemplateTaskUser newTaskUser = TemplateTaskUser.of(
                        templateRolesRepository.findByRoleLevelAndTemplatesIdNum(taskUserDto.getTemplateRoleId(), taskId).orElse(null),
                        templateTasksRepository.findById(taskId).orElse(null),
                        usersRepository.findById(taskUserDto.getUserId()).orElse(null)
                );

                templateTaskUserRepository.save(newTaskUser);
            } else {
                // 수정
                existingTaskUser.setTemplateRoles(templateRolesRepository.findByRoleLevelAndTemplatesIdNum(taskUserDto.getTemplateRoleId(), taskId).orElse(null));
                existingTaskUser.setTemplateTasks(templateTasksRepository.findById(taskId).orElse(null));
                existingTaskUser.setUsers(usersRepository.findById(taskUserDto.getUserId()).orElse(null));

                templateTaskUserRepository.save(existingTaskUser);
            }

            // existingTemplateTaskUsers에서 templateTaskUserDto에 없는 항목 삭제
            for(TemplateTaskUser taskUser : existingTemplateTaskUsers) {
                if(!existsInTaskUserDtoList(templateTaskUserDto, taskUser)) {
                    templateTaskUserRepository.delete(taskUser);
                }
            }
        }
    }

    private boolean existsInTaskUserDtoList(List<TemplateTasksDto.TemplateTaskUsersDto> dtos, TemplateTaskUser taskUser) {
        return dtos.stream().anyMatch(dto -> dto.getUserId().equals(taskUser.getUsers().getIdNum()));
    }


}
