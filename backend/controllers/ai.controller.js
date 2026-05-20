import { Node } from '../models/Node.js';
import { buildContext } from '../services/contextBuilder.service.js';
import { callLLM } from '../services/ai.service.js';
import {
    critiquePrompt,
    expandPrompt,
    validatePrompt,
    convertPrompt
} from '../services/promptTemplates.js';

import { safeParseJSON } from '../utils/parseJSON.js';

async function processAI(nodeIds, promptBuilder) {
    const nodes = await Node.find({ _id: { $in: nodeIds } });

    const context = buildContext(nodes);
    const prompt = promptBuilder(context);

    const raw = await callLLM(prompt);

    return safeParseJSON(raw);
}

// 🔥 Critique
export const critique = async (req, res) => {
    try {
        const { nodeIds } = req.body;
        const result = await processAI(nodeIds, critiquePrompt);

        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ⚡ Expand
export const expand = async (req, res) => {
    try {
        const { nodeIds } = req.body;
        const result = await processAI(nodeIds, expandPrompt);

        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🧪 Validate
export const validate = async (req, res) => {
    try {
        const { nodeIds } = req.body;
        const result = await processAI(nodeIds, validatePrompt);

        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 🚀 Convert → Plan
export const convert = async (req, res) => {
    try {
        const { nodeIds } = req.body;
        const result = await processAI(nodeIds, convertPrompt);

        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};