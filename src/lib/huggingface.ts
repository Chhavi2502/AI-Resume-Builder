import { InferenceClient } from "@huggingface/inference";

const huggingface = new InferenceClient(process.env.HUGGINGFACE_API_KEY!); // note the ! to assert it's not undefined

export default huggingface;
