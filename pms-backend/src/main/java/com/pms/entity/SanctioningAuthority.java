package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sanctioningauthority", schema = "pmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanctioningAuthority {

    @Id
    @Column(name = "sanctioningauthoritycode", length = 4)
    private String sanctioningAuthorityCode;

    @Column(name = "sanctioningauthorityfullname", nullable = false, length = 255)
    private String sanctioningAuthorityFullName;

    @Column(name = "sanctioningauthorityshortname", nullable = false, length = 50)
    private String sanctioningAuthorityShortName;

    @Column(name = "hierarchyorder", nullable = false)
    private Integer hierarchyOrder;

    @Column(name = "fromdate", nullable = false)
    private LocalDate fromDate;

    @Column(name = "todate")
    private LocalDate toDate;

    @Column(name = "userid", nullable = false, length = 7)
    private String userId;

    @Column(name = "regstatus", nullable = false, length = 1)
    private String regStatus;

    @Column(name = "regtime")
    private LocalDate regTime;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
