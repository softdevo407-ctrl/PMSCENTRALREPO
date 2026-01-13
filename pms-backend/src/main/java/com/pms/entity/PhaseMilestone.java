package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "phase_milestones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhaseMilestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "phase_id", nullable = false)
    private ProjectPhase phase;

    @Column(nullable = false)
    private String milestoneName;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private LocalDate revisedEndDate;

    @Column(nullable = false)
    private Integer milestoneWeight;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer milestoneOrder = 0;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MilestoneActivity> activities;

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
