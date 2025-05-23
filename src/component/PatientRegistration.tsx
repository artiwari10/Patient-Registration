import React, { useState } from 'react';
import { registerPatient } from '../Database/DatabaseService';
import { useDatabaseContext } from '../Database/DatabaseProvider';

interface PatientFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  age: string;
  gender: string;
  number: string;
  address: string;
  symptoms: string;
  previous_medical_record: string;
  relative_name: string;
  relative_contact: string;
}

const initialFormData: PatientFormData = {
  first_name: '',
  middle_name: '',
  last_name: '',
  age: '',
  gender: '',
  number: '',
  address: '',
  symptoms: '',
  previous_medical_record: '',
  relative_name: '',
  relative_contact: '',
};

const PatientRegistration: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};
    const phoneRegex = /^\+?\d{10,15}$/; 
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    const ageNum = Number(formData.age);
    if (!formData.age.trim() || isNaN(ageNum)) {
      newErrors.age = 'Valid age is required';
    } else if (ageNum > 112) {
      newErrors.age = 'Age cannot be greater than 112';
    }

    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.number.trim()) {
      newErrors.number = 'Contact number is required';
    } else if (!phoneRegex.test(formData.number.trim())) {
      newErrors.number = 'Enter a valid phone number (10-15 digits, may start with +)';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required';

    if (!formData.relative_name.trim()) newErrors.relative_name = 'Relative name is required';

    if (!formData.relative_contact.trim()) {
      newErrors.relative_contact = 'Relative contact is required';
    } else if (!phoneRegex.test(formData.relative_contact.trim())) {
      newErrors.relative_contact = 'Enter a valid phone number (10-15 digits, may start with +)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await registerPatient(formData);
      setSubmitSuccess(true);
      setFormData(initialFormData);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error registering patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto page-transition">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-200">Register New Patient</h1>
        <p className="mt-2 text-base text-gray-400">
          Fill out the form below to add a new patient to Database.
        </p>
      </header>

      {submitSuccess && (
        <div className="mb-6 bg-green-900 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-200 text-sm">Patient registered successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-gray-900 shadow-xl rounded-lg border border-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-indigo-300 mb-1">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.first_name ? 'border-red-500' : ''}`}
                required
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="middle_name" className="block text-indigo-300 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-indigo-300 mb-1">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.last_name ? 'border-red-500' : ''}`}
                required
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-indigo-300 mb-1">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.age ? 'border-red-500' : ''}`}
                required
                min={0}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-400">{errors.age}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-indigo-300 mb-1">
                Gender <span className="text-red-400">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.gender ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-400">{errors.gender}</p>
              )}
            </div>

            <div>
              <label htmlFor="number" className="block text-indigo-300 mb-1">
                Contact Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.number ? 'border-red-500' : ''}`}
                required
                placeholder="(+91) 9876543210"
              />
              {errors.number && (
                <p className="mt-1 text-xs text-red-400">{errors.number}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-indigo-300 mb-1">
                Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.address ? 'border-red-500' : ''}`}
                required
                placeholder="Street address, city, state, zip"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-400">{errors.address}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="symptoms" className="block text-indigo-300 mb-1">
                Symptoms <span className="text-red-400">*</span>
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={2}
                value={formData.symptoms}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.symptoms ? 'border-red-500' : ''}`}
                required
                placeholder="Describe symptoms"
              ></textarea>
              {errors.symptoms && (
                <p className="mt-1 text-xs text-red-400">{errors.symptoms}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="previous_medical_record" className="block text-indigo-300 mb-1">
                Previous Medical Record
              </label>
              <textarea
                id="previous_medical_record"
                name="previous_medical_record"
                rows={2}
                value={formData.previous_medical_record}
                onChange={handleChange}
                className="w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2"
                placeholder="Any relevant medical history"
              ></textarea>
            </div>

            <div>
              <label htmlFor="relative_name" className="block text-indigo-300 mb-1">
                Relative Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="relative_name"
                name="relative_name"
                value={formData.relative_name}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.relative_name ? 'border-red-500' : ''}`}
                required
              />
              {errors.relative_name && (
                <p className="mt-1 text-xs text-red-400">{errors.relative_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="relative_contact" className="block text-indigo-300 mb-1">
                Relative Contact <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="relative_contact"
                name="relative_contact"
                value={formData.relative_contact}
                onChange={handleChange}
                className={`w-full rounded bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 p-2 ${errors.relative_contact ? 'border-red-500' : ''}`}
                required
                placeholder="(+91) 9876543210"
              />
              {errors.relative_contact && (
                <p className="mt-1 text-xs text-red-400">{errors.relative_contact}</p>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-800 text-right rounded-b-lg">
            <button
              type="button"
              className="mr-3 px-4 py-2 rounded border border-indigo-400 text-indigo-200 hover:bg-gray-700 hover:text-white transition"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-semibold shadow transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
