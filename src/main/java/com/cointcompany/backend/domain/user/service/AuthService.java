package com.cointcompany.backend.domain.user.service;

import com.cointcompany.backend.domain.user.entity.Auth;
import com.cointcompany.backend.domain.user.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.swing.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthService {

    private final AuthRepository authRepository;


    public Auth findById(String id) { return authRepository.findById(id); }

    public Auth findByPassword(String password) { return authRepository.findByPassword(password); }
}
