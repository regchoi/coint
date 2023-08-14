package com.cointcompany.backend.common.config;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.users.entity.Users;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import com.nimbusds.oauth2.sdk.util.JWTClaimsSetUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * AuditorAware를 상속받은 구현체로 @CreatedBy, @LastModifiedBy에 넣을 값을 설정
 */
@Configuration
public class AuditorAwareImpl implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl users = (UserDetailsImpl) authentication.getPrincipal();

        return Optional.of(users.getUserId());
    }

}
