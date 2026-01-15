package com.pms.repository;

import com.pms.entity.EmployeeDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeDetailsRepository extends JpaRepository<EmployeeDetails, String> {
    List<EmployeeDetails> findByRegStatus(String regStatus);
    List<EmployeeDetails> findByCentre(String centre);
}
