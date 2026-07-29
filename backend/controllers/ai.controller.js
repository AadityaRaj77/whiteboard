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


// Helper Validation
function validateNodeIds(nodeIds, res) {

    if (
        !nodeIds ||
        !Array.isArray(nodeIds) ||
        nodeIds.length === 0
    ) {

        res.status(400).json({
            success: false,
            error: "No nodes selected"
        });

        return false;
    }

    return true;
}


// Core AI Processor

async function processAI(nodeIds, promptBuilder) {

    const nodes = await Node.find({
        _id: { $in: nodeIds }
    });

    // Extra safety
    if (nodes.length === 0) {
        throw new Error("Nodes not found");
    }

    // Build structured context
    const context = buildContext(nodes);

    // Generate prompt
    const prompt = promptBuilder(context);

    // Call LLM
    const raw = await callLLM(prompt);

    // Parse response safely
    return safeParseJSON(raw);
}


// Critique

export const critique = async (req, res) => {

    try {

        const { nodeIds } = req.body;

        if (!validateNodeIds(nodeIds, res)) return;

        const result = await processAI(
            nodeIds,
            critiquePrompt
        );

        res.json({
            success: true,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// Expand
export const expand = async (req, res) => {

    try {

        const { nodeIds } = req.body;

        if (!validateNodeIds(nodeIds, res)) return;

        const result = await processAI(
            nodeIds,
            expandPrompt
        );

        res.json({
            success: true,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Validate

export const validate = async (req, res) => {

    try {

        const { nodeIds } = req.body;

        if (!validateNodeIds(nodeIds, res)) return;

        const result = await processAI(
            nodeIds,
            validatePrompt
        );

        res.json({
            success: true,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// Convert → Plan

export const convert = async (req, res) => {

    try {

        const { nodeIds } = req.body;

        if (!validateNodeIds(nodeIds, res)) return;

        const result = await processAI(
            nodeIds,
            convertPrompt
        );

        res.json({
            success: true,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};