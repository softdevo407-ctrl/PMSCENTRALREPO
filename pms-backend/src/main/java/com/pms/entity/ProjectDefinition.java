package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_definitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String projectName;

    @Column(nullable = false, unique = true)
    private String shortName;

    @Column(nullable = false)
    private String programmeName;

    @Column(nullable = true)
    private Long programmeId;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String budgetCode;

    @Column(nullable = true)
    private String projectType;

    @Column(nullable = false)
    private String leadCentre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_director_id", nullable = true)
    private User projectDirector;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "programme_director_id", nullable = true)
    private User programmeDirector;

    @Column(nullable = true)
    private String projectDocumentPath;

    @Column(nullable = false)
    private Long sanctionedAmount;

    @Column(nullable = false)
    private LocalDate sanctionedDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private Long revisedSanctionedAmount;

    private LocalDate revisedEndDate;

    private String revisedDateRemarks;

    private Boolean revisedDateApprovedByChairman;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.ON_TRACK;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}

