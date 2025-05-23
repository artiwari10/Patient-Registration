// src/components/PatientRegistration.tsx
import React, { useState } from 'react'
import { registerPatient } from '../Database/DatabaseService'
import { useDatabaseContext } from '../Database/DatabaseProvider'

interface PatientFormData {
  first_name: string
  middle_name?: string
  last_name: string
  age: number
  gender: string
  phone: string
  address?: string
  symptoms?: string
  medical_record?: string
  relative_name?: string
  relative_phone?: string
}

const initialFormData: PatientFormData = {
  first_name: '',
  middle_name: '',
  last_name: '',
  age: 0,
  gender: '',
  phone: '',
  address: '',
  symptoms: '',
  medical_record: '',
  relative_name: '',
  relative_phone: '',
}

const PatientRegistration: React.FC = () => {
  const { isInitialized } = useDatabaseContext()
  const [formData, setFormData] = useState<PatientFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }))
    if (errors[name as keyof PatientFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {}
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.age || isNaN(formData.age)) newErrors.age = 'Valid age is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await registerPatient(formData)
      setSubmitSuccess(true)
      setFormData(initialFormData)
      setTimeout(() => setSubmitSuccess(false), 3000)
      console.log('Patient registered successfully:', formData)
    } catch (err) {
      console.log('Error registering patient:', err);
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter patient information to add them to the system
        </p>
      </header>

      {submitSuccess && (
        <div className="mb-6 bg-success-50 border-l-4 border-success-500 p-4 slide-in">
          <div className="flex">
            <svg className="h-5 w-5 text-success-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 
                   00-1.414-1.414L9 10.586 7.707 
                   9.293a1 1 0 00-1.414 1.414l2 
                   2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-success-700">
              Patient registered successfully!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6 grid gap-6 sm:grid-cols-2">
            {/* Personal Info */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <div className="mt-1 h-px bg-gray-200" />
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="form-label">
                First Name <span className="text-error-500">*</span>
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className={`form-input ${
                  errors.first_name
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : ''
                }`}
                required
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-error-600">{errors.first_name}</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label htmlFor="middle_name" className="form-label">
                Middle Name
              </label>
              <input
                id="middle_name"
                name="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="form-label">
                Last Name <span className="text-error-500">*</span>
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className={`form-input ${
                  errors.last_name
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : ''
                }`}
                required
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-error-600">{errors.last_name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="form-label">
                Age <span className="text-error-500">*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={0}
                value={formData.age}
                onChange={handleChange}
                className={`form-input ${
                  errors.age ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''
                }`}
                required
              />
              {errors.age && <p className="mt-1 text-sm text-error-600">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="form-label">
                Gender <span className="text-error-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-input ${
                  errors.gender ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''
                }`}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-error-600">{errors.gender}</p>
              )}
            </div>

            {/* Contact & Medical sections omitted for brevity (use the same pattern)… */}
          </div>

          {/* Form actions */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="mr-3 btn btn-outline text-gray-700"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 
                         7.962 0 014 12H0c0 3.042 1.135 5.824 3 
                         7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientRegistration




