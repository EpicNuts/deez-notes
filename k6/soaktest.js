import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  projectID: 'TEST PROJ',
  name: 'Quick Pizza Load Test',
  vus: 10,
  duration: '30s',
};

function main() {
  let res = http.get('https://quickpizza.grafana.com');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}

export default main;
