import axios from 'axios';
import Auth from '../Auth/Auth';

const auth = new Auth();
const { isAuthenticated } = auth;
const { getAccessToken } = auth;
const headers = isAuthenticated() ? { Authorization: `Bearer ${getAccessToken()}` } : {};

export const getTimes = async (pathname) => {
  const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${pathname}`);
  return response;
};

export const holdTimeSlot = async (conversationID, startTime) => {
  const result = await axios.post(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/holdtimeslot/${conversationID}`,
    {
      start_time: new Date(startTime)
    }
  );
  return result;
};

export const requestTimes = async (email, message, host) => {
  await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/requestavailability`, {
    email,
    message,
    host
  });
};

export const getDiscussions = async () => {
  const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/dps`);
  return response;
};

export const registered = async () => {
  const response = axios.get(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
    { headers }
  );
  return response;
};

export const register = async (phone_number, first_name, last_name, auth_pic) => {
  const user = await axios.post(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
    {
      phone_number,
      first_name,
      last_name,
      auth_pic
    }, { headers }
  );
  return user;
};

export const addReferent = async (pathname) => {
  const referred = await axios.get(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/addReferent/${pathname}`,
    { headers }
  );
  return referred;
};

export const newUrl = async (otherProfile, email, message) => {
  const response = await axios.post(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/new`,
    {
      otherProfile,
      email,
      message
    }, { headers }
  );
  return response;
};

export const sendError = async (email) => {
  await axios.post(
    `${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
    {
      err: 'referral failed',
      email
    }
  );
};

export const checkTerms = async () => {
  const terms = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/checkTerms`, { headers });
  return terms;
};
