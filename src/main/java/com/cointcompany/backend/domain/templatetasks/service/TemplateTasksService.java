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
    public String saveTemplateTaskUser(Long templateId, TemplateTasksDto.TemplateTaskUsersDto templateTaskUserDto) {

        TemplateTaskUser templateTaskUser = TemplateTaskUser.of(
                templateRolesRepository.findByRoleLevelAndTemplatesIdNum(templateTaskUserDto.getTemplateRoleId(), templateId).orElse(null),
                templateTasksRepository.findById(templateTaskUserDto.getTemplateTaskId()).orElse(null),
                usersRepository.findById(templateTaskUserDto.getUserId()).orElse(null)
        );

        templateTaskUserRepository.save(templateTaskUser);

        return "SUCCESS";
    }


}
