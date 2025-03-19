import { RequestHandler } from 'express';
import { DeliveryPartner } from '../models/partner';

export const registerPartner: RequestHandler = async (req, res) => {
    try {
        const partner = new DeliveryPartner(req.body);
        await partner.save();
        // Do not return the response, just send it
        res.status(201).json(partner);
    } catch (error) {
        // Cast unknown to Error, then use error.message
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
};

export const getAllPartners: RequestHandler = async (req, res) => {
    try {
        const partners = await DeliveryPartner.find();
        res.status(200).json(partners);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

export const updatePartner: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await DeliveryPartner.findByIdAndUpdate(id, req.body, { new: true });
        if (!partner) {
            res.status(404).json({ message: 'Partner not found' });
            return;
        }
        res.status(200).json(partner);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
};

export const getPartnerById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await DeliveryPartner.findById(id);
        if (!partner) {
            res.status(404).json({ message: 'Partner not found' });
            return;
        }
        res.status(200).json(partner);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};