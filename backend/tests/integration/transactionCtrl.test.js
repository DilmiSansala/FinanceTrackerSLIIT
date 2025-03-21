require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Transaction = require('../../model/Transaction');
//npm run test:integration

describe("Small Test for Transaction Model", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should require the Transaction model without errors", async () => {
        expect(Transaction).toBeDefined();
    });

    it("should create a new transaction", async () => {
        const transaction = await Transaction.create({
            user: new mongoose.Types.ObjectId(), // Mock user ID
            type: "expense",
            category: "Groceries",
            amount: 100,
            currency: "USD",
            date: new Date(),
            description: "Weekly groceries",
            tags: ["food", "essential"],
        });

        expect(transaction).toBeDefined();
        expect(transaction.type).toEqual("expense");
        expect(transaction.category).toEqual("Groceries");
        expect(transaction.amount).toEqual(100);
    });
});