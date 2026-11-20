import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const BASE_URL = 'https://dummyjson.com';

const RATE = Number(__ENV.RATE || 50);
const DURATION = __ENV.DURATION || '1m';

const successfulProducts = new Counter('successful_products');

export const options = {
  scenarios: {
    product_creation: {
      executor: 'constant-arrival-rate',
      rate: RATE,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.max(50, RATE * 2),
      maxVUs: Math.max(100, RATE * 5),
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    dropped_iterations: ['count==0'],
  },
};

export function setup() {
  const loginPayload = JSON.stringify({
    username: __ENV.LOGIN_USERNAME || 'emilys',
    password: __ENV.LOGIN_PASSWORD || 'emilyspass',
  });

  const loginResponse = http.post(
    `${BASE_URL}/auth/login`,
    loginPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
  });

  if (loginResponse.status !== 200) {
    throw new Error(
      `Authentication failed: ${loginResponse.status}`
    );
  }

  const loginData = loginResponse.json();
  const token = loginData.accessToken || loginData.token;

  if (!token) {
    throw new Error('JWT token was not returned');
  }

  return { token };
}

export default function (data) {
  const uniqueTitle =
    `Performance-${RATE}-${__VU}-${__ITER}-${Date.now()}`;

  const payload = JSON.stringify({
    title: uniqueTitle,
    price: 1.23,
  });

  const response = http.post(
    `${BASE_URL}/products/add`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const checksPassed = check(response, {
    'status is 201': (r) => r.status === 201,
    'response contains title': (r) =>
      r.json('title') === uniqueTitle,
    'response contains product id': (r) =>
      r.json('id') !== undefined,
  });

  if (checksPassed) {
    successfulProducts.add(1);
  }
}