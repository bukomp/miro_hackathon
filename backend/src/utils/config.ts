import dotenv from 'dotenv';
import { AIConfiguration } from '../interfaces/AI-API/config.interface';

/**
 * Retrieves the value of the specified environment variable.
 *
 * @param {string} key - the name of the environment variable
 * @return {string | undefined} the value of the specified environment variable, or undefined if not found
 */
export const getEnv = (key: string): string | undefined => {
  dotenv.config();
  return process.env[key];
};

/**
 * Retrieves the value of the specified environment variable or throws an error
 * if the variable is missing.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @return {string} The value of the environment variable.
 */
export const getEnvOrThrow = (key: string): string => {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

/**
 * Retrieves the value of the specified environment variable, or returns the
 * default value if the variable is not set.
 *
 * @param {string} key - the name of the environment variable
 * @param {string} defaultValue - the default value to return if the variable
 * is not set
 * @return {string} the value of the specified environment variable, or the
 * default value if the variable is not set
 */
export const getEnvOrDefault = (key: string, defaultValue: any): string => {
  const value = getEnv(key);
  if (!value) {
    return defaultValue;
  }
  return value;
};

// ****** AI API config *******

export const AIConfig: AIConfiguration = {
  baseURL: getEnvOrDefault('AI_BASE_URL', undefined),
  apiKey: getEnvOrThrow('AI_API_KEY'),
  organization: getEnvOrThrow('AI_ORGANIZATION'),
};
