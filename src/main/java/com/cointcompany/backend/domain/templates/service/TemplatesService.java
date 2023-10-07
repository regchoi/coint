package com.cointcompany.backend.domain.templates.service;

import com.cointcompany.backend.domain.templates.entity.Templates;
import com.cointcompany.backend.domain.templates.repository.TemplatesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class TemplatesService {

    private final TemplatesRepository templatesRepository;

    public Templates saveTemplates(Templates template) {
        return templatesRepository.save(template);
    }
}
