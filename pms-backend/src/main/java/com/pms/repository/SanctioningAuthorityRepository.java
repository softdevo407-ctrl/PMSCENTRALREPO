package com.pms.repository;

import com.pms.entity.SanctioningAuthority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SanctioningAuthorityRepository extends JpaRepository<SanctioningAuthority, String> {

    @Query("SELECT sa FROM SanctioningAuthority sa WHERE sa.regStatus = 'A' ORDER BY sa.hierarchyOrder")
    List<SanctioningAuthority> findAllActive();

    @Query("SELECT sa FROM SanctioningAuthority sa WHERE sa.regStatus = 'I' ORDER BY sa.hierarchyOrder")
    List<SanctioningAuthority> findAllInactive();

    @Query("SELECT sa FROM SanctioningAuthority sa ORDER BY sa.hierarchyOrder")
    List<SanctioningAuthority> findAllOrdered();

    Optional<SanctioningAuthority> findBySanctioningAuthorityCode(String code);

    boolean existsBySanctioningAuthorityCode(String code);
}
