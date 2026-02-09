# PMSApp Docker Deployment Script for Windows
# This script automates Docker deployment for PMSApp

param(
    [ValidateSet("build", "start", "stop", "restart", "logs", "clean", "rebuild")]
    [string]$action = "start"
)

function Write-Header {
    param([string]$message)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Check-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        $composeVersion = docker-compose --version 2>$null
        
        if ($dockerVersion -and $composeVersion) {
            Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
            Write-Host "✓ Docker Compose found: $composeVersion" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Docker or Docker Compose not found" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ Error checking Docker installation" -ForegroundColor Red
        return $false
    }
}

switch ($action) {
    "build" {
        Write-Header "Building Docker Images"
        if (Check-Docker) {
            Write-Host "Building frontend, backend, and pulling PostgreSQL image..." -ForegroundColor Yellow
            docker-compose build
            Write-Host "✓ Build completed!" -ForegroundColor Green
        }
    }
    
    "start" {
        Write-Header "Starting PMSApp Services"
        if (Check-Docker) {
            Write-Host "Starting all services in background..." -ForegroundColor Yellow
            docker-compose up -d
            Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
            Start-Sleep -Seconds 3
            docker-compose ps
            Write-Host ""
            Write-Host "✓ Services started!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Access points:" -ForegroundColor Cyan
            Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
            Write-Host "  Backend API: http://localhost:7080/api" -ForegroundColor White
            Write-Host "  Database: localhost:5432 (postgres/postgres)" -ForegroundColor White
        }
    }
    
    "stop" {
        Write-Header "Stopping PMSApp Services"
        if (Check-Docker) {
            Write-Host "Stopping all services..." -ForegroundColor Yellow
            docker-compose down
            Write-Host "✓ Services stopped!" -ForegroundColor Green
        }
    }
    
    "restart" {
        Write-Header "Restarting PMSApp Services"
        if (Check-Docker) {
            Write-Host "Restarting all services..." -ForegroundColor Yellow
            docker-compose restart
            Write-Host "✓ Services restarted!" -ForegroundColor Green
            Start-Sleep -Seconds 2
            docker-compose ps
        }
    }
    
    "logs" {
        Write-Header "Viewing Service Logs"
        if (Check-Docker) {
            Write-Host "Press Ctrl+C to exit logs" -ForegroundColor Yellow
            docker-compose logs -f
        }
    }
    
    "clean" {
        Write-Header "Cleaning Up (Without Removing Data)"
        if (Check-Docker) {
            Write-Host "Stopping and removing containers..." -ForegroundColor Yellow
            docker-compose down
            Write-Host "✓ Cleanup completed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Note: Database volume is preserved" -ForegroundColor Cyan
        }
    }
    
    "rebuild" {
        Write-Header "Full Rebuild (Removes All Data)"
        if (Check-Docker) {
            Write-Host "WARNING: This will delete all data including the database!" -ForegroundColor Red
            $confirm = Read-Host "Are you sure? (yes/no)"
            
            if ($confirm -eq "yes") {
                Write-Host "Stopping and removing all containers and volumes..." -ForegroundColor Yellow
                docker-compose down -v
                
                Write-Host "Building fresh images..." -ForegroundColor Yellow
                docker-compose build --no-cache
                
                Write-Host "Starting services..." -ForegroundColor Yellow
                docker-compose up -d
                
                Start-Sleep -Seconds 3
                Write-Host "✓ Rebuild completed!" -ForegroundColor Green
                docker-compose ps
            } else {
                Write-Host "Rebuild cancelled" -ForegroundColor Yellow
            }
        }
    }
    
    default {
        Write-Header "PMSApp Docker Deployment Script"
        Write-Host "Usage: .\docker-deploy.ps1 -action [action]" -ForegroundColor White
        Write-Host ""
        Write-Host "Available actions:" -ForegroundColor Cyan
        Write-Host "  build      - Build Docker images" -ForegroundColor White
        Write-Host "  start      - Start all services" -ForegroundColor White
        Write-Host "  stop       - Stop all services" -ForegroundColor White
        Write-Host "  restart    - Restart all services" -ForegroundColor White
        Write-Host "  logs       - View live logs" -ForegroundColor White
        Write-Host "  clean      - Stop and remove containers (keep data)" -ForegroundColor White
        Write-Host "  rebuild    - Full clean rebuild (removes all data)" -ForegroundColor White
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  .\docker-deploy.ps1 -action start" -ForegroundColor Gray
        Write-Host "  .\docker-deploy.ps1 -action stop" -ForegroundColor Gray
        Write-Host "  .\docker-deploy.ps1 -action logs" -ForegroundColor Gray
    }
}
