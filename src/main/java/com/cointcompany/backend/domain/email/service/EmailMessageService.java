package com.cointcompany.backend.domain.email.service;

import com.cointcompany.backend.domain.email.dto.EmailMessage;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailMessageService {

    private final JavaMailSender javaMailSender;

    public EmailMessageService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(EmailMessage.EmailMessageDto emailMessageDto) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("chami0205@gmail.com");
            helper.setTo(emailMessageDto.getTo());
            helper.setSubject(emailMessageDto.getSubject());
            helper.setText(emailMessageDto.getHtml(), true);
        } catch (Exception e) {
            log.error("이메일 전송 실패", e);
            throw new RuntimeException(e);
        }
        javaMailSender.send(message);
    }

}
