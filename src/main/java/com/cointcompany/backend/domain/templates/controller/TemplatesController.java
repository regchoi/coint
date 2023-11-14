package com.cointcompany.backend.domain.templates.controller;

import com.cointcompany.backend.domain.templates.dto.TemplatesDto;
import com.cointcompany.backend.domain.templates.entity.Templates;
import com.cointcompany.backend.domain.templates.service.TemplatesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "템플릿", description = "템플릿 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/template")
public class TemplatesController {

    private final TemplatesService templatesService;
    private final ModelMapper modelMapper;

    // Template
    @Operation(summary = "템플릿 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<TemplatesDto.GetTemplateListRes>> getTemplates () {
        return new ResponseEntity<>(templatesService.getTemplates(), HttpStatus.OK);
    }

    @Operation(summary = "템플릿 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<Long> postTemplates (@RequestBody TemplatesDto.GetTemplateRes getTemplateRes) {
        Templates template = modelMapper.map(getTemplateRes, Templates.class);
        return new ResponseEntity<>(templatesService.saveTemplates(template).getIdNum(), HttpStatus.OK);
    }

    @Operation(summary = "템플릿 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping
    public ResponseEntity<String> putTemplates (
            @RequestBody TemplatesDto.UpdateTemplate updateTemplate
    ) {
        templatesService.updateTemplates(updateTemplate);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }


    // TemplateRole
    @Operation(summary = "템플릿 권한 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/role/{templateIdNum}")
    public ResponseEntity<List<TemplatesDto.TemplateRolesDto>> getTemplatesRole (
            @PathVariable Long templateIdNum
    ) {
        return new ResponseEntity<>(templatesService.getTemplatesRole(templateIdNum), HttpStatus.OK);
    }

    @Operation(summary = "템플릿 권한 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/role")
    public ResponseEntity<String> postTemplatesRole (
            @RequestBody List<TemplatesDto.TemplateRolesDto> templateRolesDtoList
    ) {

        templatesService.saveTemplatesRole(templateRolesDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "템플릿 권한 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/role/{templateIdNum}")
    public ResponseEntity<String> putTemplatesRole (
            @PathVariable Long templateIdNum,
            @RequestBody List<TemplatesDto.TemplateRolesDto> updateTemplateRole
    ) {

        templatesService.updateTemplatesRole(templateIdNum, updateTemplateRole);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    // TemplateUser
    @Operation(summary = "템플릿 작업자 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/user/{templateIdNum}")
    public ResponseEntity<List<TemplatesDto.TemplateUsersDto>> getTemplatesUser (
            @PathVariable Long templateIdNum
    ) {
        return new ResponseEntity<>(templatesService.getTemplatesUser(templateIdNum), HttpStatus.OK);
    }

    @Operation(summary = "템플릿 작업자 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/user")
    public ResponseEntity<String> postTemplatesUser (
            @RequestBody List<TemplatesDto.TemplateUsersDto> templateUsersDtoList
    ) {

        templatesService.saveTemplatesUser(templateUsersDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "템플릿 작업자 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/user/{templateIdNum}")
    public ResponseEntity<String> putTemplatesUser (
            @PathVariable Long templateIdNum,
            @RequestBody List<TemplatesDto.TemplateUsersDto> updateTemplateUser
    ) {

        templatesService.updateTemplatesUser(templateIdNum, updateTemplateUser);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "템플릿 태그 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/tag/{templateIdNum}")
    public ResponseEntity<String> postTemplatesTag (
            @PathVariable Long templateIdNum,
            @RequestBody List<TemplatesDto.TemplateTagDto> templateTagsDtoList
    ) {
        templatesService.saveTemplatesTag(templateIdNum, templateTagsDtoList);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "템플릿 태그 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/tag")
    public ResponseEntity<List<Long>> getTemplatesTag (
            @RequestParam List<String> tags
    ) {
        List<Long> templateIds = templatesService.getProjectTag(tags);
        return new ResponseEntity<>(templateIds, HttpStatus.OK);
    }
}
