// Form validation utilities with comprehensive error handling

export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  },
  PHONE: {
    pattern: /^[0-9]{10}$/,
    message: 'Please enter a valid 10-digit phone number'
  },
  NAME: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-50 characters and contain only letters and spaces'
  },
  OTP: {
    pattern: /^[0-9]{6}$/,
    message: 'Please enter a valid 6-digit verification code'
  }
};

export const validateField = (value, rule, fieldName = 'Field') => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }

  const trimmedValue = value.trim();

  switch (rule) {
    case 'email':
      if (!VALIDATION_RULES.EMAIL.pattern.test(trimmedValue)) {
        return VALIDATION_RULES.EMAIL.message;
      }
      break;

    case 'password':
      if (trimmedValue.length < VALIDATION_RULES.PASSWORD.minLength) {
        return `Password must be at least ${VALIDATION_RULES.PASSWORD.minLength} characters long`;
      }
      if (!VALIDATION_RULES.PASSWORD.pattern.test(trimmedValue)) {
        return VALIDATION_RULES.PASSWORD.message;
      }
      break;

    case 'phone':
      if (!VALIDATION_RULES.PHONE.pattern.test(trimmedValue)) {
        return VALIDATION_RULES.PHONE.message;
      }
      break;

    case 'name':
      if (trimmedValue.length < VALIDATION_RULES.NAME.minLength) {
        return `Name must be at least ${VALIDATION_RULES.NAME.minLength} characters long`;
      }
      if (trimmedValue.length > VALIDATION_RULES.NAME.maxLength) {
        return `Name must be no more than ${VALIDATION_RULES.NAME.maxLength} characters long`;
      }
      if (!VALIDATION_RULES.NAME.pattern.test(trimmedValue)) {
        return VALIDATION_RULES.NAME.message;
      }
      break;

    case 'otp':
      if (!VALIDATION_RULES.OTP.pattern.test(trimmedValue)) {
        return VALIDATION_RULES.OTP.message;
      }
      break;

    case 'required':
      if (trimmedValue === '') {
        return `${fieldName} is required`;
      }
      break;

    default:
      return null;
  }

  return null;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    // Check required field
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${rules.label || field} is required`;
      isValid = false;
      return;
    }

    // Skip validation if field is empty and not required
    if (!value || value.trim() === '') {
      return;
    }

    // Validate each rule
    if (rules.type) {
      const error = validateField(value, rules.type, rules.label || field);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// Common validation rules for forms
export const FORM_VALIDATION_RULES = {
  LOGIN: {
    email: {
      required: true,
      type: 'email',
      label: 'Email'
    },
    password: {
      required: true,
      type: 'required',
      label: 'Password'
    }
  },

  REGISTER: {
    firstName: {
      required: true,
      type: 'name',
      label: 'First Name'
    },
    lastName: {
      required: true,
      type: 'name',
      label: 'Last Name'
    },
    email: {
      required: true,
      type: 'email',
      label: 'Email'
    },
    password: {
      required: true,
      type: 'password',
      label: 'Password'
    },
    confirmPassword: {
      required: true,
      type: 'required',
      label: 'Confirm Password',
      custom: (value, formData) => {
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return null;
      }
    }
  },

  FORGOT_PASSWORD: {
    email: {
      required: true,
      type: 'email',
      label: 'Email'
    }
  },

  RESET_PASSWORD: {
    newPassword: {
      required: true,
      type: 'password',
      label: 'New Password'
    },
    confirmPassword: {
      required: true,
      type: 'required',
      label: 'Confirm Password',
      custom: (value, formData) => {
        if (value !== formData.newPassword) {
          return 'Passwords do not match';
        }
        return null;
      }
    }
  },

  CHANGE_PASSWORD: {
    currentPassword: {
      required: true,
      type: 'required',
      label: 'Current Password'
    },
    newPassword: {
      required: true,
      type: 'password',
      label: 'New Password'
    },
    confirmPassword: {
      required: true,
      type: 'required',
      label: 'Confirm Password',
      custom: (value, formData) => {
        if (value !== formData.newPassword) {
          return 'Passwords do not match';
        }
        return null;
      }
    }
  },

  EMAIL_VERIFICATION: {
    otp: {
      required: true,
      type: 'otp',
      label: 'Verification Code'
    }
  },

  PROFILE: {
    firstName: {
      required: true,
      type: 'name',
      label: 'First Name'
    },
    lastName: {
      required: true,
      type: 'name',
      label: 'Last Name'
    },
    email: {
      required: true,
      type: 'email',
      label: 'Email'
    },
    phone: {
      required: false,
      type: 'phone',
      label: 'Phone Number'
    },
    bio: {
      required: false,
      type: 'required',
      label: 'Bio',
      custom: (value) => {
        if (value && value.length > 500) {
          return 'Bio must be no more than 500 characters';
        }
        return null;
      }
    }
  }
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, strength: 'Very Weak', message: 'Password is required' };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score++;
  });

  let strength, message;
  if (score <= 2) {
    strength = 'Very Weak';
    message = 'Password is too weak. Add more characters and variety.';
  } else if (score === 3) {
    strength = 'Weak';
    message = 'Password is weak. Add more character types.';
  } else if (score === 4) {
    strength = 'Medium';
    message = 'Password is okay but could be stronger.';
  } else {
    strength = 'Strong';
    message = 'Password is strong!';
  }

  return { score, strength, message, checks };
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  const errorMessages = Object.values(errors);
  if (errorMessages.length === 0) return '';
  if (errorMessages.length === 1) return errorMessages[0];
  return errorMessages.join('\n');
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export default {
  VALIDATION_RULES,
  validateField,
  validateForm,
  FORM_VALIDATION_RULES,
  checkPasswordStrength,
  formatValidationErrors,
  sanitizeInput
};
