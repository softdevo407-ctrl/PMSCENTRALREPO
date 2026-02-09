package com.pms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestPath = request.getRequestURI();
        String servletPath = request.getServletPath();
        
        log.debug("Request URI: {}, Servlet Path: {}", requestPath, servletPath);
        
        // Skip JWT validation for auth and generics/lookup endpoints
        if (servletPath != null && (servletPath.contains("auth") || servletPath.contains("programme-offices") 
                || servletPath.contains("programme-types") || servletPath.contains("project-activities") 
                || servletPath.contains("project-categories") || servletPath.contains("project-milestones") 
                || servletPath.contains("project-phases-generic") || servletPath.contains("project-status-codes")
                || servletPath.contains("project-types")
                || servletPath.contains("project-details")
                || servletPath.contains("project-actuals")
                || servletPath.contains("sanctioning-authorities")
                || servletPath.contains("budget-centre")
                || servletPath.contains("employee-details"))) {
            log.debug("Skipping JWT validation for public endpoints");
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String token = extractTokenFromRequest(request);
            if (token != null && jwtUtil.validateToken(token)) {
                String employeeCode = jwtUtil.getEmployeeCodeFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(employeeCode);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication: {}", ex.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
