#!/usr/bin/env node

/**
 * Vercel Readiness Check
 * Verifies that the project is configured correctly for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  warnings: [],
  failed: []
};

console.log('🔍 Checking Vercel readiness...\n');

// Check 1: vercel.json exists
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  checks.passed.push('✅ vercel.json exists');
  try {
    const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (config.buildCommand) checks.passed.push('✅ Build command configured');
    if (config.framework === 'nextjs') checks.passed.push('✅ Framework set to Next.js');
  } catch (e) {
    checks.failed.push('❌ vercel.json is invalid JSON');
  }
} else {
  checks.failed.push('❌ vercel.json not found');
}

// Check 2: Frontend structure
const frontendPath = path.join(process.cwd(), 'frontend');
if (fs.existsSync(frontendPath)) {
  checks.passed.push('✅ Frontend directory exists');
  
  // Check package.json
  const packageJsonPath = path.join(frontendPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    checks.passed.push('✅ Frontend package.json exists');
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.scripts?.build) checks.passed.push('✅ Build script configured');
      if (pkg.dependencies?.next) checks.passed.push('✅ Next.js dependency found');
    } catch (e) {
      checks.failed.push('❌ Frontend package.json is invalid');
    }
  } else {
    checks.failed.push('❌ Frontend package.json not found');
  }
  
  // Check next.config.js
  const nextConfigPath = path.join(frontendPath, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    checks.passed.push('✅ next.config.js exists');
  } else {
    checks.warnings.push('⚠️  next.config.js not found');
  }
  
  // Check API routes
  const apiPath = path.join(frontendPath, 'app', 'api');
  if (fs.existsSync(apiPath)) {
    checks.passed.push('✅ API routes directory exists');
  } else {
    checks.warnings.push('⚠️  No API routes found');
  }
} else {
  checks.failed.push('❌ Frontend directory not found');
}

// Check 3: Environment files
const envExamplePath = path.join(frontendPath, '.env.example');
if (fs.existsSync(envExamplePath)) {
  checks.passed.push('✅ .env.example exists');
} else {
  checks.warnings.push('⚠️  .env.example not found');
}

// Check 4: Git ignore
const gitignorePath = path.join(frontendPath, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const content = fs.readFileSync(gitignorePath, 'utf8');
  if (content.includes('.env')) {
    checks.passed.push('✅ .env files are gitignored');
  } else {
    checks.warnings.push('⚠️  .env files should be in .gitignore');
  }
}

// Check 5: Vercel ignore
const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');
if (fs.existsSync(vercelIgnorePath)) {
  checks.passed.push('✅ .vercelignore exists');
} else {
  checks.warnings.push('⚠️  .vercelignore not found');
}

// Print results
console.log('══════════════════════════════════════');
console.log('✅ PASSED CHECKS:');
console.log('══════════════════════════════════════');
checks.passed.forEach(check => console.log(check));

if (checks.warnings.length > 0) {
  console.log('\n══════════════════════════════════════');
  console.log('⚠️  WARNINGS:');
  console.log('══════════════════════════════════════');
  checks.warnings.forEach(check => console.log(check));
}

if (checks.failed.length > 0) {
  console.log('\n══════════════════════════════════════');
  console.log('❌ FAILED CHECKS:');
  console.log('══════════════════════════════════════');
  checks.failed.forEach(check => console.log(check));
  console.log('\n🚨 Fix the failed checks before deploying!\n');
  process.exit(1);
} else {
  console.log('\n══════════════════════════════════════');
  console.log('🎉 Project is ready for Vercel deployment!');
  console.log('══════════════════════════════════════');
  console.log('\nNext steps:');
  console.log('1. git add . && git commit -m "Prepare for Vercel deployment"');
  console.log('2. git push');
  console.log('3. vercel --prod');
  console.log('\nOr visit: https://vercel.com/new\n');
  process.exit(0);
}
