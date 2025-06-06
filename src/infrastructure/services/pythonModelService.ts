// infrastructure/services/pythonModelService.ts
import axios from "axios";
import { ModelService } from "../../domain/services/aiServices";

export class PythonModelService implements ModelService {
    async predictChurn(payload: {
        data: Record<string, any>[];
    }): Promise<any> {
        try {
            const response = await axios.post(`${process.env.PYTHON_MODEL_URL}/predict`, payload);
            return response.data;
        } catch (error) {
            console.error("Error in PythonModelService:", error);
            throw new Error("Failed to call Python model service");
        }
    }
}
