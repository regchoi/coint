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

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TemplatesService {

    private final TemplatesRepository templatesRepository;
    private final TemplateRolesRepository templateRolesRepository;
    private final TemplateUserRepository templateUserRepository;
    private final UsersRepository usersRepository;

    // Template
    public Templates saveTemplates(Templates template) {
        return templatesRepository.save(template);
    }
    public Templates updateTemplates(TemplatesDto.UpdateTemplate updateTemplate) {
        Templates existTemplate = templatesRepository.findById(updateTemplate.getIdNum()).orElseThrow();
        existTemplate.setTemplateName(updateTemplate.getTemplateName());
        existTemplate.setDescription(updateTemplate.getDescription());
        existTemplate.setPeriod(updateTemplate.getPeriod());

        return templatesRepository.save(existTemplate);
    }


    // TemplateRole
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

    public void updateTemplatesRole(Long templateIdNum, List<TemplatesDto.TemplateRolesDto> templateRolesDtoList) {
        List<TemplateRoles> existTemplateRoles = templateRolesRepository.findByTemplatesIdNum(templateIdNum);

        for(TemplatesDto.TemplateRolesDto dto : templateRolesDtoList) {
            TemplateRoles existingRole = templateRolesRepository.findByRoleLevelAndTemplatesIdNum(dto.getRoleLevel(), templateIdNum).orElse(null);

            if(existingRole == null) {
                // 새로 추가
                Templates templates = templatesRepository.findById(dto.getTemplateId()).orElseThrow();
                TemplateRoles newRole = TemplateRoles.of(
                        templates,
                        dto.getRoleName(),
                        dto.getRoleLevel(),
                        dto.getDescription()
                );
                templateRolesRepository.save(newRole);
            } else {
                // 수정
                existingRole.setRoleName(dto.getRoleName());
                existingRole.setRoleLevel(dto.getRoleLevel());
                existingRole.setDescription(dto.getDescription());

                templateRolesRepository.save(existingRole);
            }
        }

        // existingRoles에서 templateRolesDtoList에 없는 항목 삭제
        for(TemplateRoles role : existTemplateRoles) {
            if(!existsInRoleDtoList(templateRolesDtoList, role)) {
                templateRolesRepository.delete(role);
            }
        }
    }

    private boolean existsInRoleDtoList(List<TemplatesDto.TemplateRolesDto> dtos, TemplateRoles role) {
        return dtos.stream().anyMatch(dto -> dto.getRoleLevel().equals(role.getRoleLevel()));
    }

    // TemplateUser
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

    public void updateTemplatesUser(Long templateIdNum, List<TemplatesDto.TemplateUsersDto> templateUsersDtoList) {
        List<TemplateUser> existTemplateUsers = templateUserRepository.findByTemplatesIdNum(templateIdNum);

        for(TemplatesDto.TemplateUsersDto templateUsersDto : templateUsersDtoList) {
            TemplateUser existingUser = templateUserRepository.findByTemplatesIdNumAndUsersIdNum(templateIdNum, templateUsersDto.getUserId()).orElse(null);

            if(existingUser == null) {
                // 새로 추가
                TemplateUser newUser = TemplateUser.of(
                        templateRolesRepository.findByRoleLevelAndTemplatesIdNum(templateUsersDto.getTemplateRoleId(), templateUsersDto.getTemplateId()).orElseThrow(),
                        templatesRepository.findById(templateUsersDto.getTemplateId()).orElseThrow(),
                        usersRepository.findById(templateUsersDto.getUserId()).orElseThrow()
                );

                templateUserRepository.save(newUser);
            } else {
                // 수정
                existingUser.setTemplates(templatesRepository.findById(templateUsersDto.getTemplateId()).orElseThrow());
                existingUser.setTemplateRoles(templateRolesRepository.findByRoleLevelAndTemplatesIdNum(templateUsersDto.getTemplateRoleId(), templateUsersDto.getTemplateId()).orElse(null));
                existingUser.setUsers(usersRepository.findById(templateUsersDto.getUserId()).orElseThrow());

                templateUserRepository.save(existingUser);
            }

            // existingUsers에서 templateUsersDtoList에 없는 항목 삭제
            for(TemplateUser user : existTemplateUsers) {
                if(!existsInUserDtoList(templateUsersDtoList, user)) {
                    templateUserRepository.delete(user);
                }
            }
        }
    }

    private boolean existsInUserDtoList(List<TemplatesDto.TemplateUsersDto> dtos, TemplateUser user) {
        return dtos.stream().anyMatch(dto -> dto.getUserId().equals(user.getUsers().getIdNum()));
    }
}
