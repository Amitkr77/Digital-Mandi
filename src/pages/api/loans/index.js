// pages/api/loans.js - Handles GET (list) and POST (create) for loans
import Joi from 'joi'; // npm i joi
import { getSession } from 'next-auth/react'; // Assuming NextAuth for auth; adjust if custom
import dbConnect from '../../../lib/dbConnect'; // Your Mongoose connection helper
import Loan from '../../../models/Loan'; // Refined schema from before
import Farmer from '../../../models/Farmer';

// Validation schema (same as before)
const createLoanSchema = Joi.object({
    amount: Joi.number().min(1).required(),
    interestRate: Joi.number().min(0).max(36).required(),
    duration: Joi.number().min(1).required(),
    purpose: Joi.string()
        .valid('Seeds/Fertilizer', 'Equipment', 'Crop Maintenance', 'Emergency', 'Harvest Advance', 'Other')
        .required(),
    type: Joi.string().valid('Loan', 'Advance').default('Loan'),
    collateral: Joi.string().allow(''),
    guarantor: Joi.object({
        name: Joi.string().allow(''),
        relation: Joi.string().allow(''),
        contact: Joi.string().allow('')
    }).allow(null),
    remarks: Joi.string().allow(''),
    linkedTransaction: Joi.string() // Optional ObjectId
});

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect(); // Ensure DB connection

    if (req.method === 'GET') {
        // List farmer's loans
        try {
            const { status, page = '1', limit = '10' } = req.query;
            const query = { farmerId: session.user.id };
            if (status) query.status = status;

            const loans = await Loan.find(query)
                .sort({ issueDate: -1 })
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .populate('linkedTransaction', 'produce amount');

            const total = await Loan.countDocuments(query);

            res.status(200).json({
                loans,
                pagination: { 
                    page: parseInt(page), 
                    limit: parseInt(limit), 
                    total, 
                    pages: Math.ceil(total / parseInt(limit)) 
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch loans' });
        }
    } else if (req.method === 'POST') {
        // Create new loan application
        try {
            // Joi validation
            const { error: joiError } = createLoanSchema.validate(req.body);
            if (joiError) return res.status(400).json({ error: joiError.details[0].message });

            // Fetch farmer for creditScore and name
            const farmer = await Farmer.findById(session.user.id).select('name creditScore produceHistory');
            if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

            if (farmer.creditScore < 500) {
                return res.status(400).json({ error: 'Credit score too low. Improve via consistent sales.' });
            }

            const loanData = {
                farmerId: session.user.id,
                farmerName: farmer.name,
                creditScore: farmer.creditScore,
                ...req.body,
                status: 'Pending'
            };

            const loan = new Loan(loanData);
            await loan.save(); // Triggers pre-save for dueDate/EMI

            // Update farmer's loans array (if added to schema)
            farmer.loans = farmer.loans || [];
            farmer.loans.push(loan._id);
            await farmer.save();

            res.status(201).json({
                message: 'Loan application submitted',
                loan: {
                    id: loan._id,
                    emiAmount: loan.emiAmount,
                    dueDate: loan.dueDate,
                    totalPayable: loan.amount + (loan.amount * loan.interestRate * loan.duration / 100 / 12) // Approx; refine
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create loan' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
