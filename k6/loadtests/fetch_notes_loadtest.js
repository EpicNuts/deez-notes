import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  projectID: __ENV.GRAFANA_PROJECT_ID || '3787225',
  name: 'Fetch Newest Note Load Test',
  vus: 10,
  duration: '30s',
};

function main() {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const userId = __ENV.LOAD_TEST_USERID;
  const url = `${BASE_URL}/api/fetch-newest-note?userId=${userId}`;
  const headers = { 'Content-Type': 'application/json' };


  let res = http.get(url, { headers });
  check(res, { 
    "status is 200": (res) => res.status === 200 || res.status === 201,
    "newestNoteId exists": (r) => r.json('newestNoteId') !== undefined,
  });
  sleep(1);
}

export default main;
