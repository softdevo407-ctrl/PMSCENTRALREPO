package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "employeedetails", schema = "pmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDetails {

    @Id
    @Column(name = "employeecode", length = 7)
    private String employeeCode;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "presentdesignationfullname", nullable = false, length = 100)
    private String presentDesignationFullName;

    @Column(name = "centre", nullable = false, length = 20)
    private String centre;

    @Column(name = "userid", nullable = false, length = 7)
    private String userId;

    @Column(name = "regstatus", nullable = false, length = 1)
    private String regStatus;

    @Column(name = "regtime")
    private LocalDate regTime;
}
