# Docker Build - Network Connection Issue

## ⚠️ Issue
Docker cannot reach Docker Hub (registry.docker.io) to pull base images.

**Error:** `i/o timeout` when trying to authenticate with Docker Hub

---

## 🔧 Solutions

### Solution 1: Check Internet Connection
```powershell
# Test connectivity
Test-NetConnection -ComputerName docker.io -Port 443
ping google.com
```

### Solution 2: Restart Docker Desktop
1. Open Docker Desktop
2. Settings → General → Restart Docker
3. Then retry: `docker-compose build`

### Solution 3: Use VPN/Proxy (if behind corporate firewall)
If your organization requires VPN:
1. Connect to your VPN
2. Then try: `docker-compose build`

### Solution 4: Configure Docker Daemon (if proxy needed)
Edit Docker Desktop Settings:
1. Settings → Docker Engine
2. Add proxy configuration:
```json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"],
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.example.com:8080",
      "httpsProxy": "https://proxy.example.com:8080"
    }
  }
}
```

### Solution 5: Use Offline Method (No Internet)
If you have no internet, see OFFLINE_DEPLOYMENT.md guide

---

## ✅ Once Connected, Run This

```powershell
# Clear any failed build cache
docker system prune -a

# Rebuild with verbose output
docker-compose build --progress=plain

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

---

## 📋 Troubleshooting Steps

1. **Ensure Docker Desktop is running**
   - Check system tray
   - Verify "Docker Desktop is running" message

2. **Check Network Connectivity**
   ```powershell
   # Test if you can reach internet
   Test-NetConnection -ComputerName 8.8.8.8 -Port 53
   
   # Test if you can reach Docker
   Invoke-WebRequest "https://hub.docker.com" -UseBasicParsing
   ```

3. **Check Firewall**
   - Windows Defender Firewall may block Docker
   - Add Docker Desktop to firewall exceptions

4. **Configure DNS**
   - Docker Settings → Resources → Network
   - Ensure DNS is set correctly

---

## 📞 Next Steps

1. **Verify internet connection**
2. **Restart Docker Desktop**
3. **Try build again**:
   ```powershell
   cd f:\21012026\PMSApp
   docker-compose build
   ```

4. **If still failing**, contact your network administrator if behind corporate proxy

---

**Status:** Waiting for network connection to Docker Hub

Once connected, your build will complete in ~5-10 minutes! 🚀
