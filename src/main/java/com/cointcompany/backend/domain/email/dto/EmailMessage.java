package com.cointcompany.backend.domain.email.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class EmailMessage {

    @NoArgsConstructor
    @Data
    public static class EmailMessageDto {
        private String to;
        private String subject;
        private String html;
    }
}
