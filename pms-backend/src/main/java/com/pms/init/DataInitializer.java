package com.pms.init;

import com.pms.entity.Role;
import com.pms.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        String[] roles = {"PROJECT_DIRECTOR", "PROGRAMME_DIRECTOR", "CHAIRMAN", "ADMIN"};
        String[] descriptions = {
            "Project Director Role - Manages individual projects",
            "Programme Director Role - Oversees multiple programs",
            "Chairman Role - Executive oversight",
            "Administrator Role - Full system access"
        };

        for (int i = 0; i < roles.length; i++) {
            String roleName = roles[i];
            if (!roleRepository.findByName(roleName).isPresent()) {
                Role role = Role.builder()
                        .name(roleName)
                        .description(descriptions[i])
                        .active(true)
                        .build();
                roleRepository.save(role);
                log.info("Created role: {}", roleName);
            } else {
                log.info("Role already exists: {}", roleName);
            }
        }
    }
}
