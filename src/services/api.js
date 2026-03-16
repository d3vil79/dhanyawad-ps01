import { FACILITIES } from './mockData';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function getFacilities() {
  await delay(800);
  return FACILITIES;
}

export async function getFacilityById(id) {
  await delay(400);
  return FACILITIES.find(f => f.id === id) || null;
}

export async function submitReview(facilityId, review) {
  await delay(1000);
  return { success: true, id: Math.random().toString(36).slice(2), facilityId, ...review };
}

export async function pingPreArrival(facilityId, userNeeds) {
  await delay(1500);
  return { success: true, facilityId, estimatedResponse: '15–20 minutes', needs: userNeeds };
}
