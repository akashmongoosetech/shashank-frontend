// Integration Test Script
// Run this in browser console to test API integration

const API_BASE_URL = 'http://localhost:5000';

// Test functions
const testAPI = {
  // Test health endpoint
  async testHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      console.log('✅ Health Check:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Health Check Failed:', error);
      return false;
    }
  },

  // Test contact creation
  async testContactCreation() {
    try {
      const contactData = {
        name: 'Integration Test User',
        email: 'test@integration.com',
        subject: 'API Integration Test',
        message: 'This is a test message to verify API integration is working correctly.'
      };

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();
      console.log('✅ Contact Creation:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Contact Creation Failed:', error);
      return false;
    }
  },

  // Test appointment creation
  async testAppointmentCreation() {
    try {
      const appointmentData = {
        name: 'Integration Test User',
        email: 'test@integration.com',
        phone: '+1234567890',
        treatmentType: 'Acne Treatment',
        preferredDate: '2024-12-31',
        preferredTime: '10:00 AM',
        message: 'This is a test appointment to verify API integration.'
      };

      const response = await fetch(`${API_BASE_URL}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();
      console.log('✅ Appointment Creation:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Appointment Creation Failed:', error);
      return false;
    }
  },

  // Test contact list
  async testContactList() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`);
      const data = await response.json();
      console.log('✅ Contact List:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Contact List Failed:', error);
      return false;
    }
  },

  // Test appointment list
  async testAppointmentList() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointment`);
      const data = await response.json();
      console.log('✅ Appointment List:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Appointment List Failed:', error);
      return false;
    }
  },

  // Test statistics
  async testStatistics() {
    try {
      const [contactStats, appointmentStats] = await Promise.all([
        fetch(`${API_BASE_URL}/api/contact/stats/summary`),
        fetch(`${API_BASE_URL}/api/appointment/stats/summary`)
      ]);

      const contactData = await contactStats.json();
      const appointmentData = await appointmentStats.json();

      console.log('✅ Contact Statistics:', contactData);
      console.log('✅ Appointment Statistics:', appointmentData);
      return contactData.success && appointmentData.success;
    } catch (error) {
      console.error('❌ Statistics Failed:', error);
      return false;
    }
  },

  // Test treatments endpoint
  async testTreatments() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointment/treatments`);
      const data = await response.json();
      console.log('✅ Treatments:', data);
      return data.success;
    } catch (error) {
      console.error('❌ Treatments Failed:', error);
      return false;
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting API Integration Tests...');
    console.log('='.repeat(50));

    const tests = [
      { name: 'Health Check', fn: this.testHealth },
      { name: 'Contact Creation', fn: this.testContactCreation },
      { name: 'Appointment Creation', fn: this.testAppointmentCreation },
      { name: 'Contact List', fn: this.testContactList },
      { name: 'Appointment List', fn: this.testAppointmentList },
      { name: 'Statistics', fn: this.testStatistics },
      { name: 'Treatments', fn: this.testTreatments }
    ];

    const results = [];
    for (const test of tests) {
      console.log(`\n🔍 Testing ${test.name}...`);
      const result = await test.fn.call(this);
      results.push({ name: test.name, success: result });
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results Summary:');
    console.log('='.repeat(50));

    let passed = 0;
    results.forEach(result => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} - ${result.name}`);
      if (result.success) passed++;
    });

    console.log('='.repeat(50));
    console.log(`🎯 Overall: ${passed}/${results.length} tests passed`);
    
    if (passed === results.length) {
      console.log('🎉 All tests passed! API integration is working perfectly!');
    } else {
      console.log('⚠️ Some tests failed. Check the errors above.');
    }

    return results;
  }
};

// Export for use
window.testAPI = testAPI;

// Auto-run tests if backend is available
console.log('🔧 API Integration Test Script Loaded');
console.log('Run testAPI.runAllTests() to test the integration');
console.log('Or run individual tests like testAPI.testHealth()');

// Check if backend is available
fetch(`${API_BASE_URL}/health`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('✅ Backend is available! Ready to test.');
      console.log('Run: testAPI.runAllTests()');
    }
  })
  .catch(error => {
    console.log('❌ Backend is not available. Make sure it\'s running on port 5000.');
    console.log('Start backend with: cd bhargawa-backend && npm run dev');
  });
