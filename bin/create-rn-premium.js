#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const projectName = process.argv[2];
if (!projectName) {
  console.error('\x1b[31mError: Please specify the project directory:\x1b[0m');
  console.error('  npx create-rn-premium \x1b[32mmy-awesome-app\x1b[0m\n');
  process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);
if (fs.existsSync(targetDir)) {
  console.error(`\x1b[31mError: Directory ${projectName} already exists.\x1b[0m`);
  process.exit(1);
}

console.log(`\n🚀 Creating new premium React Native App in \x1b[32m${targetDir}\x1b[0m...\n`);
fs.mkdirSync(targetDir, { recursive: true });

// Copy all files from boilerplate folder
const boilerplateDir = path.join(__dirname, '..');

const ignoreList = ['node_modules', '.git', '.husky', 'bin', 'package-lock.json', '.DS_Store', 'dist'];

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (ignoreList.some(item => src.endsWith(item))) return;
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(boilerplateDir, targetDir);

// Re-generate package.json in the target directory
const templatePkg = require(path.join(boilerplateDir, 'package.json'));
delete templatePkg.bin;
templatePkg.name = projectName;
fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(templatePkg, null, 2));

// Generate clean Gitignore
const gitignoreContent = `node_modules/
.expo/
dist/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
`;
fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignoreContent);

// Ask for State Manager choice
rl.question('Select State Manager: [1] Zustand (default) or [2] Redux Toolkit: ', (answer) => {
  if (answer.trim() === '2') {
    console.log('\n📦 Configuring Redux Toolkit state slice...');
    
    // Configure Redux Toolkit files
    const reduxStoreContent = `import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setLoading } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
    fs.mkdirSync(path.join(targetDir, 'src/features/auth/store'), { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'src/features/auth/store/useAuth.ts'), reduxStoreContent);
    
    // Add Redux dependencies to package.json
    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
    pkg.dependencies['@reduxjs/toolkit'] = '^2.2.3';
    pkg.dependencies['react-redux'] = '^9.1.2';
    delete pkg.dependencies['zustand'];
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
  } else {
    console.log('\n📦 Keeping lightweight Zustand store configuration...');
  }
  
  rl.close();

  // Initialize Git & Husky inside the project
  console.log('\n🔧 Running package installation and pre-commit hooks configurations...');
  try {
    execSync('git init', { cwd: targetDir, stdio: 'inherit' });
    console.log('\nInstalling npm dependencies (this may take a minute)...');
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    execSync('npx husky install', { cwd: targetDir, stdio: 'inherit' });
    
    // Recreate husky hooks in project
    fs.mkdirSync(path.join(targetDir, '.husky'), { recursive: true });
    fs.copyFileSync(path.join(boilerplateDir, '.husky/pre-commit'), path.join(targetDir, '.husky/pre-commit'));
    fs.copyFileSync(path.join(boilerplateDir, '.husky/commit-msg'), path.join(targetDir, '.husky/commit-msg'));
    execSync('chmod +x .husky/pre-commit .husky/commit-msg', { cwd: targetDir });
    
    console.log('\n\x1b[32m🎉 Success! Your premium modular React Native App is ready!\x1b[0m\n');
    console.log(`Go to your project:  \x1b[36mcd ${projectName}\x1b[0m`);
    console.log('Start development:  \x1b[36mnpm run start\x1b[0m');
    console.log('Run code check:     \x1b[36mnpm run check\x1b[0m\n');
  } catch (err) {
    console.error('Error during setup installation:', err.message);
  }
});
