# PMS - Offline Setup Guide

This guide provides complete instructions for transferring and running the PMS (Project Management System) on an offline system with NO internet required.

## Prerequisites

- **Node.js** (v18.0.0 or higher) - Must be installed on the offline system
- **npm** (comes with Node.js) - v9.0.0 or higher
- **Sufficient Disk Space** - ~500MB for node_modules and project

## Step 1: Prepare on Online System

### 1.1 Install All Dependencies (ONLINE SYSTEM ONLY)
```bash
cd f:\PBEMS\PBEMS
npm install
```

This will download and install:
- ✅ React 19.2.3
- ✅ React-DOM 19.2.3
- ✅ Lucide-React (all icons - no internet needed)
- ✅ Recharts (charts library - bundled)
- ✅ Vite 6.2.0 (build tool)
- ✅ TypeScript 5.8.2
- ✅ Tailwind CSS 3.4.0 (with all utilities)
- ✅ PostCSS & Autoprefixer
- ✅ All peer dependencies

### 1.2 Verify Installation
```bash
npm list
```

### 1.3 Build the Project (Optional - for production)
```bash
npm run build
```

This creates a `dist/` folder with optimized, fully bundled code.

## Step 2: Transfer to Offline System

### 2.1 What to Transfer
Copy the ENTIRE project folder to your offline system:
```
F:\PBEMS\PBEMS\
├── node_modules/              ✅ REQUIRED - All dependencies
├── src/                        ✅ Source code
├── dist/                       ✅ Built files (if step 1.3 completed)
├── public/                     ✅ Static assets (if any)
├── index.html                  ✅ Main HTML
├── package.json                ✅ DO NOT SKIP
├── package-lock.json           ✅ Important for exact versions
├── vite.config.ts              ✅ Build configuration
├── tsconfig.json               ✅ TypeScript config
├── tailwind.config.js          ✅ Tailwind configuration
├── postcss.config.js           ✅ PostCSS configuration
└── ...other config files
```

### 2.2 Transfer Method
**Option A: USB Drive**
- Copy entire folder to USB (~300-400MB with node_modules)
- Transfer to offline system
- Paste in desired location

**Option B: External Hard Drive**
- Copy entire folder to external HD
- Transfer to offline system
- Copy to desired location

**Option C: Network Share (if available)**
- Copy via local network to offline system

### 2.3 Verify Transfer
After transfer, check that:
```bash
# On offline system
ls F:\PBEMS\PBEMS\node_modules    # Should show many folders
ls F:\PBEMS\PBEMS\src            # Should show .tsx files
cat F:\PBEMS\PBEMS\package.json   # Should show all dependencies
```

## Step 3: Run on Offline System

### 3.1 Navigate to Project
```bash
cd F:\PBEMS\PBEMS
```

### 3.2 Start Development Server
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 3.3 Open in Browser
- Go to `http://localhost:5173/`
- Application loads COMPLETELY OFFLINE ✅
- No external requests needed

### 3.4 Stop Server
Press `CTRL + C` in terminal

## Step 4: Production Build (Optional)

For a production-optimized build with no runtime dependencies:

```bash
npm run build
```

This creates:
- `dist/index.html` - Optimized HTML
- `dist/assets/` - Bundled JavaScript and CSS
- No external dependencies required to serve

To preview production build:
```bash
npm run preview
```

## What's Been Removed

❌ **Google Fonts CDN** - Replaced with system fonts
❌ **Tailwind CDN** - Now built locally via npm
❌ **External import maps (esm.sh)** - Replaced with local node_modules
❌ **All online resources** - Completely self-contained

## What's Included (No Internet Needed)

✅ **All React & Lucide icons** - Bundled locally
✅ **All Tailwind utilities** - Generated locally  
✅ **All TypeScript types** - Included in dependencies
✅ **All Recharts components** - Bundled for charts
✅ **Vite build tool** - Everything local
✅ **Live reload** - Works on localhost only

## Troubleshooting

### Issue: Port 5173 already in use
```bash
npm run dev -- --port 5174
```
Use any available port (5174, 5175, etc.)

### Issue: node_modules folder missing
```bash
# This will NOT work offline
npm install

# Solution: Transfer node_modules from online system
```

### Issue: Build fails with "module not found"
- Verify `package-lock.json` was transferred
- Verify `node_modules/` folder exists
- Check file permissions (may need to reset after transfer)

### Issue: TypeScript errors
```bash
# Clear cache and rebuild
rm -r dist node_modules/.vite
npm run build
```

### Issue: Port already in use or connection refused
```bash
# Verify Vite server is running
netstat -ano | findstr :5173

# Or use a different port
npm run dev -- --port 6173
```

## System Requirements

**Minimum:**
- CPU: Dual-core 1.5 GHz
- RAM: 2GB (4GB recommended)
- Storage: 500MB free
- Node.js: v18.0.0+

**Recommended:**
- CPU: Quad-core 2.5 GHz
- RAM: 8GB
- Storage: 1GB free
- Node.js: v18.0.0+

## Performance Notes

1. **First run** - May take 10-30 seconds to start
2. **Development** - Hot reload works perfectly offline
3. **Build time** - ~5-15 seconds for production build
4. **File size** - dist/ folder ~200KB (fully optimized)

## File Structure After Setup

```
F:\PBEMS\PBEMS\
├── node_modules/                          # All dependencies (required)
│   ├── react/
│   ├── react-dom/
│   ├── lucide-react/                      # All 5000+ icons
│   ├── recharts/                          # Chart components
│   ├── vite/
│   ├── typescript/
│   ├── tailwindcss/
│   └── ...
├── src/
│   ├── components/
│   │   ├── pages/                         # All page components
│   │   ├── Dashboard.tsx
│   │   ├── StartPage.tsx
│   │   └── ...
│   ├── pbemData.ts                        # Sample data (offline)
│   ├── pbemTypes.ts                       # Types
│   ├── main.tsx
│   └── index.css
├── dist/                                  # Production build (created by npm run build)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── vite.svg
├── index.html                             # Entry point
├── package.json                           # Project config
├── package-lock.json                      # Locked versions
├── vite.config.ts                         # Vite config
├── tsconfig.json                          # TypeScript config
├── tailwind.config.js                     # Tailwind config
├── postcss.config.js                      # PostCSS config
└── README.md
```

## Demo Credentials (Offline)

The system uses hardcoded sample data - no login server needed:

**Project Director:**
- Username: Rajesh Kumar
- Password: (any, hardcoded in data)

**Programme Director:**
- Username: Priya Sharma

**Chairman:**
- Username: Vikram Singh

All data is stored locally in `src/pbemData.ts` - no external database.

## Updating on Offline System

If you need to update code while offline:

1. Edit files in `src/` folder
2. Save changes
3. Browser auto-refreshes (Vite hot reload)
4. No internet needed

## Exporting/Sharing

To move to another offline system:

```bash
# On source system
# Files already ready, just copy folder

# Transfer everything again following Step 2
```

## Support & Troubleshooting

For build/runtime issues:
```bash
# Check Node.js version
node --version    # Should be v18+

# Check npm version
npm --version     # Should be v9+

# Verify installation
npm list
```

## Next Steps

1. ✅ Install dependencies on online system
2. ✅ Transfer entire folder to offline system
3. ✅ Run `npm run dev` on offline system
4. ✅ Access at `http://localhost:5173/`
5. ✅ System works 100% offline

**That's it! Completely offline PMS system ready to use.**

---

*Last Updated: January 2026*
*Project: PMS v1.0*
*Status: Fully Offline Compatible ✅*
