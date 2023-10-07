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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "템플릿", description = "템플릿 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/template")
public class TemplatesController {

    private final TemplatesService templatesService;
    private final ModelMapper modelMapper;

    @Operation(summary = "템플릿 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<Long> postTemplates (@RequestBody TemplatesDto.GetTemplateRes getTemplateRes) {
        Templates template = modelMapper.map(getTemplateRes, Templates.class);
        return new ResponseEntity<>(templatesService.saveTemplates(template).getIdNum(), HttpStatus.OK);
    }



}
