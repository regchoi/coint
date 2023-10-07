package com.cointcompany.backend.domain.templates.dto;

import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class TemplatesDto {

    @NoArgsConstructor
    @Data
    public static class GetTemplateRes {
        private Long idNum;
        private String templateName;
        private String description;
        private Integer period;
        private String regDate;
        private String regUserid;

        public GetTemplateRes (Long idNum, String templateName, String description, Integer period, String regDate, String regUserid) {
            this.idNum = idNum;
            this.templateName = templateName;
            this.description = description;
            this.period = period;
            this.regDate = regDate;
            this.regUserid = regUserid;
        }
    }

}
