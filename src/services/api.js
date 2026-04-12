// API Service for KerjaIn platform
// Handles authentication and data fetching based on the Postman collection.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

// Auth API
export const authApi = {
  register: async (data) => {
    // data: { name, email, password, password_confirmation, role }
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

// Student API
export const studentApi = {
  startInterestAssessment: async () => {
    const response = await fetch(`${API_BASE_URL}/student/interest/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  submitInterestAnswer: async (data) => {
    // data: { session_id, answer }
    const response = await fetch(`${API_BASE_URL}/student/interest/answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getAllProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/student/progress`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getDetailSkill: async (skillId) => {
    const response = await fetch(`${API_BASE_URL}/student/progress/skills/${skillId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  markCompleteSkill: async (data) => {
    // data: { roadmap_node_id }
    const response = await fetch(`${API_BASE_URL}/student/progress/mark-complete`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getSelfAssessmentQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/student/self-assessment`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  submitSelfAssessment: async (data) => {
    // data: { answers: [{roadmap_node_id, scale}] }
    const response = await fetch(`${API_BASE_URL}/student/self-assessment/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getKnowledgeCheckQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/student/assessment/knowledge-check`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  submitKnowledgeCheck: async (data) => {
    // data: { answers: [{question_id, selected_answer}] }
    const response = await fetch(`${API_BASE_URL}/student/assessment/knowledge-check/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getAllPortfolio: async () => {
    const response = await fetch(`${API_BASE_URL}/student/portfolio`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  addPortfolio: async (data) => {
    // data: { title, summary, is_public }
    const response = await fetch(`${API_BASE_URL}/student/portfolio`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  applyJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

// Professional/HR API
export const hrApi = {
  addJob: async (data) => {
    // data: { title, type, location, description, skills }
    const response = await fetch(`${API_BASE_URL}/professional/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
};
