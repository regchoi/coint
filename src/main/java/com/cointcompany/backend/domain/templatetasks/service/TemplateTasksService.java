package com.cointcompany.backend.domain.templatetasks.service;

import com.cointcompany.backend.domain.templates.repository.TemplatesRepository;
import com.cointcompany.backend.domain.templatetasks.dto.TemplateTasksDto;
import com.cointcompany.backend.domain.templatetasks.entity.TemplateTasks;
import com.cointcompany.backend.domain.templatetasks.repository.TemplateTasksRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TemplateTasksService {

    private final TemplateTasksRepository templateTasksRepository;
    private final TemplatesRepository templatesRepository;

    private final ModelMapper modelMapper;

    // TemplateTask
    public TemplateTasks saveTemplateTask(Long templateId, TemplateTasksDto.TasksDto templateTasks) {

        TemplateTasks templateTask = modelMapper.map(templateTasks, TemplateTasks.class);
        templateTask.setTemplates(templatesRepository.findById(templateId).orElseThrow());

        return templateTasksRepository.save(templateTask);
    }

    public String updateTemplateTask(Long templateId, List<TemplateTasksDto.TasksDto> templateTasksList) {

        return "SUCCESS";
    }
}
