import { RequestHandler } from 'express';
import Assignment from '../models/assignment';

// Existing functions
export const getAssignmentMetrics: RequestHandler = async (req, res) => {
  try {
    const metrics = await (Assignment as any).getMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving assignment metrics', error });
  }
};

export const executeAssignment: RequestHandler = async (req, res) => {
  const { assignmentId } = req.body;
  try {
    const result = await (Assignment as any).execute(assignmentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error executing assignment', error });
  }
};

// Added CRUD functions
export const createAssignment: RequestHandler = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating assignment', error });
  }
};

export const getAssignments: RequestHandler = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving assignments', error });
  }
};

export const updateAssignment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error });
  }
};

export const deleteAssignment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error });
  }
};