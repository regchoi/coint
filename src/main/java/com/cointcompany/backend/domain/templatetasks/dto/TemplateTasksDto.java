package com.cointcompany.backend.domain.templatetasks.dto;


import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class TemplateTasksDto {

    @NoArgsConstructor
    @Data
    public static class TasksDto {
        private Long idNum;
        private String taskName;
        private String description;
        private Integer period;
        private Integer offsetDay;

        public TasksDto (Long idNum, String taskName, String description, Integer period, Integer offsetDay) {
            this.idNum = idNum;
            this.taskName = taskName;
            this.description = description;
            this.period = period;
            this.offsetDay = offsetDay;
        }

    }


}
