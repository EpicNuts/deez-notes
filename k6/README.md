# K6 Performance Testing Strategy

## 🎯 **Performance & Load Testing Focus**

This document outlines our performance testing strategy focused on **system behavior under load**, scalability limits, and performance regression detection. K6 tests validate application performance characteristics at scale.

## 🧭 **Testing Philosophy**

**Performance Tests (K6) focus on:**
- System behavior under concurrent user load
- API response times and throughput limits
- Database performance under stress conditions
- Memory and resource utilization patterns
- Scalability bottlenecks and breaking points

**Other Test Frameworks Handle:**
- **E2E Tests (Cypress)**: Complete user workflows and business logic
- **Component Tests (Playwright)**: UI component behavior and interactions

## 📊 **Current Status**

### ✅ **Existing Load Tests**
- **Create Note Load Test**: `loadtests/create_note_loadtest.js` - Note creation performance
- **Fetch Notes Load Test**: `loadtests/fetch_notes_loadtest.js` - Note retrieval performance

### ✅ **Existing Stress Tests**
- **Stress Test**: `stresstest.js` - System limits under high load
- **Spike Test**: `spiketest.js` - Sudden traffic surge handling  
- **Soak Test**: `soaktest.js` - Long-duration stability testing

### 🔧 **In Development**
- **Sidebar Update Performance**: Planning phase
- **Real-time Sync Performance**: Planning phase

## 🚀 **Quick Start**

### **Environment Setup**
```bash
# Set required environment variables
export $(grep -E '^(LOAD_TEST_USERID|LOCAL_HOST)=' .env.local | xargs)
```

### **Running Tests**
```bash
# Run load tests locally
k6 run -e LOAD_TEST_USERID=$LOAD_TEST_USERID -e BASE_URL=$LOCAL_HOST k6/loadtests/create_note_loadtest.js

# Run with cloud execution
k6 cloud run --local-execution -e LOAD_TEST_USERID=$LOAD_TEST_USERID -e BASE_URL=$LOCAL_HOST k6/loadtests/fetch_notes_loadtest.js

# Run stress tests
k6 run -e BASE_URL=$LOCAL_HOST k6/stresstest.js
```

---

## 🗺️ **Performance Testing Roadmap**

### **Phase 1: Core Performance Validation** ⭐ **(Priority: HIGH)**

#### 1.1 ✅ Basic Load Testing (Complete)
- Note creation under normal load conditions
- Note retrieval with multiple concurrent users
- Database query performance validation

#### 1.2 Sidebar Update Performance ⭐ (Next)
- **Real-time Update Load**: Multiple users creating notes simultaneously
- **Context State Performance**: Large note lists with frequent updates  
- **Navigation Performance**: Rapid note switching under load

#### 1.3 ✅ System Limits Testing (Complete)
- Maximum concurrent user capacity
- Breaking point identification
- System stability over extended periods

---

### **Phase 2: Advanced Performance Scenarios**

#### 2.1 AI Integration Performance
- **AI Query Load**: Multiple users asking questions simultaneously
- **Large Context Performance**: AI queries with many notes
- **Response Time Validation**: AI response delivery under load

#### 2.2 Data Scale Performance  
- **Large Note Performance**: System behavior with very long notes
- **Many Notes Performance**: Users with 1000+ notes
- **Search Performance**: Search functionality with large datasets

---

## 🛠️ **Technical Architecture**

### **Performance Test Categories**
```javascript
// Load Testing - Normal expected usage
export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at load  
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

// Stress Testing - Beyond normal capacity  
export let options = {
  stages: [
    { duration: '10m', target: 200 }, // High load
    { duration: '5m', target: 0 },    // Recovery
  ],
};
```

### **Performance Metrics Focus**
- **Response Time**: < 200ms for note operations under normal load
- **Throughput**: > 100 requests/second sustained
- **Error Rate**: < 0.1% under normal load, < 1% under stress
- **Resource Usage**: Memory and CPU within acceptable limits

---