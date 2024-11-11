import { instance } from "./instance";
import { AxiosError } from "axios";

interface IScenario {
  responseText: null;
  currentStep: number;
  nextStep: number;
  resources: null;
  task: null;
}

export const getScenarioApi = async (code: number): Promise<IScenario> => {
  try {
    const response = await instance.get(`/scenarios/${code}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `AxiosError: Request failed with status code ${error.response?.status}`
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

interface IMoveToNextScenarioApiProps {
  code: number;
  index: number;
  message?: string;
}

export const moveToNextScenarioApi = async (
  data: IMoveToNextScenarioApiProps
) => {
  const { code, index, message } = data;
  try {
    const response = await instance.post(`/scenarios/${code}/steps/${index}`, {
      message,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `AxiosError: Request failed with status code ${error.response?.status}`
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

export const deleteScenarioStepsApi = async (
  code: number
): Promise<IScenario> => {
  try {
    const response = await instance.delete(`/scenarios/${code}`);
    console.log(response.data);
    console.log("refreshSuccess");

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        `AxiosError: Request failed with status code ${error.response?.status}`
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};
