package com.cointcompany.backend.domain.email.controller;


import com.cointcompany.backend.domain.email.service.EmailMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "메일", description = "메일 API 명세서")
@Slf4j
@RestController
@RequestMapping("/api/mail")
public class EmailMessage {

    private final EmailMessageService emailService;

    public EmailMessage(EmailMessageService emailService) {
        this.emailService = emailService;
    }

    @Operation(summary = "프로젝트 승인 요청 메일")
    @ApiResponse(responseCode = "200", description = "요청 성공")
    @PostMapping("/project")
    public ResponseEntity<String> sendEmail(@RequestBody com.cointcompany.backend.domain.email.dto.EmailMessage.EmailMessageDto emailMessageDto) {
        emailService.sendEmail(emailMessageDto);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
