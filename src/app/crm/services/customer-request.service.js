// customer-request.service.js
import axios from 'axios'
import CustomerRequest from '../model/customer-request.entity.js'

const API_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/serviceRequests' // ajustar según tu db.json

export const getCustomerRequests = async () => {
    const response = await axios.get(API_URL)
    return response.data.map(request => new CustomerRequest(request))
}

export const createCustomerRequest = async (requestData) => {
    const request = new CustomerRequest({
        ...requestData,
        createdAt: new Date().toISOString()
    })
    const response = await axios.post(API_URL, request.toJSON())
    return new CustomerRequest(response.data)
}

export const updateCustomerRequest = async (id, requestData) => {
    const response = await axios.put(`${API_URL}/${id}`, requestData)
    return new CustomerRequest(response.data)
}

export const deleteCustomerRequest = async (id) => {
    await axios.delete(`${API_URL}/${id}`)
}

export const assignStaffToRequest = async (id, staffId) => {
    const response = await axios.get(`${API_URL}/${id}`)
    const request = new CustomerRequest(response.data)
    request.assignStaff(staffId)
    const updated = await axios.put(`${API_URL}/${id}`, request.toJSON())
    return new CustomerRequest(updated.data)
}

export const resolveCustomerRequest = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    const request = new CustomerRequest(response.data)
    request.resolve()
    const updated = await axios.put(`${API_URL}/${id}`, request.toJSON())
    return new CustomerRequest(updated.data)
}