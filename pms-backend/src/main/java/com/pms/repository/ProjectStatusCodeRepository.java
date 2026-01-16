package com.pms.repository;

import com.pms.entity.ProjectStatusCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectStatusCodeRepository extends JpaRepository<ProjectStatusCode, String> {
    List<ProjectStatusCode> findByRegStatus(String regStatus);
}
