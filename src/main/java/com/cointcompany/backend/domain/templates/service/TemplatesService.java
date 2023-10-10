package com.cointcompany.backend.domain.templates.service;

import com.cointcompany.backend.domain.templates.dto.TemplatesDto;
import com.cointcompany.backend.domain.templates.entity.TemplateRoles;
import com.cointcompany.backend.domain.templates.entity.TemplateUser;
import com.cointcompany.backend.domain.templates.entity.Templates;
import com.cointcompany.backend.domain.templates.repository.*;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TemplatesService {

    private final TemplatesRepository templatesRepository;
    private final TemplateRolesRepository templateRolesRepository;
    private final TemplateUserRepository templateUserRepository;
    private final UsersRepository usersRepository;

    public Templates saveTemplates(Templates template) {
        return templatesRepository.save(template);
    }

    public void saveTemplatesRole(List<TemplatesDto.TemplateRolesDto> templateRolesDtoList) {

        for(TemplatesDto.TemplateRolesDto templateRolesDto : templateRolesDtoList) {
            TemplateRoles templateRoles = TemplateRoles.of(
                    templatesRepository.findById(templateRolesDto.getTemplateId()).orElseThrow(),
                    templateRolesDto.getRoleName(),
                    templateRolesDto.getRoleLevel(),
                    templateRolesDto.getDescription()
            );
            templateRolesRepository.save(templateRoles);
        }
    }

    public String saveTemplatesUser(List<TemplatesDto.TemplateUsersDto> templateUsersDtoList) {

        for(TemplatesDto.TemplateUsersDto templateUsersDto : templateUsersDtoList) {
            TemplateUser templateUser = TemplateUser.of(
                    templateRolesRepository.findByRoleLevelAndTemplatesIdNum(templateUsersDto.getTemplateRoleId(), templateUsersDto.getTemplateId()).orElseThrow(),
                    templatesRepository.findById(templateUsersDto.getTemplateId()).orElseThrow(),
                    usersRepository.findById(templateUsersDto.getUserId()).orElseThrow()
            );
            templateUserRepository.save(templateUser);
        }

        return "SUCCESS";
    }
}
