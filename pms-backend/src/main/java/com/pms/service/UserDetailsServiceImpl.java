package com.pms.service;

import com.pms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String employeeCode) throws UsernameNotFoundException {
        return userRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with employee code: " + employeeCode
                ));
    }
}
