#!/usr/bin/env node

/**
 * Admin Integration Test Script
 * 
 * This script tests the admin API endpoints to ensure proper integration
 * between the frontend and backend.
 */

const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TEST_TOKEN = process.env.TEST_ADMIN_TOKEN || 'your-admin-jwt-token-here';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const tests = [
  {
    name: 'Admin Dashboard Stats',
    method: 'GET',
    endpoint: '/admin/dashboard/stats',
    expectedStatus: 200
  },
  {
    name: 'Recent Activities',
    method: 'GET',
    endpoint: '/admin/dashboard/recent-activities',
    expectedStatus: 200
  },
  {
    name: 'Users List',
    method: 'GET',
    endpoint: '/admin/users?page=1&limit=10',
    expectedStatus: 200
  },
  {
    name: 'Blogs List',
    method: 'GET',
    endpoint: '/admin/blogs?page=1&limit=10',
    expectedStatus: 200
  },
  {
    name: 'Roles List',
    method: 'GET',
    endpoint: '/admin/roles',
    expectedStatus: 200
  },
  {
    name: 'System Health',
    method: 'GET',
    endpoint: '/admin/system/health',
    expectedStatus: 200
  },
  {
    name: 'Audit Logs',
    method: 'GET',
    endpoint: '/admin/system/audit-logs',
    expectedStatus: 200
  }
];

async function runTest(test) {
  try {
    console.log(`🧪 Testing: ${test.name}`);
    
    const response = await api({
      method: test.method,
      url: test.endpoint
    });
    
    if (response.status === test.expectedStatus) {
      console.log(`✅ ${test.name} - PASSED (${response.status})`);
      return { ...test, status: 'PASSED', response: response.data };
    } else {
      console.log(`❌ ${test.name} - FAILED (Expected: ${test.expectedStatus}, Got: ${response.status})`);
      return { ...test, status: 'FAILED', error: `Status mismatch` };
    }
  } catch (error) {
    console.log(`❌ ${test.name} - ERROR: ${error.message}`);
    return { ...test, status: 'ERROR', error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Admin Integration Tests...\n');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`🔐 Using Token: ${TEST_TOKEN ? 'Provided' : 'Missing'}\n`);
  
  if (!TEST_TOKEN || TEST_TOKEN === 'your-admin-jwt-token-here') {
    console.log('⚠️  WARNING: No valid admin token provided. Tests may fail.');
    console.log('   Set TEST_ADMIN_TOKEN environment variable with a valid JWT token.\n');
  }
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  // Summary
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🚨 Errors: ${errors}`);
  console.log(`📈 Total: ${results.length}`);
  
  if (passed === results.length) {
    console.log('\n🎉 All tests passed! Admin integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your backend configuration.');
  }
  
  return results;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, runTest };
